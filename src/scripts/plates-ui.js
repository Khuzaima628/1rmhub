/**
 * HTML for plate-loading results, shared by the plate loader and the warm-up
 * table. All numbers arrive in the display unit; all text is escaped/numeric.
 */
import { esc, num } from './dom.js';

/** CSS-drawn bar with plates; largest plates sit nearest the collar on both sides. */
export function plateDiagram(perSide, unit) {
  if (!perSide.length) return '';
  const box = (p) => {
    const h = Math.round(26 + p * (unit === 'kg' ? 1.8 : 1.1));
    return `<span class="plate" style="height:${h}px" aria-hidden="true">${esc(num(p))}</span>`;
  };
  const left = [...perSide].reverse().map(box).join('');
  const right = perSide.map(box).join('');
  const label = `Plates per side: ${perSide.map((p) => num(p)).join(', ')} ${unit}`;
  return `<div class="plate-bar" role="img" aria-label="${esc(label)}">${left}<span class="bar"></span>${right}</div>`;
}

/** Full result block for one plate-loading request. */
export function plateResultHtml(solved, { target, bar, unit, platesTicked }) {
  if (solved.belowBar) {
    return `<div class="result-box"><p><strong>${esc(num(target))} ${unit} is lighter than the empty bar
      (${esc(num(bar))} ${unit}).</strong> Nothing can be loaded without going over your target — use a
      lighter bar, dumbbells, or set a custom bar weight.</p></div>`;
  }
  const perSide = solved.perSide;
  const loadLine = perSide.length
    ? `${perSide.map((p) => num(p)).join(' + ')} ${unit} on each side`
    : 'the empty bar, no plates';
  let note;
  if (solved.shortfall <= 0.0005) {
    note = 'Exact match with your plates.';
  } else if (!platesTicked) {
    note = 'No plate sizes are ticked, so only the bar can be loaded.';
  } else {
    note = `<strong>${esc(num(solved.shortfall))} ${unit} under</strong> your ${esc(num(target))} ${unit}
      target — no combination of your plates reaches it exactly, so we rounded down rather than up.`;
  }
  return `<div class="result-box">
    <p class="plate-load"><strong>Load ${esc(num(solved.loaded))} ${unit}</strong>: ${esc(loadLine)}.</p>
    ${plateDiagram(perSide, unit)}
    <p class="disclaimer">${note}</p>
  </div>`;
}
