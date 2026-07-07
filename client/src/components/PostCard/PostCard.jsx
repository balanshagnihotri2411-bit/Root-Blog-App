import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post }) => {
  const { title, slug, excerpt, coverImageUrl, author, tags, createdAt, readTime } = post;
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitial = () => author?.username?.[0]?.toUpperCase() || '?';

  return (
    <article className="card post-card">
      <Link to={`/blog/${slug}`} className="post-card-image-link">
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={title} className="post-card-image" loading="lazy" />
        ) : (
          <div className="post-card-image-placeholder">
            <span>Roots</span>
          </div>
        )}
      </Link>

      <div className="post-card-content">
        <div className="post-card-meta">
          <span className="post-card-meta-item">
            <Calendar size={13} />
            {formatDate(createdAt)}
          </span>
          <span className="post-card-meta-item">
            <Clock size={13} />
            {readTime} min read
          </span>
        </div>

        <h3 className="post-card-title">
          <Link to={`/blog/${slug}`}>{title}</Link>
        </h3>

        <p className="post-card-excerpt">{excerpt}</p>

        <div className="post-card-footer">
          <Link to={`/u/${author?.username}`} className="post-card-author">
            {author?.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.username} className="avatar avatar-sm" />
            ) : (
              <span className="avatar-placeholder avatar-sm">{getInitial()}</span>
            )}
            <span className="post-card-author-name">by {author?.username || 'Writer'}</span>
          </Link>

          {tags && tags.length > 0 && (
            <div className="post-card-tags">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="pill tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
