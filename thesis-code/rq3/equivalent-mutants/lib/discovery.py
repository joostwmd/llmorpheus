"""Discover mutant datasets under organized/ (or artifacts/)."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


RUN_PATTERN = re.compile(r"^run(\d+)$", re.IGNORECASE)


@dataclass(frozen=True)
class MutantDatasetRef:
    llm: str
    run: str
    run_number: int
    package: str
    mutants_json: Path
    mutation_html: Path | None
    stryker_info: Path | None

    @property
    def key(self) -> str:
        return f"{self.llm}/{self.run}/{self.package}"


def parse_run_name(run_dir_name: str) -> int | None:
    match = RUN_PATTERN.match(run_dir_name)
    if not match:
        return None
    return int(match.group(1))


def discover_datasets(
    source_dir: Path,
    *,
    packages: Iterable[str] | None = None,
    skip_dirs: Iterable[str] | None = None,
) -> list[MutantDatasetRef]:
    if not source_dir.is_dir():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    package_filter = set(packages) if packages else None
    skip = set(skip_dirs or {"_workflow"})
    refs: list[MutantDatasetRef] = []

    for llm_dir in sorted(p for p in source_dir.iterdir() if p.is_dir()):
        for run_dir in sorted(p for p in llm_dir.iterdir() if p.is_dir()):
            run_number = parse_run_name(run_dir.name)
            if run_number is None:
                continue
            for package_dir in sorted(p for p in run_dir.iterdir() if p.is_dir()):
                if package_dir.name in skip:
                    continue
                if package_filter and package_dir.name not in package_filter:
                    continue
                mutants_json = package_dir / "mutants.json"
                if not mutants_json.is_file():
                    continue
                stryker_info = package_dir / "StrykerInfo.json"
                mutation_html = package_dir / "mutation.html"
                refs.append(
                    MutantDatasetRef(
                        llm=llm_dir.name,
                        run=run_dir.name,
                        run_number=run_number,
                        package=package_dir.name,
                        mutants_json=mutants_json,
                        mutation_html=mutation_html if mutation_html.is_file() else None,
                        stryker_info=stryker_info if stryker_info.is_file() else None,
                    )
                )
    return refs
