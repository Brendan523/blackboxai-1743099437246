import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWindow from './components/ChatWindow';
import TaskManager from './components/TaskManager';
import Dashboard from './components/Dashboard';
import TransactionDashboard from './components/TransactionDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      // TODO: Implement actual auth check
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header 
        isAuthenticated={isAuthenticated}
        isPrivateMode={isPrivateMode}
        darkMode={darkMode}
        onPrivateModeToggle={() => setIsPrivateMode(!isPrivateMode)}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={
            <Login onLogin={() => setIsAuthenticated(true)} />
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatWindow isPrivateMode={isPrivateMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TaskManager isPrivateMode={isPrivateMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard isPrivateMode={isPrivateMode} />
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <TransactionDashboard isPrivateMode={isPrivateMode} />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to chat */}
          <Route path="/" element={
            <Navigate to="/chat" replace />
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;