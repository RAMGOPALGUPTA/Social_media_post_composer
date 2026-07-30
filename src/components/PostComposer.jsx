import React, { useEffect, useMemo, useState } from "react";
import { PLATFORMS } from "../platformConfig";
import { validateAll } from "../validation";
import PlatformSelector from "./PlatformSelector";
import MediaUploader from "./MediaUploader";
import ValidationPanel from "./ValidationPanel";
import "./PostComposer.css";

export default function PostComposer({ draftsApi, editingDraft, onDraftSaved }) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [selectedIds, setSelectedIds] = useState(["twitter"]);
  const [submitted, setSubmitted] = useState(null); // null | "success"
  const [draftFeedback, setDraftFeedback] = useState(null); // null | "saved" | "error"

  const isEditing = Boolean(editingDraft);
  const isSavingDraft = draftsApi.pendingId === (editingDraft?.id || "new");

  // When the user clicks "Edit" on a saved draft, populate the composer
  // fields from it. Keyed off editingDraft?.id so re-selecting the same
  // draft doesn't wipe unsaved edits.
  useEffect(() => {
    if (editingDraft) {
      setText(editingDraft.text || "");
      setMedia(editingDraft.media || []);
      setSelectedIds(editingDraft.platformIds?.length ? editingDraft.platformIds : ["twitter"]);
      setSubmitted(null);
      setDraftFeedback(null);
    }
  }, [editingDraft?.id]);

  const selectedPlatforms = useMemo(
    () => selectedIds.map((id) => PLATFORMS[id]),
    [selectedIds]
  );

  const { results, allValid } = useMemo(
    () => validateAll(selectedPlatforms, text, media),
    [selectedPlatforms, text, media]
  );

  function togglePlatform(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    setSubmitted(null);
  }

  function handleAddMedia(items) {
    setMedia((prev) => [...prev, ...items]);
    setSubmitted(null);
  }

  function handleRemoveMedia(id) {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }

  function resetComposer() {
    setText("");
    setMedia([]);
    setSelectedIds(["twitter"]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!allValid) return;
    // In a real app this is where you'd call your publishing API.
    setSubmitted("success");
  }

  async function handleSaveDraft() {
    setDraftFeedback(null);
    try {
      await draftsApi.saveDraft(
        { text, media, platformIds: selectedIds },
        editingDraft?.id
      );
      setDraftFeedback("saved");
      resetComposer();
      onDraftSaved();
    } catch {
      setDraftFeedback("error");
    }
  }

  function handleCancelEdit() {
    resetComposer();
    onDraftSaved(); // clears editingDraftId in the parent
  }

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <div className="post-composer__header">
        <h2 className="post-composer__title">Create post</h2>
        {isEditing && (
          <span className="post-composer__editing-badge">
            Editing draft
            <button type="button" onClick={handleCancelEdit}>
              cancel
            </button>
          </span>
        )}
      </div>

      <PlatformSelector selectedIds={selectedIds} onToggle={togglePlatform} />

      <textarea
        className="post-composer__textarea"
        placeholder="What do you want to share?"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSubmitted(null);
        }}
        rows={6}
      />

      <MediaUploader media={media} onAdd={handleAddMedia} onRemove={handleRemoveMedia} />

      <ValidationPanel platforms={selectedPlatforms} validationResults={results} />

      <div className="post-composer__actions">
        <button type="submit" className="post-composer__submit" disabled={!allValid}>
          Publish to {selectedPlatforms.length || 0} platform
          {selectedPlatforms.length === 1 ? "" : "s"}
        </button>

        <button
          type="button"
          className="post-composer__save-draft"
          onClick={handleSaveDraft}
          disabled={isSavingDraft || (!text.trim() && media.length === 0)}
        >
          {isSavingDraft ? "Saving…" : isEditing ? "Update draft" : "Save as draft"}
        </button>

        {submitted === "success" && (
          <span className="post-composer__success">Post published ✓</span>
        )}
        {draftFeedback === "saved" && (
          <span className="post-composer__success">Draft saved ✓</span>
        )}
        {draftFeedback === "error" && (
          <span className="post-composer__draft-error">Couldn't save draft, try again.</span>
        )}
      </div>
    </form>
  );
}
