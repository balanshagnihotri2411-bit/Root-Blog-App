import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin.js';
import useSignUp from '../../hooks/useSignUp.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });

  const { isLoading: loginLoading, login } = useLogin();
  const { isLoading: signupLoading, SignUp } = useSignUp();

  // If user is already logged in, redirect home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sync tab if query parameter changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginData);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    SignUp(signupData);
  };

  const isLoading = loginLoading || signupLoading;

  return (
    <div className="auth-page container">
      <div className="auth-card card">
        <div className="auth-tabs">
          <button
            onClick={() => setActiveTab('login')}
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            disabled={isLoading}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-body">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <h2 className="auth-form-title">Welcome Back</h2>
              <p className="auth-form-subtitle">Enter your details to log in to your account</p>
              
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="name@example.com"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                {loginLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="auth-form">
              <h2 className="auth-form-title">Create Account</h2>
              <p className="auth-form-subtitle">Join Roots to share your stories with the world</p>

              <div className="form-group">
                <label htmlFor="signup-username" className="form-label">Username</label>
                <input
                  id="signup-username"
                  type="text"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  placeholder="johndoe"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="name@example.com"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="At least 6 characters"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                {signupLoading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
