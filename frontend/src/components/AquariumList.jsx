import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAquariumStore } from '../context/store';
import { aquariumAPI } from '../services/api';
import '../styles/components.css';

export default function AquariumList({ aquariums, onRefresh }) {
  const navigate = useNavigate();
  const deleteAquarium = useAquariumStore((state) => state.deleteAquarium);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 어항을 삭제하시겠습니까?')) {
      try {
        await aquariumAPI.delete(id);
        deleteAquarium(id);
        onRefresh?.();
      } catch (error) {
        console.error('어항 삭제 오류:', error);
        alert('어항 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="aquarium-list">
      {aquariums.map((aquarium) => (
        <div key={aquarium.id} className="aquarium-card">
          <div className="aquarium-header">
            <h3>{aquarium.name}</h3>
            <span className={`type-badge ${aquarium.type}`}>
              {aquarium.type === 'freshwater' ? '담수' : '해수'}
            </span>
          </div>

          {aquarium.size && <p className="aquarium-size">크기: {aquarium.size}갤런</p>}
          {aquarium.description && <p className="aquarium-description">{aquarium.description}</p>}

          <div className="aquarium-stats">
            <span className="stat">
              물고기: {aquarium.Fish?.length || 0}마리
            </span>
          </div>

          <div className="aquarium-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate(`/aquarium/${aquarium.id}`)}
            >
              관리하기
            </button>
            <button
              className="btn-danger"
              onClick={() => handleDelete(aquarium.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
