import React, { useMemo, useState } from "react";
import { PLATFORMS } from "../platformConfig";
import { validateAll } from "../validation";
import PlatformSelector from "./PlatformSelector";
import MediaUploader from "./MediaUploader";
import ValidationPanel from "./ValidationPanel";
import "./PostComposer.css";

export default function PostComposer() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [selectedIds, setSelectedIds] = useState(["twitter"]);
  const [submitted, setSubmitted] = useState(null); // null | "success"

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!allValid) return;
    // In a real app this is where you'd call your publishing API.
    setSubmitted("success");
  }

  // The tightest limit among selected platforms drives the textarea's
  // hard character cap, so typing naturally stops making things worse.
  const tightestLimit = selectedPlatforms.length
    ? Math.min(...selectedPlatforms.map((p) => p.charLimit))
    : Infinity;

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <h2 className="post-composer__title">Create post</h2>

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
        {submitted === "success" && (
          <span className="post-composer__success">Post published ✓</span>
        )}
      </div>
    </form>
  );
}
