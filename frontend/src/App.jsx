import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import { useAuthStore } from './context/store';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Settings from './pages/Settings';
import './App.css';

const TUTORIAL_STORAGE_KEY = 'fishcare_tutorial_seen';

const tutorialSteps = [
  {
    title: '환영합니다! 🐠',
    description:
      '피쉬 키우기는 물고기별 관리 루틴, 어항 상태 확인, 일정 관리, 알림 설정을 한 번에 정리해주는 가이드형 관리 앱입니다.',
    goal: '처음에는 전체 흐름을 이해하고, 어떤 화면을 어디서 쓰는지 익히는 단계입니다.',
    checklist: [
      '대시보드에서 어항과 물고기 현황을 한눈에 확인합니다.',
      '우측 사이드바에서 이동 경로를 이해합니다.',
      '처음에는 “한 번에 하나씩” 익히면 훨씬 편합니다.',
    ],
    tip: '처음엔 “어항 추가 → 물고기 등록 → 일정 설정” 순서로 시작하면 가장 자연스럽습니다.',
  },
  {
    title: '대시보드에서 상태를 먼저 보세요',
    description:
      '대시보드에서는 현재 어항 수, 물고기 수, 일정 상태를 한 번에 확인할 수 있어요. 이 화면은 관리의 중심이 됩니다.',
    goal: '오늘 해야 할 일과 지금 상태를 빠르게 파악하는 단계입니다.',
    checklist: [
      '어항 상태를 확인해 현재 건강 상태를 점검합니다.',
      '완료되지 않은 일정을 보고 우선순위를 정합니다.',
      '주의가 필요한 항목을 먼저 해결합니다.',
    ],
    tip: '대시보드는 “오늘 관리할 것”을 잡는 메인 화면이라서 자주 보시는 걸 추천합니다.',
  },
  {
    title: '물고기 검색으로 맞는 종을 찾기',
    description:
      '검색 탭에서는 다양한 물고기 종을 살펴보고, 환경 요구사항, 관리 난이도, 적합한 생활 조건을 함께 비교할 수 있습니다.',
    goal: '사육할 물고기와 어항 환경을 미리 맞춰서 잘못된 선택을 줄이는 단계입니다.',
    checklist: [
      '종 정보를 확인해 서식 환경을 비교합니다.',
      '어항 크기와 물 조건이 맞는지 점검합니다.',
      '관리 난이도에 맞는 물고기를 선택합니다.',
    ],
    tip: '초보자라면 “관리 쉬운 종”부터 시작하고, 실력이 늘면 종 다양성을 늘리면 좋습니다.',
  },
  {
    title: '일정과 알림을 설정해 자동 관리',
    description:
      '이 앱은 급이, 물 교환, 청소 같은 관리 루틴을 일정으로 남기고, 필요한 경우 알림을 보내도록 구성할 수 있습니다.',
    goal: '반복 관리 실수를 줄이고 물고기를 건강하게 유지하는 단계입니다.',
    checklist: [
      '급이, 물 교환, 청소를 일정으로 등록합니다.',
      '알림 기능을 켜서 잊지 않도록 합니다.',
      '설정에서 사용 패턴에 맞게 조절합니다.',
    ],
    tip: '처음에는 자주 하는 일정을 정기적으로 설정해두면 물고기 관리가 훨씬 안정적입니다.',
  },
  {
    title: '시작해볼까요? 🚀',
    description:
      '이제 바로 어항을 추가하고, 살고 있는 물고기를 등록해보세요. 작은 관리 습관이 물고기 건강을 오래 유지합니다.',
    goal: '첫 번째 실사용 흐름을 시작하는 마지막 단계입니다.',
    checklist: [
      '처음에는 한 어항만 만들어도 충분합니다.',
      '물고기를 1~2마리로 시작해보세요.',
      '일정을 등록하고 하루 한 번 상태를 점검해보세요.',
    ],
    tip: '우선은 “너무 많이” 만들기보다 “꾸준히 관리하는 것”이 가장 중요합니다.',
  },
];

function SiteTutorial({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep === tutorialSteps.length - 1) {
      onClose();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="tutorial-backdrop">
      <div className="tutorial-modal panel">
        <div className="tutorial-header">
          <div>
            <p className="tutorial-badge">사이트 이용 가이드</p>
            <h2>{step.title}</h2>
          </div>
          <button type="button" className="tutorial-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tutorial-body">
          <p>{step.description}</p>

          <div className="tutorial-goal-box">
            <span className="tutorial-goal-label">이 단계의 목표</span>
            <strong>{step.goal}</strong>
          </div>

          <ul className="tutorial-checklist">
            {step.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="tutorial-tip">💡 {step.tip}</div>
        </div>

        <div className="tutorial-progress" aria-label="튜토리얼 진행도">
          {tutorialSteps.map((_, index) => (
            <span
              key={index}
              className={index === currentStep ? 'progress-dot active' : 'progress-dot'}
            />
          ))}
        </div>

        <div className="tutorial-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            건너뛰기
          </button>
          <button type="button" className="btn-primary" onClick={handleNext}>
            {currentStep === tutorialSteps.length - 1 ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children, onOpenTutorial }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">🐠</div>
          <div>
            <strong>피쉬 키우기</strong>
            <small>Fish Care Assistant</small>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink className="nav-item" to="/dashboard">
            대시보드
          </NavLink>
          <NavLink className="nav-item" to="/search">
            물고기 검색
          </NavLink>
          <NavLink className="nav-item" to="/settings">
            설정
          </NavLink>
        </nav>

        <div className="user-card">
          <p className="user-label">접속 유저</p>
          <strong>{user?.username || '게스트'}</strong>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            로그아웃
          </button>
          {onOpenTutorial && (
            <button type="button" className="btn-secondary tutorial-trigger" onClick={onOpenTutorial}>
              튜토리얼 보기
            </button>
          )}
        </div>
      </aside>

      <main className="content-area">{children}</main>
    </div>
  );
}

export default function App() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);
  const user = useAuthStore((state) => state.user);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!user) {
      setShowTutorial(false);
      return;
    }

    const hasSeenTutorial = window.localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      return;
    }

    setShowTutorial(false);
  }, [user]);

  const handleTutorialClose = () => {
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setShowTutorial(false);
  };

  const handleOpenTutorial = () => {
    window.localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setShowTutorial(true);
  };

  return (
    <Router>
      {showTutorial && <SiteTutorial onClose={handleTutorialClose} />}
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout onOpenTutorial={handleOpenTutorial}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <AppLayout onOpenTutorial={handleOpenTutorial}>
                <Search />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout onOpenTutorial={handleOpenTutorial}>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
