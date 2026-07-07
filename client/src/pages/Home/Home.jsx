import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGetBlog from '../../hooks/useGetBlog.js';
import PostCard from '../../components/PostCard/PostCard.jsx';
import NewsletterStrip from '../../components/NewsletterStrip/NewsletterStrip.jsx';
import './Home.css';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const { isLoading, getPosts } = useGetBlog();

  useEffect(() => {
    const loadHomeData = async () => {
      // 1. Fetch featured posts
      const featuredRes = await getPosts({ featured: true, limit: 3 });
      let featuredList = featuredRes?.posts || [];

      // 2. Fetch recent posts
      const recentRes = await getPosts({ limit: 9 });
      const recentList = recentRes?.posts || [];

      // Fallback if less than 3 featured posts
      if (featuredList.length < 3) {
        featuredList = recentList.slice(0, 3);
      }

      // Filter recent list so featured posts aren't duplicated in recent list
      const featuredIds = new Set(featuredList.map(p => p._id));
      const filteredRecent = recentList.filter(p => !featuredIds.has(p._id)).slice(0, 6);

      setFeaturedPosts(featuredList);
      setRecentPosts(filteredRecent);
    };

    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Editorial Hero Banner */}
      <section className="home-hero" aria-label="Welcome banner">
        <div className="container hero-inner">
          <h1 className="hero-tagline">
            Taking control of your daily life <br />
            is easy <span className="squiggle-underline">when you know how!</span>
          </h1>
          <p className="hero-subtext">
            Discover articles, notes, and essays written by experts on product development, lifestyle, design, and tech startups.
          </p>
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-primary btn-lg">Explore all articles</Link>
            <Link to="/about" className="btn btn-outline btn-lg">Meet our writers</Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="home-featured container" aria-labelledby="featured-title">
          <span className="section-label">Featured posts</span>
          <h2 id="featured-title" className="visually-hidden">Featured Articles</h2>
          
          {isLoading && featuredPosts.length === 0 ? (
            <div className="post-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: '320px' }}></div>
              ))}
            </div>
          ) : (
            <div className="post-grid featured-grid">
              {featuredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent Grid */}
      <section className="home-recent container" aria-labelledby="recent-title">
        <div className="recent-header">
          <div>
            <span className="section-label">Latest writing</span>
            <h2 id="recent-title" className="home-section-title">Recent posts</h2>
          </div>
          <Link to="/blog" className="btn btn-outline btn-sm hide-mobile">
            View all posts
          </Link>
        </div>

        {isLoading && recentPosts.length === 0 ? (
          <div className="post-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: '320px' }}></div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No recent posts found</h3>
            <p>Check back later or explore the blog archive.</p>
          </div>
        ) : (
          <div className="post-grid">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        <div className="recent-footer-mobile">
          <Link to="/blog" className="btn btn-outline btn-lg">
            View all posts
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterStrip />
    </div>
  );
};

export default Home;
