import { useCallback, useEffect, useState } from "react";
import * as draftsApi from "../mockApi";

/**
 * useDrafts
 * Owns the list of drafts plus loading/error/pending state, and
 * exposes CRUD operations that talk to mockApi (async, like a real
 * backend call would be).
 *
 * status: "loading" | "idle" | "error"   -> initial fetch state
 * pendingId: id of the draft currently being saved/deleted ("new" for
 *            a brand-new draft), or null when nothing is in flight.
 */
export function useDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  const loadDrafts = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await draftsApi.fetchDrafts();
      setDrafts(data);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Failed to load drafts.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const saveDraft = useCallback(async (data, existingId) => {
    setPendingId(existingId || "new");
    setError(null);
    try {
      const saved = existingId
        ? await draftsApi.updateDraft(existingId, data)
        : await draftsApi.createDraft(data);

      setDrafts((prev) =>
        existingId
          ? prev.map((d) => (d.id === existingId ? saved : d))
          : [saved, ...prev]
      );
      return saved;
    } catch (err) {
      setError(err.message || "Failed to save draft.");
      throw err;
    } finally {
      setPendingId(null);
    }
  }, []);

  const removeDraft = useCallback(async (id) => {
    setPendingId(id);
    setError(null);
    try {
      await draftsApi.deleteDraft(id);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete draft.");
    } finally {
      setPendingId(null);
    }
  }, []);

  return { drafts, status, error, pendingId, loadDrafts, saveDraft, removeDraft };
}
