import React from "react";
import { PLATFORM_LIST } from "../platformConfig";

/**
 * Displays a row of togglable platform chips.
 * selectedIds: array of platform id strings
 * onToggle: (platformId) => void
 */
export default function PlatformSelector({ selectedIds, onToggle }) {
  return (
    <div className="platform-selector" role="group" aria-label="Select target platforms">
      {PLATFORM_LIST.map((platform) => {
        const isSelected = selectedIds.includes(platform.id);
        return (
          <button
            key={platform.id}
            type="button"
            className={`platform-chip ${isSelected ? "selected" : ""}`}
            style={{ "--platform-color": platform.color }}
            aria-pressed={isSelected}
            onClick={() => onToggle(platform.id)}
          >
            <span className="platform-dot" />
            {platform.label}
          </button>
        );
      })}
    </div>
  );
}
