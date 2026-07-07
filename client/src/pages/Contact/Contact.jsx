import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { submitContactApi } from '../../api/users.api.js';
import NewsletterStrip from '../../components/NewsletterStrip/NewsletterStrip.jsx';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast.error('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitContactApi(formData);
      toast.success('Your message has been sent!');
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container contact-inner">
        <header className="contact-header">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span className="active">Contact</span>
          </div>
          <span className="section-label">Get in touch</span>
          <h1 className="contact-title">Contact</h1>
        </header>

        <div className="contact-layout">
          {/* Left panel: Info */}
          <div className="contact-info">
            <h2>Contact Roots</h2>
            <p className="contact-blurb">
              I'm here to help and answer any question you might have. I look forward to hearing from you.
            </p>
            
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="detail-label">Hate forms?</span>
                <span className="detail-value">Write an email or make a call</span>
              </div>
              
              <div className="contact-detail-item">
                <span className="detail-label">Email</span>
                <a href="mailto:contact@roots.com" className="detail-link">
                  contact@roots.com
                </a>
              </div>
              
              <div className="contact-detail-item">
                <span className="detail-label">Phone</span>
                <a href="tel:+98022964902" className="detail-link">
                  +98 02 296 4902
                </a>
              </div>
            </div>
          </div>

          {/* Right panel: Form */}
          <div className="contact-form-container card">
            {isSubmitted ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out to Roots. We will review your message and respond within 24 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-primary">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>Contact Form</h2>
                
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    Your name here
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    Ask question or just say Hi
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className="form-textarea"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <NewsletterStrip />
    </div>
  );
};

export default Contact;
