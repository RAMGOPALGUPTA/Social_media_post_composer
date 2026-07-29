import React from "react";

/**
 * Small ring + number showing how many characters are left
 * for a single platform. Colors shift as the limit approaches.
 */
export default function CharacterCounter({ charCount, charLimit, isOverLimit, isNearLimit }) {
  const percent = Math.min(100, (charCount / charLimit) * 100);
  let state = "ok";
  if (isOverLimit) state = "error";
  else if (isNearLimit) state = "warning";

  return (
    <div className={`char-counter char-counter--${state}`}>
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" className="char-counter__track" />
        <circle
          cx="14"
          cy="14"
          r="12"
          className="char-counter__fill"
          style={{
            strokeDasharray: 2 * Math.PI * 12,
            strokeDashoffset: 2 * Math.PI * 12 * (1 - percent / 100),
          }}
        />
      </svg>
      <span className="char-counter__label">
        {charCount}/{charLimit}
      </span>
    </div>
  );
}
