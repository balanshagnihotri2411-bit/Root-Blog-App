/**
 * Converts a string to a URL-safe slug.
 * Appends a short random suffix on collision (handled in the controller).
 */
export const slugify = (str) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-')   // collapse whitespace/underscores/hyphens into a single hyphen
    .replace(/^-+|-+$/g, '');   // strip leading/trailing hyphens
};

export const randomSuffix = () => Math.random().toString(36).slice(2, 7);
