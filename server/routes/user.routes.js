import express from 'express';
import {
  getTopWriters,
  getUserProfile,
  updateMe,
  uploadAvatar,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Specific named routes before dynamic :username
router.get('/top-writers', getTopWriters);
router.put('/me', protect, updateMe);
router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);

router.get('/:username', getUserProfile);

export default router;
