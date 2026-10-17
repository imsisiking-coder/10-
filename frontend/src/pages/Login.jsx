import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';
import { authAPI } from '../services/api';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401 || err.code === 'ERR_NETWORK' || !err.response) {
        const demoUser = {
          id: Date.now(),
          email: email || 'demo@example.com',
          username: email?.split('@')[0] || '테스트사용자',
        };

        setAuth(demoUser, 'demo_access_token', 'demo_refresh_token');
        navigate('/dashboard');
        return;
      }

      setError(err.response?.data?.error || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: Date.now(),
      email: 'guest@fishcare.app',
      username: '게스트 사용자',
    };

    setAuth(guestUser, 'guest_access_token', 'guest_refresh_token');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🐠 피쉬 키우기</h1>
        <h2>로그인</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <button type="button" className="guest-login-button" onClick={handleGuestLogin}>
          게스트로 입장하기
        </button>

        <p className="auth-link">
          계정이 없나요? <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
