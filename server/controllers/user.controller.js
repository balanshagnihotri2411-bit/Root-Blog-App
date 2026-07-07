import streamifier from 'streamifier';
import User from '../models/User.js';
import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';
import { readTime } from '../utils/readTime.js';

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'roots/avatars') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// GET /api/users/top-writers
export const getTopWriters = async (req, res) => {
  try {
    const topWriters = await Post.aggregate([
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 12 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          _id: '$author._id',
          username: '$author.username',
          avatarUrl: '$author.avatarUrl',
          bio: '$author.bio',
          postCount: 1,
        },
      },
    ]);
    res.json(topWriters);
  } catch (err) {
    console.error('getTopWriters error:', err);
    res.status(500).json({ message: 'Failed to fetch top writers' });
  }
};

// GET /api/users/:username
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-passwordHash')
      .lean();

    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id })
      .select('title slug excerpt coverImageUrl tags createdAt content')
      .sort({ createdAt: -1 })
      .lean();

    const postsWithMeta = posts.map((p) => ({ ...p, readTime: readTime(p.content) }));

    res.json({ ...user, posts: postsWithMeta });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// PUT /api/users/me (protected)
export const updateMe = async (req, res) => {
  try {
    const { username, bio, socialLinks } = req.body;

    if (username && username !== req.user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(409).json({ message: 'Username already taken' });
    }

    const updates = {};
    if (username) updates.username = username.toLowerCase().trim();
    if (bio !== undefined) updates.bio = bio;
    if (socialLinks) updates.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    res.json({ user });
  } catch (err) {
    console.error('updateMe error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// POST /api/users/me/avatar (protected)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const avatarUrl = await uploadToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl },
      { new: true }
    ).select('-passwordHash');

    res.json({ user });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
