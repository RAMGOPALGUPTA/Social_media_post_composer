// validation.js
// Pure functions: given text/media/platform, return validation results.
// Keeping this separate from components makes it easy to unit test
// and reuse (e.g. server-side) without dragging React along.

/**
 * Extract hashtags from a body of text.
 */
export function extractHashtags(text) {
  const matches = text.match(/#[\p{L}0-9_]+/gu);
  return matches || [];
}

/**
 * Validate a single platform's constraints against the current
 * post content (text + media list).
 *
 * Returns:
 * {
 *   charCount, charLimit, remaining, isOverLimit, isNearLimit,
 *   hashtagCount, hashtagLimit, isOverHashtagLimit,
 *   mediaCount, mediaLimit, isOverMediaLimit,
 *   mediaTypeErrors: [],
 *   missingRequiredMedia: bool,
 *   errors: [], warnings: [],
 *   isValid: bool
 * }
 */
export function validateForPlatform(platform, text, media) {
  const charCount = text.length;
  const remaining = platform.charLimit - charCount;
  const isOverLimit = charCount > platform.charLimit;
  const isNearLimit = !isOverLimit && remaining <= Math.max(20, platform.charLimit * 0.1);

  const hashtags = extractHashtags(text);
  const hashtagCount = hashtags.length;
  const isOverHashtagLimit = hashtagCount > platform.maxHashtags;

  const mediaCount = media.length;
  const isOverMediaLimit = mediaCount > platform.maxMedia;

  const mediaTypeErrors = media
    .filter((m) => !platform.allowedMedia.includes(m.type))
    .map((m) => `${m.name} (${m.type}) isn't supported on ${platform.label}`);

  const missingRequiredMedia = Boolean(platform.mediaRequired) && mediaCount === 0;

  const errors = [];
  const warnings = [];

  if (isOverLimit) {
    errors.push(
      `Text exceeds ${platform.label}'s ${platform.charLimit}-character limit by ${Math.abs(remaining)} characters.`
    );
  }
  if (isOverHashtagLimit) {
    errors.push(
      `Too many hashtags for ${platform.label}: ${hashtagCount}/${platform.maxHashtags} allowed.`
    );
  }
  if (isOverMediaLimit) {
    errors.push(
      `Too many media attachments for ${platform.label}: ${mediaCount}/${platform.maxMedia} allowed.`
    );
  }
  if (mediaTypeErrors.length) {
    errors.push(...mediaTypeErrors);
  }
  if (missingRequiredMedia) {
    errors.push(`${platform.label} requires at least one media attachment.`);
  }
  if (isNearLimit) {
    warnings.push(`Approaching character limit (${remaining} characters left).`);
  }
  if (charCount === 0) {
    warnings.push("Post is empty.");
  }

  return {
    charCount,
    charLimit: platform.charLimit,
    remaining,
    isOverLimit,
    isNearLimit,
    hashtagCount,
    hashtagLimit: platform.maxHashtags,
    isOverHashtagLimit,
    mediaCount,
    mediaLimit: platform.maxMedia,
    isOverMediaLimit,
    mediaTypeErrors,
    missingRequiredMedia,
    errors,
    warnings,
    isValid: errors.length === 0 && charCount > 0,
  };
}

/**
 * Validate across every selected platform at once.
 * Returns a map of platformId -> validation result, plus an overall flag.
 */
export function validateAll(selectedPlatforms, text, media) {
  const results = {};
  selectedPlatforms.forEach((platform) => {
    results[platform.id] = validateForPlatform(platform, text, media);
  });
  const allValid =
    selectedPlatforms.length > 0 &&
    selectedPlatforms.every((p) => results[p.id].isValid);
  return { results, allValid };
}
