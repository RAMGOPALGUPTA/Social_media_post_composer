// platformConfig.js
// Central place defining rules/constraints for every supported platform.
// Adding a new platform = adding one object here. Nothing else needs to change.

export const PLATFORMS = {
  twitter: {
    id: "twitter",
    label: "Twitter / X",
    color: "#1D9BF0",
    charLimit: 280,
    maxHashtags: 10,
    maxMedia: 4,
    allowedMedia: ["image", "gif", "video"],
    supportsThreads: true,
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    color: "#E1306C",
    charLimit: 2200,
    maxHashtags: 30,
    maxMedia: 10,
    allowedMedia: ["image", "video"],
    mediaRequired: true, // Instagram posts need at least one media item
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    charLimit: 3000,
    maxHashtags: 5,
    maxMedia: 9,
    allowedMedia: ["image", "video", "document"],
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    charLimit: 63206,
    maxHashtags: 15,
    maxMedia: 10,
    allowedMedia: ["image", "video"],
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);
