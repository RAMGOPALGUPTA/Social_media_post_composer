import React, { useRef } from "react";

/**
 * Handles picking media files and shows the current attachment list
 * with per-item remove buttons.
 */
export default function MediaUploader({ media, onAdd, onRemove }) {
  const inputRef = useRef(null);

  function inferType(file) {
    if (file.type.startsWith("image/")) return file.type === "image/gif" ? "gif" : "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    const items = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      type: inferType(file),
      sizeKB: Math.round(file.size / 1024),
    }));
    onAdd(items);
    e.target.value = ""; // allow re-selecting the same file later
  }

  return (
    <div className="media-uploader">
      <button
        type="button"
        className="media-uploader__button"
        onClick={() => inputRef.current?.click()}
      >
        + Attach media
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        hidden
        onChange={handleFiles}
      />

      {media.length > 0 && (
        <ul className="media-list">
          {media.map((item) => (
            <li key={item.id} className="media-list__item">
              <span className="media-list__type">{item.type}</span>
              <span className="media-list__name">{item.name}</span>
              <span className="media-list__size">{item.sizeKB} KB</span>
              <button
                type="button"
                className="media-list__remove"
                aria-label={`Remove ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
