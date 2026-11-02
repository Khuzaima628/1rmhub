/**
 * Visitor preferences (unit, theme) kept in this browser's localStorage only —
 * never sent anywhere. Storage can be unavailable (private mode, blocked
 * storage); every call then degrades to "no saved preference" without errors.
 *
 * The same key is read by the inline theme script in BaseLayout.astro, so the
 * theme applies before first paint.
 */
const KEY = 'sc:prefs';
const ALLOWED = { unit: ['kg', 'lb'], theme: ['light', 'dark'] };

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Saved value for a preference, or null if unset/invalid/unavailable. */
export function getPref(name) {
  const value = readAll()[name];
  return ALLOWED[name]?.includes(value) ? value : null;
}

/** Save a preference. Silently ignored if storage is unavailable. */
export function setPref(name, value) {
  if (!ALLOWED[name]?.includes(value)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [name]: value }));
  } catch {
    // Storage blocked or full — the preference simply isn't remembered.
  }
}
