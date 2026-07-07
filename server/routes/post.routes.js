import express from 'express';
import {
  getPosts,
  getArchive,
  getCategories,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Order matters: specific named routes before /:slug
router.get('/archive', getArchive);
router.get('/categories', getCategories);

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

router.post('/', protect, upload.single('coverImage'), createPost);
router.put('/:id', protect, upload.single('coverImage'), updatePost);
router.delete('/:id', protect, deletePost);

export default router;
