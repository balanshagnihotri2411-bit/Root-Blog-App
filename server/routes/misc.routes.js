import express from 'express';
import { submitContact, subscribeNewsletter } from '../controllers/misc.controller.js';

const router = express.Router();

router.post('/contact', submitContact);
router.post('/newsletter', subscribeNewsletter);

export default router;
