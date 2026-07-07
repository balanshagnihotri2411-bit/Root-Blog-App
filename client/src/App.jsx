import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext.jsx';

// Pages
import Home from './pages/Home/Home.jsx';
import Blog from './pages/Blog/Blog.jsx';
import PostDetail from './pages/PostDetail/PostDetail.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Archive from './pages/Archive/Archive.jsx';
import Auth from './pages/Auth/Auth.jsx';
import Createpost from './pages/Createpost/Createpost.jsx';
import Profile from './pages/Profile/Profile.jsx';
import Settings from './pages/Settings/Settings.jsx';

// Components
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

// Styles
import './styles/global.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Toast Notification Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-sm)',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-sage)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-coral)',
              secondary: '#fff',
            },
          },
        }}
      />

      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/u/:username" element={<Profile />} />

          {/* Protected routes */}
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <Createpost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/write/:id"
            element={
              <ProtectedRoute>
                <Createpost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
