/**
 * Training tables rendered in the browser from an estimated or tested 1RM.
 * Shared by the 1RM calculator and the percentage calculator so both show the
 * same rounding and wording.
 */
import { percentageTable, repMaxTable, fromKg, loadStep } from '../lib/onerepmax.js';
import { esc, f1, num } from './dom.js';

/**
 * Percentage table. "Loadable" always rounds DOWN to the nearest 2.5 kg / 5 lb,
 * so it never exceeds the exact percentage. Each row can send its loadable
 * weight to the plate loader (sc:load-plates event, handled by PlateLoader).
 */
export function percentTableHtml(e1rmKg, unit, { caption, plateButtons = true }) {
  const rows = percentageTable(e1rmKg, unit).map((row) => `
    <tr>
      <th scope="row">${row.pct}%</th>
      <td class="num">${f1(row.raw)} ${unit}</td>
      <td class="num">${esc(num(row.loadable))} ${unit}</td>
      ${plateButtons ? `<td><button type="button" class="btn btn-small" data-load-plates="${row.loadable}">Load plates</button></td>` : ''}
    </tr>`).join('');
  return `<div class="table-wrap"><table>
    <caption>${esc(caption)}</caption>
    <thead><tr><th scope="col">% of 1RM</th><th scope="col" class="num">Exact</th>
      <th scope="col" class="num">Loadable</th>${plateButtons ? '<th scope="col">Plates</th>' : ''}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="disclaimer">“Loadable” rounds <em>down</em> to the nearest ${num(loadStep(unit))} ${unit}, so it never exceeds the exact percentage.</p>`;
}

/** 2RM–10RM estimates (Epley solved backwards). */
export function repMaxTableHtml(e1rmKg, unit) {
  const rows = repMaxTable(e1rmKg).map((row) => `
    <tr><th scope="row">${row.reps}RM</th><td class="num">${f1(fromKg(row.value, unit))} ${unit}</td></tr>`).join('');
  return `<div class="table-wrap"><table>
    <caption>Estimated weight for each rep target, from the Average Estimate</caption>
    <thead><tr><th scope="col">Target</th><th scope="col" class="num">Estimated weight</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

/** Forward "Load plates" clicks inside a container to the plate loader. */
export function wirePlateButtons(container, getUnit) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-load-plates]');
    if (!btn) return;
    document.dispatchEvent(new CustomEvent('sc:load-plates', {
      detail: { target: Number(btn.dataset.loadPlates), unit: getUnit() },
    }));
  });
}
