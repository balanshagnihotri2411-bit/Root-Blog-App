import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import useUpdateProfile from '../../hooks/useUpdateProfile.js';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  
  const { isLoading, updateProfile, updateAvatar } = useUpdateProfile();

  // Populate state from current user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      setTwitter(user.socialLinks?.twitter || '');
      setLinkedin(user.socialLinks?.linkedin || '');
      setWebsite(user.socialLinks?.website || '');
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      await updateAvatar(file);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    
    const data = {
      username: username.trim(),
      bio: bio.trim(),
      socialLinks: {
        twitter: twitter.trim(),
        linkedin: linkedin.trim(),
        website: website.trim()
      }
    };
    
    await updateProfile(data);
  };

  const getInitial = () => user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="settings-page container">
      <header className="settings-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost settings-back-btn">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="settings-title">Profile Settings</h1>
        <p className="settings-subtitle">Manage your personal information, avatar, and social connections.</p>
      </header>

      <div className="settings-layout">
        {/* Left Side: Avatar Upload card */}
        <div className="settings-sidebar-card card">
          <h2>Profile Photo</h2>
          <div className="settings-avatar-container">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="avatar avatar-2xl settings-avatar" />
            ) : (
              <span className="avatar-placeholder avatar-2xl settings-avatar">{getInitial()}</span>
            )}
            
            <label className="avatar-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="visually-hidden"
                disabled={isLoading}
              />
              <Camera size={16} /> Update Photo
            </label>
          </div>
          <p className="avatar-tip">Recommended: Square PNG/JPG up to 5MB.</p>
        </div>

        {/* Right Side: Account details form */}
        <div className="settings-main-card card">
          <form onSubmit={handleTextSubmit} className="settings-form">
            <h2>Account Details</h2>
            
            <div className="form-group">
              <label htmlFor="settings-username" className="form-label">Username</label>
              <input
                id="settings-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="settings-bio" className="form-label">Bio (about you)</label>
              <textarea
                id="settings-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers who you are..."
                className="form-textarea settings-bio-textarea"
                disabled={isLoading}
              />
            </div>

            <div className="divider"></div>

            <h2>Social Connections</h2>

            <div className="form-group">
              <label htmlFor="settings-twitter" className="form-label">Twitter Profile Link</label>
              <input
                id="settings-twitter"
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="settings-linkedin" className="form-label">LinkedIn Profile Link</label>
              <input
                id="settings-linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="settings-website" className="form-label">Personal Website URL</label>
              <input
                id="settings-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://mywebsite.com"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary settings-save-btn"
              disabled={isLoading}
            >
              <Save size={16} /> {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
