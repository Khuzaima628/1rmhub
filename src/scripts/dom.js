/**
 * Small browser helpers shared by every calculator widget.
 * Formatting, HTML escaping, clipboard and the kg/lb toggle live here so each
 * widget renders numbers and handles units identically.
 */
import { toKg, fromKg } from '../lib/onerepmax.js';
import { getPref, setPref } from './prefs.js';

export const f1 = (v) => Number(v).toFixed(1);
export const f2 = (v) => Number(v).toFixed(2);
/** Compact number for inputs and prose: 102.50 → "102.5", 100.00 → "100". */
export const num = (v, digits = 2) => String(Number(Number(v).toFixed(digits)));

/** Escape text for safe interpolation into HTML (content AND attributes). */
export function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Copy text to the clipboard. Resolves true on success, false if every method failed. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unsupported — fall back to the legacy method below.
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/** Temporarily swap a button's label to confirm an action. */
export function flash(btn, text, ms = 1800) {
  if (!btn.dataset.label) btn.dataset.label = btn.textContent;
  btn.textContent = text;
  clearTimeout(Number(btn.dataset.timer));
  btn.dataset.timer = String(setTimeout(() => { btn.textContent = btn.dataset.label; }, ms));
}

/**
 * Wire a kg/lb segmented control (markup from UnitToggle.astro). The current
 * unit lives in the group's data-unit attribute. onChange(next, previous)
 * fires only on a real change.
 *
 * The visitor's last chosen unit is remembered (prefs.js) and applied here on
 * load through the normal change path, so every widget converts and relabels
 * exactly as if the visitor had clicked. Bind AFTER the widget's own state is
 * ready, since onChange may run immediately.
 */
export function bindUnitToggle(group, onChange) {
  const buttons = [...group.querySelectorAll('button[data-unit]')];
  const paint = (u) => buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.unit === u)));
  const set = (u) => { group.dataset.unit = u; paint(u); };
  const change = (next) => {
    const prev = group.dataset.unit;
    if (next === prev) return;
    set(next);
    onChange(next, prev);
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    setPref('unit', b.dataset.unit);
    change(b.dataset.unit);
  }));
  paint(group.dataset.unit);
  const saved = getPref('unit');
  if (saved) change(saved);
  return { get: () => group.dataset.unit, set };
}

/** Convert a typed weight in an input from one unit to another, keeping its meaning. */
export function convertInput(input, from, to) {
  syncExample(input, to);
  const text = input.value.trim();
  if (text === '' || !Number.isFinite(Number(text)) || from === to) return;
  input.value = num(fromKg(toKg(Number(text), from), to));
}

/** Parse a comma-separated list of numbers. Returns null if any entry is not a number. */
export function parseList(text) {
  const parts = text.split(',').map((s) => s.trim()).filter((s) => s !== '');
  const values = parts.map(Number);
  return values.every((v) => Number.isFinite(v)) ? values : null;
}

/** Scroll an element into view, respecting the visitor's reduced-motion setting. */
export function scrollToEl(el, block = 'start') {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
}

/** Sync every [data-unit-label] inside root with the current unit. */
export function paintUnitLabels(root, unit) {
  root.querySelectorAll('[data-unit-label]').forEach((el) => { el.textContent = unit; });
  root.querySelectorAll('input[data-ph-kg]').forEach((el) => syncExample(el, unit));
}

/** Show the example value ("e.g. 225") for the unit, from data-ph-kg / data-ph-lb. */
function syncExample(input, unit) {
  const example = input.dataset[unit === 'kg' ? 'phKg' : 'phLb'];
  if (example) input.placeholder = example;
}
