import { useState } from 'react';
import { getPostsApi } from '../api/posts.api.js';

const useGetBlog = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = async (params = {}) => {
    setIsLoading(true);
    try {
      const { data } = await getPostsApi(params);
      return data;
    } catch (err) {
      console.error('getPosts error:', err);
      return { posts: [], total: 0, page: 1, totalPages: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getPosts };
};

export default useGetBlog;
