import React, { useEffect, useState } from 'react';
import { getTopWritersApi } from '../../api/users.api.js';
import WriterCard from '../../components/WriterCard/WriterCard.jsx';
import NewsletterStrip from '../../components/NewsletterStrip/NewsletterStrip.jsx';
import './About.css';

const About = () => {
  const [writers, setWriters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWriters = async () => {
      try {
        const { data } = await getTopWritersApi();
        setWriters(data);
      } catch (err) {
        console.error('Failed to load top writers', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadWriters();
  }, []);

  return (
    <div className="about-page">
      {/* Intro section */}
      <section className="about-intro container" aria-labelledby="about-title">
        <div className="breadcrumb">
          <span>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="active">About</span>
        </div>

        <span className="section-label">About Roots</span>
        <h1 id="about-title" className="about-heading">
          We are Roots, a team of content writers and designers.
        </h1>
        
        <div className="about-description">
          <p>
            Roots is an editorial publishing platform where stories, opinions, and analysis on technology, startups, development, and daily life find a home. We believe in high-quality writing, simplified layouts, and community-driven content.
          </p>
          <p>
            Our mission is to create a clean, distraction-free environment for reading and writing. Whether you're an industry expert, developer, startup enthusiast, or a curious reader, there is a place for your ideas to grow here.
          </p>
        </div>
      </section>

      {/* Grid of Team Images/Mockups */}
      <section className="about-gallery container">
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80" alt="Team meeting" className="gallery-img" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80" alt="Design collaboration" className="gallery-img" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80" alt="Programming together" className="gallery-img" />
          </div>
        </div>
      </section>

      {/* Writers list */}
      <section className="about-writers container" aria-labelledby="writers-title">
        <span className="section-label">Our core collective</span>
        <h2 id="writers-title" className="about-section-title">Meet our Writers</h2>
        
        {isLoading ? (
          <div className="post-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton" style={{ height: '240px' }}></div>
            ))}
          </div>
        ) : writers.length === 0 ? (
          <div className="empty-state card">
            <h3>No writers found</h3>
            <p>Publish your first post to be featured as a writer!</p>
          </div>
        ) : (
          <div className="writers-grid">
            {writers.map((writer) => (
              <WriterCard key={writer._id} writer={writer} />
            ))}
          </div>
        )}
      </section>

      <NewsletterStrip />
    </div>
  );
};

export default About;
