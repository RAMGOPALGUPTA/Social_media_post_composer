import React from "react";
import DraftCard from "./DraftCard";
import "./DraftManager.css";

export default function DraftManager({ draftsApi, editingDraftId, onEditDraft }) {
  const { drafts, status, error, pendingId, loadDrafts, removeDraft } = draftsApi;

  return (
    <section className="draft-manager">
      <div className="draft-manager__header">
        <h2 className="draft-manager__title">Saved drafts</h2>
        {status !== "loading" && (
          <button type="button" className="draft-manager__refresh" onClick={loadDrafts}>
            Refresh
          </button>
        )}
      </div>

      {status === "loading" && <p className="draft-manager__status">Loading drafts…</p>}

      {status === "error" && (
        <div className="draft-manager__error">
          <p>{error}</p>
          <button type="button" onClick={loadDrafts}>
            Try again
          </button>
        </div>
      )}

      {status === "idle" && drafts.length === 0 && (
        <p className="draft-manager__status">
          No drafts yet. Write something above and hit "Save as draft".
        </p>
      )}

      {status === "idle" && drafts.length > 0 && (
        <ul className="draft-manager__list">
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              isEditing={draft.id === editingDraftId}
              isPending={draft.id === pendingId}
              onEdit={onEditDraft}
              onDelete={removeDraft}
            />
          ))}
        </ul>
      )}

      {error && status !== "error" && (
        // A save/delete error while the list itself loaded fine
        <p className="draft-manager__inline-error">{error}</p>
      )}
    </section>
  );
}
