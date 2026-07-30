// mockApi.js
// Simulates a real backend for draft CRUD. Every function returns a
// Promise and resolves/rejects after an artificial delay, so the UI
// has to handle loading/error states exactly like it would with a
// real network call. Under the hood it persists to localStorage,
// which also satisfies the "persist drafts" requirement — the two
// optional features share one implementation.

const STORAGE_KEY = "post-composer:drafts";
const SIMULATED_DELAY_MS = 500;

// Set this above 0 (e.g. 0.15 for a 15% failure rate) to test the
// UI's error handling without needing a real backend to fail.
const SIMULATED_FAILURE_RATE = 0;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(actionLabel) {
  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new Error(`Simulated failure while trying to ${actionLabel}.`);
  }
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted or inaccessible storage shouldn't crash the app.
    return [];
  }
}

function writeStore(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function makeId() {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** GET /drafts */
export async function fetchDrafts() {
  await delay(SIMULATED_DELAY_MS);
  maybeFail("load drafts");
  return readStore().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** POST /drafts */
export async function createDraft(data) {
  await delay(SIMULATED_DELAY_MS);
  maybeFail("save draft");
  const now = new Date().toISOString();
  const draft = { id: makeId(), createdAt: now, updatedAt: now, ...data };
  const drafts = readStore();
  drafts.unshift(draft);
  writeStore(drafts);
  return draft;
}

/** PUT /drafts/:id */
export async function updateDraft(id, data) {
  await delay(SIMULATED_DELAY_MS);
  maybeFail("update draft");
  const drafts = readStore();
  const index = drafts.findIndex((d) => d.id === id);
  if (index === -1) throw new Error(`Draft ${id} no longer exists.`);
  const updated = { ...drafts[index], ...data, updatedAt: new Date().toISOString() };
  drafts[index] = updated;
  writeStore(drafts);
  return updated;
}

/** DELETE /drafts/:id */
export async function deleteDraft(id) {
  await delay(SIMULATED_DELAY_MS);
  maybeFail("delete draft");
  const drafts = readStore().filter((d) => d.id !== id);
  writeStore(drafts);
  return { id };
}
