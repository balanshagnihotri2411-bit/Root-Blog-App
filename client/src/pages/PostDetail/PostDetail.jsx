import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import toast from 'react-hot-toast';
import { Calendar, Clock, Share2, Twitter, Linkedin, Facebook, Link2, Trash2, Edit3 } from 'lucide-react';
import { getPostBySlugApi, deletePostApi } from '../../api/posts.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import TableOfContents from '../../components/TableOfContents/TableOfContents.jsx';
import './PostDetail.css';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getPostBySlugApi(slug);
        setPost(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Article not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action is permanent.')) {
      try {
        await deletePostApi(post._id);
        toast.success('Post deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="post-detail-page container">
        <div className="skeleton" style={{ height: '40px', width: '80%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '40px' }}></div>
        <div className="skeleton" style={{ height: '480px', width: '100%', marginBottom: '40px' }}></div>
        <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page container text-center">
        <div className="empty-state card">
          <h2>Article not found</h2>
          <p>{error || "We couldn't retrieve the requested article details."}</p>
          <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to publications
          </Link>
        </div>
      </div>
    );
  }

  const { title, content, coverImageUrl, author, tags, createdAt, readTime, _id } = post;
  const isAuthor = user && author && user._id === author._id;
  const authorInitial = author?.username?.[0]?.toUpperCase() || '?';

  return (
    <article className="post-detail-page">
      {/* Header Area */}
      <header className="post-detail-header container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/blog">Blog</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="active">{title}</span>
        </div>

        {tags && tags.length > 0 && (
          <div className="post-detail-tags">
            {tags.map((tag) => (
              <span key={tag} className="pill tag active">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="post-detail-title">{title}</h1>

        <div className="post-detail-author-meta">
          <Link to={`/u/${author?.username}`} className="post-detail-author">
            {author?.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.username} className="avatar avatar-md" />
            ) : (
              <span className="avatar-placeholder avatar-md">{authorInitial}</span>
            )}
            <div>
              <span className="post-detail-author-name">{author?.username}</span>
              <div className="post-detail-submeta">
                <span className="meta-item">
                  <Calendar size={12} />
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="meta-separator">•</span>
                <span className="meta-item">
                  <Clock size={12} />
                  {readTime} min read
                </span>
              </div>
            </div>
          </Link>

          {isAuthor && (
            <div className="post-actions">
              <Link to={`/write/${_id}`} className="btn btn-outline btn-sm">
                <Edit3 size={14} /> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-outline btn-sm danger-btn">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Cover Image */}
      <div className="post-cover-container container">
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={title} className="post-cover-img" />
        ) : (
          <div className="post-cover-placeholder">Roots</div>
        )}
      </div>

      {/* Main Layout: Sticky share / article text / TOC */}
      <div className="post-layout-container container">
        {/* Left share bar */}
        <aside className="share-sidebar" aria-label="Share article">
          <div className="share-sticky">
            <span className="share-title">Share</span>
            <button onClick={handleCopyLink} className="share-btn" aria-label="Copy link">
              <Link2 size={16} />
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on X"
            >
              <Twitter size={16} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on Facebook"
            >
              <Facebook size={16} />
            </a>
          </div>
        </aside>

        {/* Markdown Body */}
        <div className="post-content-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
          >
            {content}
          </ReactMarkdown>
          
          <div className="divider"></div>

          {/* Author Bylines box */}
          {author && (
            <div className="author-byline-card card">
              <Link to={`/u/${author.username}`}>
                {author.avatarUrl ? (
                  <img src={author.avatarUrl} alt={author.username} className="avatar avatar-lg" />
                ) : (
                  <span className="avatar-placeholder avatar-lg">{authorInitial}</span>
                )}
              </Link>
              <div className="author-byline-details">
                <span className="author-byline-label">WRITTEN BY</span>
                <h3 className="author-byline-name">
                  <Link to={`/u/${author.username}`}>{author.username}</Link>
                </h3>
                {author.bio ? (
                  <p className="author-byline-bio">{author.bio}</p>
                ) : (
                  <p className="author-byline-bio">A writer and contributor to the Roots community.</p>
                )}
                {author.socialLinks && (
                  <div className="author-byline-socials">
                    {author.socialLinks.twitter && (
                      <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
                    )}
                    {author.socialLinks.linkedin && (
                      <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    )}
                    {author.socialLinks.website && (
                      <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer">Website</a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right TOC bar */}
        <aside className="toc-sidebar" aria-label="Table of contents">
          <TableOfContents content={content} />
        </aside>
      </div>
    </article>
  );
};

export default PostDetail;
