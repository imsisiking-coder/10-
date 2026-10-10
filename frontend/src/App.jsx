import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './context/store';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
  useEffect(() => {
    // 테스트 사용자 자동 설정
    const { user } = useAuthStore.getState();
    if (!user) {
      useAuthStore.getState().setAuth(
        { id: 1, email: 'test@example.com', username: '테스트사용자' },
        'test_token_' + Date.now(),
        'test_refresh_token_' + Date.now()
      );
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
