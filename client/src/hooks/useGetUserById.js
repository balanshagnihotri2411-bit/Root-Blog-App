import { useState, useEffect } from 'react';
import { getUserProfileApi } from '../api/users.api.js';

const useGetUserById = (username) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getUserProfileApi(username);
        setUserProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [username]);

  return { isLoading, userProfile, error };
};

export default useGetUserById;
