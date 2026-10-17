import React, { useState } from 'react';
import { useAuthStore, useAquariumStore } from '../context/store';
import '../styles/dashboard.css';

const timeline = [
  { time: '00:00', title: '아직 설정된 일정이 없습니다', note: '첫 설정을 추가해보세요' },
  { time: '00:00', title: '아직 설정된 일정이 없습니다', note: '첫 설정을 추가해보세요' },
  { time: '00:00', title: '아직 설정된 일정이 없습니다', note: '첫 설정을 추가해보세요' },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const aquariums = useAquariumStore((state) => state.aquariums);
  const addAquarium = useAquariumStore((state) => state.addAquarium);
  const [showForm, setShowForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', time: '08:00' });
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: 'freshwater',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      return;
    }

    addAquarium({
      id: Date.now(),
      name: trimmedName,
      size: formData.size ? Number(formData.size) : 0,
      type: formData.type,
      description: formData.description.trim(),
      Fish: [],
    });

    setFormData({ name: '', size: '', type: 'freshwater', description: '' });
    setShowForm(false);
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    const title = taskForm.title.trim();
    if (!title) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        time: taskForm.time,
        status: '대기',
        type: 'warning',
        done: false,
      },
    ]);
    setTaskForm({ title: '', time: '08:00' });
    setShowTaskForm(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
              status: !task.done ? '완료' : '대기',
            }
          : task
      )
    );
  };

  const completeAllTasks = () => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        done: true,
        status: '완료',
      }))
    );
  };

  const aquariumSummary = aquariums.length
    ? aquariums.map((item) => ({
        name: item.name,
        fish: `물고기 ${item.Fish?.length || 0}마리`,
        health: item.type === 'saltwater' ? '양호' : '준비중',
        tone: item.type === 'saltwater' ? 'success' : 'warning',
      }))
    : [];

  const remainingTasks = tasks.filter((task) => !task.done).length;

  return (
    <div className="page-shell">
      <header className="dashboard-topbar">
        <div>
          <p className="eyebrow">대시보드</p>
          <h2>안녕하세요, {user?.username || '테스트사용자'}님</h2>
        </div>

        <div className="quick-actions">
          <button type="button" className="btn-secondary" onClick={() => setShowTaskForm((prev) => !prev)}>
            {showTaskForm ? '닫기' : '오늘 할 일 추가'}
          </button>
          <button type="button" className="btn-primary" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? '닫기' : '수조 추가'}
          </button>
        </div>
      </header>

      {showTaskForm && (
        <section className="panel aquarium-create-panel">
          <div className="panel-header">
            <h3>오늘 할 일 추가</h3>
          </div>

          <form className="aquarium-create-form" onSubmit={handleTaskSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-title">작업 이름</label>
                <input
                  id="task-title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  placeholder="예: 먹이 주기"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-time">시간</label>
                <input
                  id="task-time"
                  name="time"
                  type="time"
                  value={taskForm.time}
                  onChange={handleTaskFormChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowTaskForm(false)}>
                취소
              </button>
              <button type="submit" className="btn-primary">
                저장하기
              </button>
            </div>
          </form>
        </section>
      )}

      {showForm && (
        <section className="panel aquarium-create-panel">
          <div className="panel-header">
            <h3>새 수조 추가</h3>
          </div>

          <form className="aquarium-create-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aquarium-name">수조 이름</label>
                <input
                  id="aquarium-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="예: 메인 어항"
                />
              </div>

              <div className="form-group">
                <label htmlFor="aquarium-size">크기(리터)</label>
                <input
                  id="aquarium-size"
                  name="size"
                  type="number"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="80"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aquarium-type">수조 종류</label>
                <select
                  id="aquarium-type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="freshwater">담수</option>
                  <option value="saltwater">해수</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="aquarium-description">메모</label>
                <input
                  id="aquarium-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="예: 조명 8시간, 물갈이 주 1회"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                취소
              </button>
              <button type="submit" className="btn-primary">
                저장하기
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="stats-grid">
        <div className="panel stat-card">
          <span className="label">오늘의 작업</span>
          <strong>{remainingTasks}</strong>
          <span>남은 작업</span>
        </div>
        <div className="panel stat-card">
          <span className="label">어항 수</span>
          <strong>{aquariums.length}</strong>
          <span>{aquariums.length ? '등록됨' : '아직 없는 상태'}</span>
        </div>
        <div className="panel stat-card">
          <span className="label">물고기 수</span>
          <strong>{aquariums.reduce((sum, item) => sum + (item.Fish?.length || 0), 0)}</strong>
          <span>추가 전 상태</span>
        </div>
        <div className="panel stat-card">
          <span className="label">알림</span>
          <strong>{remainingTasks}</strong>
          <span>대기 중</span>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel panel-section">
          <div className="panel-header">
            <h3>오늘의 작업 현황</h3>
            <button type="button" className="btn-secondary" onClick={completeAllTasks}>
              완료 체크
            </button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-left">
                  <div
                    className="task-icon"
                    onClick={() => toggleTask(task.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleTask(task.id);
                      }
                    }}
                  >
                    {task.title === '급이' ? '🍽️' : task.title === '물 교환' ? '💧' : '🧹'}
                  </div>
                  <div className="task-copy">
                    <strong>{task.title}</strong>
                    <p>{task.time}</p>
                  </div>
                </div>
                <button type="button" className={task.done ? 'status-badge done' : 'status-badge warning'} onClick={() => toggleTask(task.id)}>
                  {task.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel-section">
          <div className="panel-header">
            <h3>어항 현황</h3>
            <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
              + 추가
            </button>
          </div>

          <div className="fish-mini-list">
            {aquariumSummary.length ? (
              aquariumSummary.map((item) => (
                <div key={item.name} className="fish-mini-item">
                  <div className="fish-mini-left">
                    <div className="fish-badge">🐠</div>
                    <div className="fish-mini-copy">
                      <strong>{item.name}</strong>
                      <p>{item.fish}</p>
                    </div>
                  </div>
                  <span className={item.tone === 'warning' ? 'status-badge warning' : 'status-badge'}>{item.health}</span>
                </div>
              ))
            ) : (
              <div className="empty-state-box">아직 등록된 수조가 없습니다. 새 수조를 추가해보세요.</div>
            )}
          </div>
        </div>
      </section>

      <section className="panel panel-section dashboard-summary">
        <div className="panel-header">
          <h3>관리 타임라인</h3>
        </div>

        <div className="timeline-list">
          {timeline.map((item) => (
            <div key={item.time + item.title} className="timeline-item">
              <div className="timeline-left">
                <div className="timeline-dot">✓</div>
                <div className="timeline-copy">
                  <strong>{item.title}</strong>
                  <p>{item.note}</p>
                </div>
              </div>
              <span className="task-time">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
