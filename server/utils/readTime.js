/**
 * Estimates read time for a Markdown string.
 * Assumes ~200 words per minute; strips Markdown syntax before counting.
 * @param {string} content
 * @returns {number} minutes (minimum 1)
 */
export const readTime = (content = '') => {
  const text = content
    .replace(/```[\s\S]*?```/g, '')   // remove code blocks
    .replace(/`[^`]+`/g, '')          // remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')  // remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // keep link text
    .replace(/[#*_~>|]/g, '')         // remove markdown symbols
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};
