import fs from "fs";
import path from "path";
import { createCanvas } from "canvas";
import { ensureDir } from "./paths.js";

const COLORS = ["#4C78A8", "#F58518", "#E45756", "#72B7B2", "#54A24B", "#EECA3B", "#B279A2"];

function drawTitle(ctx, title, width) {
  if (!title) return;
  ctx.fillStyle = "#111";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 22);
}

export async function barChart(outPath, data, { x, y, title, xTitle, yTitle }) {
  const width = 720;
  const height = 420;
  const margin = { top: 48, right: 24, bottom: 96, left: 72 };
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  drawTitle(ctx, title, width);

  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const maxY = Math.max(...data.map((d) => Number(d[y]) || 0), 1);

  const barW = plotW / Math.max(data.length, 1) - 8;
  data.forEach((d, i) => {
    const val = Number(d[y]) || 0;
    const barH = (val / maxY) * plotH;
    const bx = margin.left + i * (plotW / data.length) + 4;
    const by = margin.top + plotH - barH;
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fillRect(bx, by, barW, barH);
    ctx.fillStyle = "#333";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(bx + barW / 2, height - margin.bottom + 12);
    ctx.rotate(-0.5);
    ctx.fillText(String(d[x]).slice(0, 18), 0, 0);
    ctx.restore();
  });

  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.stroke();

  if (yTitle) {
    ctx.save();
    ctx.translate(16, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#333";
    ctx.font="11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(yTitle, 0, 0);
    ctx.restore();
  }

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
}

export async function groupedBarChart(outPath, data, { x, y, color, title }) {
  await barChart(outPath, data, { x, y, title });
}

export async function scatterChart(outPath, data, { x, y, title, xTitle, yTitle, labelField }) {
  const width = 720;
  const height = 420;
  const margin = { top: 48, right: 24, bottom: 64, left: 72 };
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  drawTitle(ctx, title, width);

  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const xs = data.map((d) => Number(d[x]) || 0);
  const ys = data.map((d) => Number(d[y]) || 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs, minX + 1e-9);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys, minY + 1e-9);

  const scaleX = (v) => margin.left + ((v - minX) / (maxX - minX || 1)) * plotW;
  const scaleY = (v) => margin.top + plotH - ((v - minY) / (maxY - minY || 1)) * plotH;

  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + plotH);
  ctx.lineTo(margin.left + plotW, margin.top + plotH);
  ctx.stroke();

  data.forEach((d, i) => {
    const px = scaleX(Number(d[x]) || 0);
    const py = scaleY(Number(d[y]) || 0);
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#333";
  ctx.font = "11px sans-serif";
  ctx.textAlign = "center";
  if (xTitle) ctx.fillText(xTitle, margin.left + plotW / 2, height - 20);
  if (yTitle) {
    ctx.save();
    ctx.translate(18, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yTitle, 0, 0);
    ctx.restore();
  }

  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
}

export async function renderChart(outPath, spec) {
  // Fallback: not used directly
  await barChart(outPath, spec.data?.values ?? [], { x: "x", y: "y", title: spec.title });
}
