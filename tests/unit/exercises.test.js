/**
 * Exercise dropdown data: every option carries a note, and every source a
 * note relies on exists in the bibliography.
 */
import { describe, it, expect } from 'vitest';
import { EXERCISES } from '../../src/data/exercises.ts';
import { SOURCES } from '../../src/data/sources.ts';

describe('exercise notes', () => {
  it('every exercise has a non-empty note and unique id', () => {
    const ids = new Set();
    for (const e of EXERCISES) {
      expect(e.note.trim().length, e.id).toBeGreaterThan(40);
      expect(ids.has(e.id), e.id).toBe(false);
      ids.add(e.id);
    }
  });

  it('every cited source exists', () => {
    for (const e of EXERCISES) {
      for (const s of e.sources) expect(SOURCES[s], `${e.id} → ${s}`).toBeDefined();
    }
  });

  it('a note without sources only reports our own search (no study claims)', () => {
    for (const e of EXERCISES.filter((x) => x.sources.length === 0)) {
      expect(e.note, e.id).toMatch(/^We found no study/);
    }
  });

  it('lift pages are internal paths', () => {
    for (const e of EXERCISES.filter((x) => x.page)) expect(e.page).toMatch(/^\/[a-z0-9-]+\/$/);
  });
});
