import React from "react";
import CharacterCounter from "./CharacterCounter";

/**
 * Renders one card per selected platform, showing its character counter,
 * hashtag count, and any errors/warnings for the current post content.
 */
export default function ValidationPanel({ platforms, validationResults }) {
  if (platforms.length === 0) {
    return (
      <p className="validation-panel__empty">
        Select at least one platform to see live validation.
      </p>
    );
  }

  return (
    <div className="validation-panel">
      {platforms.map((platform) => {
        const result = validationResults[platform.id];
        if (!result) return null;
        const statusClass = result.isValid
          ? "valid"
          : result.errors.length > 0
          ? "error"
          : "warning";

        return (
          <div
            key={platform.id}
            className={`validation-card validation-card--${statusClass}`}
            style={{ "--platform-color": platform.color }}
          >
            <div className="validation-card__header">
              <span className="validation-card__title">{platform.label}</span>
              <CharacterCounter
                charCount={result.charCount}
                charLimit={result.charLimit}
                isOverLimit={result.isOverLimit}
                isNearLimit={result.isNearLimit}
              />
            </div>

            <div className="validation-card__meta">
              <span>
                Hashtags: {result.hashtagCount}/{result.hashtagLimit}
              </span>
              <span>
                Media: {result.mediaCount}/{result.mediaLimit}
              </span>
            </div>

            {result.errors.map((err, i) => (
              <p key={`err-${i}`} className="validation-message validation-message--error">
                ⚠ {err}
              </p>
            ))}
            {result.warnings.map((warn, i) => (
              <p key={`warn-${i}`} className="validation-message validation-message--warning">
                ⓘ {warn}
              </p>
            ))}
            {result.isValid && (
              <p className="validation-message validation-message--success">
                ✓ Ready to publish
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
