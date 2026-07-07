import React, { useEffect, useState } from 'react';
import './TableOfContents.css';

// Slugify helper matching server side and rehype-slug standard
const slugifyHeading = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;

    // Parse H2 (##) and H3 (###) from raw markdown content
    const headingRegex = /^(##|###)\s+(.+)$/gm;
    const matches = [];
    let match;

    // Ensure we start at index 0 for global regex
    headingRegex.lastIndex = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length; // 2 for H2, 3 for H3
      const text = match[2].trim();
      const slug = slugifyHeading(text);
      matches.push({ level, text, slug });
    }

    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          // Sort by bounding client rect top to get the one highest on screen
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const el = document.getElementById(heading.slug);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc-nav" aria-label="Table of contents">
      <h4 className="toc-title">In this article</h4>
      <ul className="toc-list">
        {headings.map((heading, i) => (
          <li
            key={i}
            className={`toc-item depth-${heading.level} ${activeId === heading.slug ? 'active' : ''}`}
          >
            <a href={`#${heading.slug}`} onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(heading.slug);
              if (el) {
                const yOffset = -90; // Navbar offset
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                setActiveId(heading.slug);
              }
            }}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
