import React from "react";
import { PLATFORMS } from "../platformConfig";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function DraftCard({ draft, isEditing, isPending, onEdit, onDelete }) {
  const platformNames = (draft.platformIds || [])
    .map((id) => PLATFORMS[id]?.label)
    .filter(Boolean);

  return (
    <li className={`draft-card ${isEditing ? "draft-card--editing" : ""}`}>
      <div className="draft-card__meta">
        <div className="draft-card__platforms">
          {platformNames.length > 0 ? platformNames.join(", ") : "No platform selected"}
        </div>
        <span className="draft-card__time">{timeAgo(draft.updatedAt)}</span>
      </div>

      <p className="draft-card__text">
        {draft.text?.trim() ? draft.text : <em>Empty draft</em>}
      </p>

      {draft.media?.length > 0 && (
        <div className="draft-card__media">
          {draft.media.length} attachment{draft.media.length === 1 ? "" : "s"}
        </div>
      )}

      <div className="draft-card__actions">
        <button
          type="button"
          className="draft-card__edit"
          onClick={() => onEdit(draft.id)}
          disabled={isPending}
        >
          Edit
        </button>
        <button
          type="button"
          className="draft-card__delete"
          onClick={() => onDelete(draft.id)}
          disabled={isPending}
        >
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
