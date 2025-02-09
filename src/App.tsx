import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ChatInterface } from './ChatInterface';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailVerification from './components/OTPVerification';
import ForgotPassword from './components/ForgotPassword';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/chat" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/chat" /> : <Signup />}
            />
            <Route
              path="/verify-email"
              element={<EmailVerification />}
            />
            <Route
              path="/forgot-password"
              element={isAuthenticated ? <Navigate to="/chat" /> : <ForgotPassword />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatInterface />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
