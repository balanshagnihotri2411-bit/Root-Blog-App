import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetBlog from '../../hooks/useGetBlog.js';
import { getCategoriesApi } from '../../api/posts.api.js';
import PostCard from '../../components/PostCard/PostCard.jsx';
import CategoryPills from '../../components/CategoryPills/CategoryPills.jsx';
import NewsletterStrip from '../../components/NewsletterStrip/NewsletterStrip.jsx';
import './Blog.css';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'all';
  const searchQuery     = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const { isLoading, getPosts } = useGetBlog();

  // Load categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await getCategoriesApi();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Sync state if search params change externally
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
    setPage(1); // Reset page on category/search change
  }, [searchParams]);

  // Load posts whenever search query, active category, or page changes
  useEffect(() => {
    const loadPosts = async () => {
      const params = {
        page,
        limit: 9,
      };

      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const res = await getPosts(params);
      setPosts(res?.posts || []);
      setTotalPages(res?.totalPages || 1);
      setTotalPosts(res?.total || 0);
    };

    loadPosts();
  }, [activeCategory, searchQuery, page]);

  const handleCategoryChange = (catName) => {
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    // Clear search when switching categories to avoid weird intersecting filters
    newParams.delete('search');
    setSearchParams(newParams);
    setPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getHeaderTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    if (activeCategory === 'all') {
      return 'All writing';
    }
    return `Showing posts from ${activeCategory}`;
  };

  return (
    <div className="blog-page container">
      <header className="blog-header">
        <span className="section-label">Our publication</span>
        <h1 className="blog-title">{getHeaderTitle()}</h1>
        <p className="blog-subtitle">
          {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} found
        </p>
      </header>

      {/* Category Pills list */}
      {!searchQuery && (
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryChange}
        />
      )}

      {/* Cards list or loading state */}
      {isLoading ? (
        <div className="post-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton" style={{ height: '320px' }}></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state card">
          <h3>No posts found</h3>
          <p>We couldn't find any articles matching your request. Try browsing other categories.</p>
          {searchQuery && (
            <button onClick={() => setSearchParams({})} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Clear search query
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Premium editorial pagination buttons */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Blog pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="btn btn-outline pagination-btn"
                aria-label="Previous page"
              >
                Previous
              </button>
              
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`pagination-num ${page === pNum ? 'active' : ''}`}
                    aria-current={page === pNum ? 'page' : undefined}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="btn btn-outline pagination-btn"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      <NewsletterStrip />
    </div>
  );
};

export default Blog;
