import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../context/store';
import { authAPI } from '../services/api';

const initialSettings = {
  feeding: true,
  waterChange: true,
  cleaning: true,
  quietHours: '22:00 ~ 08:00',
  unit: '리터',
  emailSummary: '매일 오후 6시',
};

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '수조를 건강하게 관리하는 초보자',
  });
  const [notifySettings, setNotifySettings] = useState(initialSettings);

  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '수조를 건강하게 관리하는 초보자',
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile({
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
    });
    setIsEditing(false);
  };

  const handleSendTestEmail = async () => {
    if (!user?.email) {
      alert('로그인된 이메일 정보가 없습니다.');
      return;
    }

    try {
      setSendingTestEmail(true);
      const response = await authAPI.sendTestEmail();
      alert(response.message || `${user.email}로 테스트 알림을 보냈습니다.`);
    } catch (error) {
      alert(error.response?.data?.error || '테스트 알림 발송에 실패했습니다.');
    } finally {
      setSendingTestEmail(false);
    }
  };

  const toggleSetting = (key) => {
    setNotifySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateSetting = (key, value) => {
    setNotifySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const settingsItems = [
    {
      label: '급이 알림',
      value: notifySettings.feeding ? '활성화' : '비활성화',
      accent: notifySettings.feeding,
      type: 'toggle',
      keyName: 'feeding',
    },
    {
      label: '물 교환 알림',
      value: notifySettings.waterChange ? '활성화' : '비활성화',
      accent: notifySettings.waterChange,
      type: 'toggle',
      keyName: 'waterChange',
    },
    {
      label: '청소 알림',
      value: notifySettings.cleaning ? '활성화' : '비활성화',
      accent: notifySettings.cleaning,
      type: 'toggle',
      keyName: 'cleaning',
    },
    {
      label: '조용한 시간대',
      value: notifySettings.quietHours,
      accent: false,
      type: 'select',
      options: ['22:00 ~ 08:00', '21:00 ~ 07:00', '20:00 ~ 06:00'],
      keyName: 'quietHours',
    },
    {
      label: '기본 단위',
      value: notifySettings.unit,
      accent: false,
      type: 'select',
      options: ['리터', '갤런', '밀리리터'],
      keyName: 'unit',
    },
    {
      label: '이메일 요약',
      value: notifySettings.emailSummary,
      accent: false,
      type: 'select',
      options: ['매일 오후 6시', '주 2회', '매주 월요일'],
      keyName: 'emailSummary',
    },
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">설정</p>
          <h1>개인 맞춤 관리 환경을 설정하세요</h1>
        </div>
      </header>

      <section className="panel settings-panel">
        <div className="profile-card">
          <div className="profile-avatar">🐠</div>
          <div className="profile-meta">
            <p className="profile-label">프로필</p>
            <h2>{user?.username || '테스트사용자'}</h2>
            <p>{user?.bio || '수조를 건강하게 관리하는 초보자'}</p>
          </div>
          {!isEditing && (
            <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
              프로필 편집
            </button>
          )}
        </div>

        {isEditing && (
          <div className="profile-editor">
            <div className="field-group">
              <label htmlFor="username">닉네임</label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="bio">소개</label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="profile-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                취소
              </button>
              <button type="button" className="btn-primary" onClick={handleSave}>
                저장하기
              </button>
            </div>
          </div>
        )}

        <div className="settings-list">
          {settingsItems.map((item) => (
            <div key={item.label} className="settings-row">
              <span>{item.label}</span>
              <div className="settings-value-wrap">
                {item.type === 'toggle' ? (
                  <button
                    type="button"
                    className={item.accent ? 'pill active switch-on' : 'pill switch-off'}
                    onClick={() => toggleSetting(item.keyName)}
                  >
                    {item.value}
                  </button>
                ) : (
                  <select
                    className="settings-select"
                    value={notifySettings[item.keyName]}
                    onChange={(event) => updateSetting(item.keyName, event.target.value)}
                  >
                    {item.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="test-email-wrapper">
          <button type="button" className="btn-primary" onClick={handleSendTestEmail} disabled={sendingTestEmail}>
            {sendingTestEmail ? '메일 보내는 중...' : '테스트 알림 보내기'}
          </button>
          <small>{user?.email || '로그인된 이메일 없음'}</small>
        </div>
      </section>
    </div>
  );
}
