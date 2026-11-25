/**
 * "Your bar and plates" settings (markup from GearFields.astro), shared by the
 * plate loader and the warm-up generator. One instance per settings block,
 * cached so two widgets pointing at the same block share the same state.
 */
import { BAR_PRESETS, KG_PLATES, LB_PLATES, LB_EXTRA_PLATES, MAX_PAIRS, MAX_WEIGHT } from '../lib/onerepmax.js';
import { esc, num, parseList } from './dom.js';

const cache = new WeakMap();

export function getGear(root) {
  if (!cache.has(root)) cache.set(root, createGear(root));
  return cache.get(root);
}

function createGear(root) {
  const barSel = root.querySelector('[data-gear-bar]');
  const customWrap = root.querySelector('[data-gear-custom-wrap]');
  const custom = root.querySelector('[data-gear-custom]');
  const checks = root.querySelector('[data-gear-plates]');
  const extra = root.querySelector('[data-gear-extra]');
  const unitLabels = root.querySelectorAll('[data-unit-label]');
  const limitOn = root.querySelector('[data-gear-limit]');
  const limitsBox = root.querySelector('[data-gear-limits]');
  const limitNote = limitsBox.querySelector('.hint');
  const listeners = new Set();
  // GearFields.astro pre-renders the options for its initial unit (no layout
  // shift, usable before JS runs); setUnit only rebuilds on a real change.
  let unit = root.dataset.unit || null;

  const notify = () => listeners.forEach((fn) => fn());
  barSel.addEventListener('change', () => {
    customWrap.hidden = barSel.value !== 'custom';
    notify();
  });
  custom.addEventListener('input', notify);
  checks.addEventListener('change', notify);
  extra.addEventListener('change', notify);
  limitOn.addEventListener('change', () => {
    limitsBox.hidden = !limitOn.checked;
    notify();
  });
  limitsBox.addEventListener('input', notify);

  /** Rebuild the bar presets and plate list for a unit (no-op if unchanged, so ticks survive). */
  function setUnit(next) {
    if (next === unit) return;
    unit = next;
    unitLabels.forEach((el) => { el.textContent = unit; });
    const presets = BAR_PRESETS.filter((b) => b.unit === unit);
    barSel.innerHTML = presets
      .map((b, i) => `<option value="${b.value}"${i === 0 ? ' selected' : ''}>${esc(b.label)}</option>`)
      .join('') + '<option value="custom">Custom…</option>';
    customWrap.hidden = true;
    custom.value = String(presets[0].value);
    extra.value = ''; // sizes typed for one unit are meaningless in the other
    // Extra sizes (55 lb) are offered but unticked: most gyms do not have them.
    const plates = unit === 'kg' ? KG_PLATES.map((p) => ({ p, on: true }))
      : [...LB_EXTRA_PLATES.map((p) => ({ p, on: false })), ...LB_PLATES.map((p) => ({ p, on: true }))];
    checks.innerHTML = plates
      .map(({ p, on }) => `<label><input type="checkbox" value="${p}"${on ? ' checked' : ''} /> ${num(p)} ${unit}</label>`)
      .join('');
    limitsBox.innerHTML = plates
      .map(({ p }) => `<label>Pairs of ${num(p)} ${unit} <input type="number" inputmode="numeric" min="0" max="${MAX_PAIRS}" step="1" placeholder="any" autocomplete="off" data-pairs="${p}" /></label>`)
      .join('');
    limitsBox.append(limitNote);
  }

  /** Bar weight in the current unit: { ok, value } or { ok: false, error, input }. */
  function bar() {
    if (barSel.value !== 'custom') return { ok: true, value: Number(barSel.value) };
    const text = custom.value.trim();
    const value = Number(text);
    if (text === '' || !Number.isFinite(value) || value < 0 || value > MAX_WEIGHT) {
      return { ok: false, error: 'Enter a custom bar weight of zero or more (use 0 for a machine or no bar).', input: custom };
    }
    return { ok: true, value };
  }

  /** Ticked + extra plate sizes in the current unit: { ok, value } or { ok: false, error, input }. */
  function plates() {
    const ticked = [...checks.querySelectorAll('input:checked')].map((c) => Number(c.value));
    const extras = parseList(extra.value);
    if (!extras || extras.some((p) => p <= 0 || p > 100)) {
      return { ok: false, error: 'Extra plate sizes must be numbers above 0 (up to 100), separated by commas.', input: extra };
    }
    const value = [...new Set([...ticked, ...extras])];
    // Optional per-side limits (home gym); blank = unlimited.
    const limits = {};
    if (limitOn.checked) {
      for (const input of limitsBox.querySelectorAll('[data-pairs]')) {
        const text = input.value.trim();
        if (text === '') continue;
        const n = Number(text);
        if (!Number.isInteger(n) || n < 0 || n > MAX_PAIRS) {
          return { ok: false, error: `Pairs of ${num(Number(input.dataset.pairs))} ${unit}: enter a whole number from 0 to ${MAX_PAIRS}, or leave it blank.`, input };
        }
        limits[input.dataset.pairs] = n;
      }
    }
    return { ok: true, value, limits };
  }

  return {
    setUnit,
    bar,
    plates,
    getUnit: () => unit,
    /** The typed inputs, so a form can clear their invalid mark. */
    get inputs() { return [custom, extra, ...limitsBox.querySelectorAll('[data-pairs]')]; },
    onChange: (fn) => listeners.add(fn),
  };
}
