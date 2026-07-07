import { useState } from 'react';
import toast from 'react-hot-toast';
import { signupApi } from '../api/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const SignUp = async (inputs) => {
    if (!inputs.email || !inputs.password || !inputs.username) {
      toast.error('Please fill in all fields');
      return;
    }
    if (inputs.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await signupApi(inputs);
      login(data);
      toast.success(`Welcome to Roots, ${data.user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, SignUp };
};

export default useSignUp;
