import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './app/page';
import MovieDetail from './app/movie/[id]/page';
import Login from './app/login/page';
import Register from './app/register/page';
import Subscribe from './app/subscribe/page';
import ForgotPassword from './app/forgot-password/page';
import Dashboard from './app/dashboard/page';

import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
 
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/dashboard'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;
