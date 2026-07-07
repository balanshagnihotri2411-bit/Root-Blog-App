import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArchiveApi } from '../../api/posts.api.js';
import NewsletterStrip from '../../components/NewsletterStrip/NewsletterStrip.jsx';
import './Archive.css';

const Archive = () => {
  const [archiveGroups, setArchiveGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArchive = async () => {
      try {
        const { data } = await getArchiveApi();
        setArchiveGroups(data);
      } catch (err) {
        console.error('Failed to load archive', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadArchive();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="archive-page">
      <div className="container archive-inner">
        <header className="archive-header">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="active">Archive</span>
          </div>
          <span className="section-label">All articles</span>
          <h1 className="archive-title">Archive</h1>
          <p className="archive-subtitle">Browse through all our historical writing, chronologically.</p>
        </header>

        {isLoading ? (
          <div className="archive-skeleton">
            {[1, 2].map((n) => (
              <div key={n} style={{ marginBottom: '40px' }}>
                <div className="skeleton" style={{ height: '36px', width: '80px', marginBottom: '20px' }}></div>
                <div className="skeleton" style={{ height: '24px', width: '100%', marginBottom: '12px' }}></div>
                <div className="skeleton" style={{ height: '24px', width: '100%', marginBottom: '12px' }}></div>
              </div>
            ))}
          </div>
        ) : archiveGroups.length === 0 ? (
          <div className="empty-state card">
            <h3>No archive entries found</h3>
            <p>Wait for articles to be published, then browse them here by year.</p>
          </div>
        ) : (
          <div className="archive-list">
            {archiveGroups.map((group) => (
              <section key={group.year} className="archive-year-section" aria-labelledby={`year-${group.year}`}>
                <h2 id={`year-${group.year}`} className="archive-year">
                  {group.year}
                </h2>
                
                <div className="archive-entries">
                  {group.posts.map((post) => (
                    <article key={post.slug} className="archive-entry-item">
                      <time dateTime={post.createdAt} className="archive-entry-date">
                        {formatDate(post.createdAt)}
                      </time>
                      <h3 className="archive-entry-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <NewsletterStrip />
    </div>
  );
};

export default Archive;
