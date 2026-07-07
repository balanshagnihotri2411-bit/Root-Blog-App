import streamifier from 'streamifier';
import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';
import { slugify, randomSuffix } from '../utils/slugify.js';
import { readTime } from '../utils/readTime.js';

// Helper: upload a buffer to Cloudinary and return secure_url
const uploadToCloudinary = (buffer, folder = 'roots/covers') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// Helper: generate a unique slug
const generateUniqueSlug = async (title) => {
  let slug = slugify(title);
  const existing = await Post.findOne({ slug });
  if (existing) slug = `${slug}-${randomSuffix()}`;
  return slug;
};

// GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 9,
      featured,
    } = req.query;

    const query = {};

    if (featured === 'true') query.featured = true;

    if (category && category !== 'all') {
      query.tags = { $in: [category.toLowerCase()] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const postsWithMeta = posts.map((p) => ({
      ...p,
      readTime: readTime(p.content),
    }));

    res.json({
      posts: postsWithMeta,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('getPosts error:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// GET /api/posts/archive
export const getArchive = async (req, res) => {
  try {
    const posts = await Post.find({})
      .select('title slug createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const grouped = {};
    posts.forEach((p) => {
      const year = new Date(p.createdAt).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(p);
    });

    const archive = Object.keys(grouped)
      .sort((a, b) => b - a)
      .map((year) => ({ year: Number(year), posts: grouped[year] }));

    res.json(archive);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch archive' });
  }
};

// GET /api/posts/categories
export const getCategories = async (req, res) => {
  try {
    const result = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// GET /api/posts/:slug
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username avatarUrl bio socialLinks')
      .lean();

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ ...post, readTime: readTime(post.content) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// POST /api/posts (protected)
export const createPost = async (req, res) => {
  try {
    const { title, content, tags, featured, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let coverImageUrl = '';
    if (req.file) {
      try {
        coverImageUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(400).json({
          message: `Failed to upload cover image. Cloudinary returned: ${uploadErr.message || 'Unknown error'}. Please check your CLOUDINARY_API_SECRET or credentials in .env.`
        });
      }
    }

    const slug = await generateUniqueSlug(title);

    const autoExcerpt = excerpt || content.replace(/[#*_`\[\]>!]/g, '').slice(0, 160).trim();

    const parsedTags = tags
      ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const post = await Post.create({
      title,
      slug,
      excerpt: autoExcerpt,
      content,
      coverImageUrl,
      author: req.user._id,
      tags: parsedTags,
      featured: featured === 'true',
    });

    await post.populate('author', 'username avatarUrl');
    res.status(201).json(post);
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// PUT /api/posts/:id (protected, author-only)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, tags, featured, excerpt } = req.body;

    if (title && title !== post.title) {
      post.title = title;
      post.slug = await generateUniqueSlug(title);
    }
    if (content !== undefined) {
      post.content = content;
      post.excerpt = excerpt || content.replace(/[#*_`\[\]>!]/g, '').slice(0, 160).trim();
    }
    if (tags !== undefined) {
      post.tags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    }
    if (featured !== undefined) post.featured = featured === 'true';

    if (req.file) {
      try {
        post.coverImageUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(400).json({
          message: `Failed to upload cover image. Cloudinary returned: ${uploadErr.message || 'Unknown error'}. Please check your CLOUDINARY_API_SECRET or credentials in .env.`
        });
      }
    }

    await post.save();
    await post.populate('author', 'username avatarUrl');
    res.json(post);
  } catch (err) {
    console.error('updatePost error:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

// DELETE /api/posts/:id (protected, author-only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
