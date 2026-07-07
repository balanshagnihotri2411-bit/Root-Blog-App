import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateMeApi, uploadAvatarApi } from '../api/users.api.js';
import { useAuth } from '../context/AuthContext.jsx';

const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  const updateProfile = async (data) => {
    setIsLoading(true);
    try {
      const { data: res } = await updateMeApi(data);
      updateUser(res.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data: res } = await uploadAvatarApi(formData);
      updateUser(res.user);
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, updateProfile, updateAvatar };
};

export default useUpdateProfile;
