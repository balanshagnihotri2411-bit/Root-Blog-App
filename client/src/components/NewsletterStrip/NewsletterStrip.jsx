import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { subscribeNewsletterApi } from '../../api/users.api.js';
import './NewsletterStrip.css';

const NewsletterStrip = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await subscribeNewsletterApi(email);
      toast.success(data.message || 'Successfully subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-strip" aria-labelledby="newsletter-title">
      <div className="container newsletter-inner">
        <div className="newsletter-content">
          <h2 id="newsletter-title" className="newsletter-heading">
            Get latest posts delivered right to your inbox
          </h2>
          <p className="newsletter-text">
            Join our weekly newsletter to stay up-to-date with new articles, writers, and trends.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="form-input newsletter-input"
            aria-label="Email address for newsletter"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="btn btn-primary newsletter-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Joining...' : 'Join today'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterStrip;
