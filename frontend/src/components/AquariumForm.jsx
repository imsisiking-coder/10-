import React, { useState } from 'react';
import { useAquariumStore } from '../context/store';
import { aquariumAPI } from '../services/api';
import '../styles/components.css';

export default function AquariumForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('freshwater');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addAquarium = useAquariumStore((state) => state.addAquarium);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await aquariumAPI.create(name, parseInt(size), type, description);
      addAquarium(data.aquarium);
      setName('');
      setSize('');
      setType('freshwater');
      setDescription('');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || '어항 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="aquarium-form" onSubmit={handleSubmit}>
      <h3>새 어항 추가</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>어항 이름 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="예: 메인 어항"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>크기 (갤런)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="20"
          />
        </div>

        <div className="form-group">
          <label>종류</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="freshwater">담수</option>
            <option value="saltwater">해수</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="어항에 대한 메모..."
          rows="3"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? '생성 중...' : '어항 생성'}
      </button>
    </form>
  );
}
