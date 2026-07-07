import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { Upload, Eye, Edit, Image as ImageIcon, X } from 'lucide-react';
import { getPostBySlugApi } from '../../api/posts.api.js';
import useCreatePost from '../../hooks/useCreatePost.js';
import './Createpost.css';

const Createpost = () => {
  const { id } = useParams(); // Post ID (edit mode) or undefined (create mode)
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingCoverUrl, setExistingCoverUrl] = useState('');

  // Editor vs Preview tab state
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const { isLoading, handleCreatepost, handleUpdatePost } = useCreatePost();

  const isEditMode = !!id;

  // Load post details if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPostToEdit = async () => {
      try {
        // Wait, getPostBySlugApi takes a slug, but edit uses id. 
        // Let's call getPostBySlugApi with the ID directly since the endpoint is /api/posts/:slug. 
        // Wait! The server routes has router.get('/:slug', getPostBySlug);
        // If :slug is actually passed as an ID (or slug), it works.
        // But to make it work smoothly, we can pass slug, or search for the slug.
        // Oh, wait! The react router definition is:
        // /write/:id where :id is the post ID.
        // Wait, the post model has _id.
        // Let's check how the edit page gets its ID.
        // Let's fetch the post detail. Since `getPostBySlug` fetches by slug, 
        // wait, can it also fetch by ID? Let's check the server controller:
        // getPostBySlug is `await Post.findOne({ slug: req.params.slug })`.
        // If we want to edit by ID, wait, how can we fetch the post?
        // Ah! If we pass the slug instead of ID to the edit route, that would be much easier!
        // In client App.jsx let's map /write/:slug (or write/:id if we support fetching by id).
        // Let's modify the server to support getPostById or change getPostBySlug to handle both.
        // Wait, Mongoose findOne({ slug: req.params.slug }) only works with slug.
        // If we make /write/:slug as the edit page path, it is perfect!
        // Let's double check. If we edit a post, we can navigate to `/write/${post.slug}`.
        // Let's look at Route definitions in implementation_plan.md:
        // `/write/:id → Edit post (protected, author-only)`
        // If the path is /write/:id, wait, in our client, how do we query it?
        // Let's look at server routes: we don't have a GET /api/posts/id route.
        // We only have `GET /api/posts/:slug`.
        // That means we can look up by slug during editing! Let's pass the slug.
        // Yes, let's pass slug to /write/:slug or we can adapt the server/controllers/post.controller.js.
        // Wait! If the param in /write/:id is actually the slug, or if we fetch by slug, it's perfect.
        // Let's look at the controller for updatePost:
        // `const post = await Post.findById(req.params.id);`
        // Ah! The update request takes an ID: `PUT /api/posts/:id`.
        // But the read request takes a slug: `GET /api/posts/:slug`.
        // So in our React App, we can fetch the post using the slug!
        // Let's define the Edit page path as `/write/:slug`.
        // Then we load by slug, and when we submit the update, we call updatePostApi(post._id, formData).
        // That is extremely elegant and doesn't require new endpoints!
        // Let's double-check:
        // `useParams()` returns `{ id: slug }` if the route is `/write/:id` where the token is actually the slug.
        // Let's name the URL param `:slug` in App.jsx to avoid confusion, e.g. `/write/:slug`.
        // Yes, this is a clean architectural solution.
        const { data } = await getPostBySlugApi(id); // here `id` parameter contains the slug
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags ? data.tags.join(', ') : '');
        setFeatured(data.featured);
        setExistingCoverUrl(data.coverImageUrl);
        setImagePreview(data.coverImageUrl);
      } catch (err) {
        toast.error('Failed to load article details for editing');
        navigate('/');
      }
    };
    fetchPostToEdit();
  }, [id, isEditMode, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingCoverUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('tags', tags);
    formData.append('featured', String(featured));
    
    if (imageFile) {
      formData.append('coverImage', imageFile);
    }

    if (isEditMode) {
      // Find the ID. We loaded the full post object, let's keep its ID
      // Wait, we need the post ID, which is stored in a state or fetched.
      // Let's make sure we have the _id.
      // Wait, let's fetch getPostBySlugApi and store the whole post or just its _id.
      // Let's define a state for the database ID:
      // const [dbId, setDbId] = useState('');
      // In the useEffect we set: setDbId(data._id);
      // Then call: handleUpdatePost(dbId, formData);
      // Let's inspect the code we write. Let's make sure dbId is populated!
      // I will add a state hook for `postDbId`.
    }

    // Let's handle submit.
  };

  // State to hold actual DB ID for updating
  const [postDbId, setPostDbId] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const getDbId = async () => {
        try {
          const { data } = await getPostBySlugApi(id);
          setPostDbId(data._id);
        } catch {}
      };
      getDbId();
    }
  }, [id, isEditMode]);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('tags', tags);
    formData.append('featured', String(featured));

    if (imageFile) {
      formData.append('coverImage', imageFile);
    }

    if (isEditMode) {
      if (!postDbId) {
        toast.error('Post database reference not loaded yet');
        return;
      }
      await handleUpdatePost(postDbId, formData);
    } else {
      await handleCreatepost(formData);
    }
  };

  return (
    <div className="write-page container">
      <header className="write-header">
        <h1 className="write-title">
          {isEditMode ? 'Edit Article' : 'Write a new story'}
        </h1>
        <div className="write-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`write-tab-btn ${activeTab === 'write' ? 'active' : ''}`}
          >
            <Edit size={16} /> Edit Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`write-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          >
            <Eye size={16} /> Preview Pane
          </button>
        </div>
      </header>

      <form onSubmit={handlePublish} className="write-form">
        {activeTab === 'write' ? (
          <div className="write-editor-layout">
            {/* Title & tags */}
            <div className="form-group">
              <label htmlFor="write-title-input" className="form-label">Article Title</label>
              <input
                id="write-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="An editorial title..."
                className="form-input write-title-input"
                required
                disabled={isLoading}
              />
            </div>

            {/* Cover Image Uploader */}
            <div className="form-group">
              <span className="form-label">Cover Image</span>
              <div className="cover-uploader">
                {imagePreview ? (
                  <div className="cover-preview-container">
                    <img src={imagePreview} alt="Cover preview" className="cover-preview-img" />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="cover-clear-btn"
                      aria-label="Remove image"
                      disabled={isLoading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cover-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="visually-hidden"
                      disabled={isLoading}
                    />
                    <div className="cover-upload-placeholder">
                      <Upload size={32} className="upload-icon" />
                      <span className="upload-text-primary">Click to upload cover photo</span>
                      <span className="upload-text-secondary">PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Markdown editor area */}
            <div className="form-group">
              <label htmlFor="write-content-input" className="form-label">Body Content (Markdown format supported)</label>
              <textarea
                id="write-content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story using markdown..."
                className="form-textarea write-content-textarea"
                required
                disabled={isLoading}
              />
            </div>

            {/* Tags (comma separated) */}
            <div className="form-group">
              <label htmlFor="write-tags-input" className="form-label">Tags (comma-separated)</label>
              <input
                id="write-tags-input"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="technology, startup, design, life"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Featured toggle switch */}
            <div className="featured-toggle-container">
              <label htmlFor="featured-toggle" className="featured-toggle-label">
                <input
                  id="featured-toggle"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="featured-toggle-checkbox"
                  disabled={isLoading}
                />
                <span className="featured-toggle-custom"></span>
                <span className="featured-toggle-text">
                  Feature this post on home page hero carousel
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="write-preview-layout card">
            <h1 className="post-detail-title" style={{ marginBottom: '20px' }}>{title || 'Untitled Story'}</h1>
            {imagePreview && (
              <div className="post-cover-container" style={{ margin: '20px 0 30px 0' }}>
                <img src={imagePreview} alt="Cover preview" className="post-cover-img" />
              </div>
            )}
            <div className="post-content-body">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="preview-empty-text">No content written yet. Use the editor tab to start writing.</p>
              )}
            </div>
          </div>
        )}

        <div className="write-footer">
          <button
            type="submit"
            className="btn btn-primary btn-lg write-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : isEditMode ? 'Update Article' : 'Publish Article'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-lg"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Createpost;
