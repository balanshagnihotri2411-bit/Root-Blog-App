import { useState } from 'react';
import toast from 'react-hot-toast';
import { loginApi } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await loginApi(inputs);
      login(data);
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login: loginUser };
};

export default useLogin;
