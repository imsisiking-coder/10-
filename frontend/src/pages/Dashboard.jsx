import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useAquariumStore } from '../context/store';
import { aquariumAPI } from '../services/api';
import AquariumList from '../components/AquariumList';
import AquariumForm from '../components/AquariumForm';
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const { aquariums, setAquariums, loading, setLoading } = useAquariumStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchAquariums();
  }, [user, navigate]);

  const fetchAquariums = async () => {
    setLoading(true);
    try {
      const data = await aquariumAPI.getAll();
      setAquariums(data.aquariums || []);
    } catch (error) {
      console.error('어항 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🐠 피쉬 키우기</h1>
          <p>환영합니다, {user?.username}님!</p>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="section-header">
          <h2>나의 어항</h2>
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '취소' : '새 어항 추가'}
          </button>
        </div>

        {showForm && <AquariumForm onSuccess={() => {
          setShowForm(false);
          fetchAquariums();
        }} />}

        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : aquariums.length === 0 ? (
          <div className="empty-state">
            <p>아직 어항이 없습니다.</p>
            <p>위 버튼을 눌러 새로운 어항을 추가해보세요!</p>
          </div>
        ) : (
          <AquariumList aquariums={aquariums} onRefresh={fetchAquariums} />
        )}
      </main>
    </div>
  );
}
