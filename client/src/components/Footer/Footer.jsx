import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Roots</Link>
          <p className="footer-tagline">A place where ideas take root.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-col">
            <span className="footer-col-title">Explore</span>
            <Link to="/">Home</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/archive">Archive</Link>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Company</span>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>
      </div>

      <div className="footer-bottom container">
        <span className="footer-copy">© {year} Roots. All rights reserved.</span>
        <div className="footer-socials">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
