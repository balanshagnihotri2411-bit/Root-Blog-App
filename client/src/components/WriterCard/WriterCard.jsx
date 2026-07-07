import React from 'react';
import { Link } from 'react-router-dom';
import './WriterCard.css';

const WriterCard = ({ writer }) => {
  const { username, avatarUrl, bio, postCount } = writer;
  
  const getInitial = () => username?.[0]?.toUpperCase() || '?';

  return (
    <div className="card writer-card">
      <Link to={`/u/${username}`} className="writer-card-avatar-link">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="avatar avatar-xl writer-card-avatar" />
        ) : (
          <span className="avatar-placeholder avatar-xl writer-card-avatar">{getInitial()}</span>
        )}
      </Link>

      <h3 className="writer-card-name">
        <Link to={`/u/${username}`}>{username}</Link>
      </h3>
      
      <span className="writer-card-posts">
        {postCount} {postCount === 1 ? 'published post' : 'published posts'}
      </span>

      {bio && <p className="writer-card-bio">{bio}</p>}
      
      <Link to={`/u/${username}`} className="btn btn-outline btn-sm writer-card-btn">
        View profile
      </Link>
    </div>
  );
};

export default WriterCard;
