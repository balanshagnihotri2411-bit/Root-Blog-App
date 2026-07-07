import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Full-text search index
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;
