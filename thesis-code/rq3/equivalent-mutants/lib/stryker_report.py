"""Parse Stryker HTML reports to identify surviving mutants."""

from __future__ import annotations

import json
import re
import subprocess
from collections import Counter, defaultdict
from pathlib import Path


def _parse_script_path() -> Path:
    return Path(__file__).resolve().parent / "parse_stryker_report.cjs"


def _extract_report_json(mutation_html: Path) -> dict:
    script = _parse_script_path()
    if not script.is_file():
        raise FileNotFoundError(f"Missing parser script: {script}")
    proc = subprocess.run(
        ["node", str(script), str(mutation_html)],
        check=False,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        stderr = proc.stderr.strip() or proc.stdout.strip() or "unknown error"
        raise ValueError(f"Failed to parse {mutation_html}: {stderr}")
    return json.loads(proc.stdout)


def _flatten_stryker_mutants(report: dict) -> list[dict]:
    mutants: list[dict] = []
    for file_data in report.get("files", {}).values():
        mutants.extend(file_data.get("mutants", []))
    return mutants


def normalize_replacement(text: str) -> str:
    normalized = "".join(str(text).split())
    normalized = re.sub(r"\((\w+)\)=>", r"\1=>", normalized)
    if normalized.startswith("(") and normalized.endswith(")"):
        inner = normalized[1:-1]
        if inner.count("(") == inner.count(")"):
            normalized = inner
    return normalized


def _replacements_match(survivor_replacement: str, mutant_replacement: str) -> bool:
    if survivor_replacement == mutant_replacement:
        return True
    if not survivor_replacement or not mutant_replacement:
        return False
    return (
        survivor_replacement in mutant_replacement
        or mutant_replacement in survivor_replacement
    )


def mutant_match_key(mutant: dict) -> tuple[str, int, int, str]:
    file_name = str(mutant.get("file", "")).replace("\\", "/").lower()
    line = int(mutant.get("startLine", mutant.get("line", 0)))
    column = int(mutant.get("startColumn", mutant.get("column", 0)))
    replacement = str(mutant.get("replacement", mutant.get("mutantCode", "")))
    return (file_name, line, column, replacement)


def parse_mutant_statuses(mutation_html: Path) -> dict[tuple[str, int, int, str], str]:
    if not mutation_html.is_file():
        raise FileNotFoundError(f"Missing Stryker report: {mutation_html}")
    report = _extract_report_json(mutation_html)
    statuses: dict[tuple[str, int, int, str], str] = {}
    for file_name, file_data in report.get("files", {}).items():
        normalized_file = str(file_name).replace("\\", "/").lower()
        for mutant in file_data.get("mutants", []):
            location = mutant.get("location", {}).get("start", {})
            key = (
                normalized_file,
                int(location.get("line", 0)),
                int(location.get("column", 0)),
                str(mutant.get("replacement", "")),
            )
            statuses[key] = str(mutant.get("status", ""))
    if not statuses:
        raise ValueError(f"No mutant records parsed from {mutation_html}")
    return statuses


def _match_by_index(mutants: list[dict], mutation_html: Path) -> list[dict]:
    report = _extract_report_json(mutation_html)
    stryker_mutants = _flatten_stryker_mutants(report)
    if len(stryker_mutants) != len(mutants):
        raise ValueError("Stryker report and mutants.json length mismatch")
    return [
        mutants[index]
        for index, stryker_mutant in enumerate(stryker_mutants)
        if stryker_mutant.get("status") == "Survived"
    ]


def _match_by_location(mutants: list[dict], mutation_html: Path) -> list[dict]:
    statuses = parse_mutant_statuses(mutation_html)
    survivors_by_location: dict[tuple[str, int, int], Counter[str]] = defaultdict(Counter)
    for (file_name, line, column, replacement), status in statuses.items():
        if status != "Survived":
            continue
        location = (file_name, line, column - 1)
        survivors_by_location[location][normalize_replacement(replacement)] += 1

    mutants_by_location: dict[tuple[str, int, int], list[tuple[int, str]]] = defaultdict(list)
    for index, mutant in enumerate(mutants):
        file_name, line, column, replacement = mutant_match_key(mutant)
        mutants_by_location[(file_name, line, column)].append(
            (index, normalize_replacement(replacement))
        )

    matched_indices: set[int] = set()
    for location, survivor_counts in survivors_by_location.items():
        available = [
            (index, normalized_replacement)
            for index, normalized_replacement in mutants_by_location.get(location, [])
            if index not in matched_indices
        ]
        remaining_survivors = survivor_counts.copy()

        for index, normalized_replacement in list(available):
            if remaining_survivors[normalized_replacement] <= 0:
                continue
            matched_indices.add(index)
            remaining_survivors[normalized_replacement] -= 1

        available = [
            pair for pair in available if pair[0] not in matched_indices
        ]
        survivor_keys = [
            replacement
            for replacement, count in remaining_survivors.items()
            for _ in range(count)
        ]
        for survivor_replacement in list(survivor_keys):
            for index, mutant_replacement in list(available):
                if not _replacements_match(survivor_replacement, mutant_replacement):
                    continue
                matched_indices.add(index)
                available.remove((index, mutant_replacement))
                survivor_keys.remove(survivor_replacement)
                remaining_survivors[survivor_replacement] -= 1
                break

        unmatched_survivors = len(survivor_keys)
        unmatched_mutants = [
            pair for pair in available if pair[0] not in matched_indices
        ]
        if unmatched_survivors == 1 and len(unmatched_mutants) == 1:
            matched_indices.add(unmatched_mutants[0][0])

    return [mutants[index] for index in sorted(matched_indices)]


def filter_surviving_mutants(mutants: list[dict], mutation_html: Path) -> list[dict]:
    """Keep only mutants that Stryker marked as Survived."""
    report = _extract_report_json(mutation_html)
    stryker_mutants = _flatten_stryker_mutants(report)
    if len(stryker_mutants) == len(mutants):
        return _match_by_index(mutants, mutation_html)
    return _match_by_location(mutants, mutation_html)
