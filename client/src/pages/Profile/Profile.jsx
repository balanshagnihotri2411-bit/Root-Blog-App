import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowDown, Twitter, Linkedin, Globe, Edit2 } from 'lucide-react';
import useGetUserById from '../../hooks/useGetUserById.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const postsRef = useRef(null);

  const { isLoading, userProfile, error } = useGetUserById(username);

  const isOwnProfile = currentUser && username && currentUser.username.toLowerCase() === username.toLowerCase();

  const handleScrollToPosts = () => {
    postsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getInitial = () => {
    if (isOwnProfile) return currentUser.username[0]?.toUpperCase() || '?';
    return userProfile?.username?.[0]?.toUpperCase() || '?';
  };

  if (isLoading) {
    return (
      <div className="profile-page container">
        <div className="profile-hero-loading">
          <div className="skeleton avatar-xl" style={{ borderRadius: '50%', margin: '0 auto 20px auto' }}></div>
          <div className="skeleton" style={{ height: '36px', width: '200px', margin: '0 auto 12px auto' }}></div>
          <div className="skeleton" style={{ height: '20px', width: '320px', margin: '0 auto 30px auto' }}></div>
        </div>
        <div className="post-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: '320px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="profile-page container text-center">
        <div className="empty-state card">
          <h2>Profile Not Found</h2>
          <p>{error || "We couldn't retrieve the requested author profile."}</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const { bio, avatarUrl, socialLinks, posts } = userProfile;
  const displayName = isOwnProfile ? currentUser.username : userProfile.username;

  return (
    <div className="profile-page">
      {/* Editorial Profile Hero Banner */}
      <section className="profile-hero" aria-label="Author profile details">
        <div className="container profile-hero-inner">
          <div className="profile-avatar-wrap">
            {isOwnProfile ? (
              currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={displayName} className="avatar avatar-2xl" />
              ) : (
                <span className="avatar-placeholder avatar-2xl">{getInitial()}</span>
              )
            ) : (
              avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="avatar avatar-2xl" />
              ) : (
                <span className="avatar-placeholder avatar-2xl">{getInitial()}</span>
              )
            )}
          </div>

          <div className="profile-hero-content">
            <span className="profile-hero-subtitle">Hello, I'm</span>
            <h1 className="profile-hero-title capitalize">{displayName}</h1>
            
            {isOwnProfile ? (
              currentUser.bio ? (
                <p className="profile-hero-bio">{currentUser.bio}</p>
              ) : (
                <p className="profile-hero-bio empty-bio">No biography written yet. Tell the world about yourself in Settings.</p>
              )
            ) : (
              bio ? (
                <p className="profile-hero-bio">{bio}</p>
              ) : (
                <p className="profile-hero-bio">A content creator contributing articles to the Roots publication.</p>
              )
            )}

            <div className="profile-hero-footer">
              {/* Social icons */}
              <div className="profile-socials">
                {isOwnProfile ? (
                  <>
                    {currentUser.socialLinks?.twitter && (
                      <a href={currentUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                    {currentUser.socialLinks?.linkedin && (
                      <a href={currentUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {currentUser.socialLinks?.website && (
                      <a href={currentUser.socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                        <Globe size={18} />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    {socialLinks?.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter size={18} />
                      </a>
                    )}
                    {socialLinks?.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {socialLinks?.website && (
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                        <Globe size={18} />
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="profile-actions">
                {posts && posts.length > 0 && (
                  <button onClick={handleScrollToPosts} className="btn btn-primary">
                    Explore posts <ArrowDown size={16} />
                  </button>
                )}
                {isOwnProfile && (
                  <Link to="/settings" className="btn btn-outline">
                    <Edit2 size={15} /> Edit settings
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author posts listing grid */}
      <section ref={postsRef} className="profile-posts container" aria-labelledby="author-posts-title">
        <span className="section-label">Author contributions</span>
        <h2 id="author-posts-title" className="profile-section-title">
          Stories by {displayName}
        </h2>

        {posts && posts.length > 0 ? (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <h3>No stories published yet</h3>
            <p>Check back later or browse other writers.</p>
            {isOwnProfile && (
              <Link to="/write" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Write your first story
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
