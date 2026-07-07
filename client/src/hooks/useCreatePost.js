import { useState } from 'react';
import toast from 'react-hot-toast';
import { createPostApi, updatePostApi } from '../api/posts.api.js';
import { useNavigate } from 'react-router-dom';

const useCreatePost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreatepost = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await createPostApi(formData);
      toast.success('Post published!');
      navigate(`/blog/${data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (id, formData) => {
    setIsLoading(true);
    try {
      const { data } = await updatePostApi(id, formData);
      toast.success('Post updated!');
      navigate(`/blog/${data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatepost, handleUpdatePost };
};

export default useCreatePost;
