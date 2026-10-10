# 🐠 피쉬 키우기 - 개발 가이드

**프로젝트 상태**: MVP 개발 완료  
**버전**: 1.0.0 (초기 개발)

---

## 🚀 빠른 시작

### 1. 백엔드 설정

#### 필수 요구사항
- Node.js 18+
- PostgreSQL 14+
- SendGrid 계정 (이메일 알람용)

#### 설치 및 실행
```bash
cd backend

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (DATABASE, SENDGRID 설정)
# 주요 설정:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=fishcare_dev
# - DB_USER=postgres
# - DB_PASSWORD=postgres
# - SENDGRID_API_KEY=your_key_here

# 개발 서버 시작
npm run dev

# 서버는 http://localhost:5000에서 실행됩니다
```

#### API 엔드포인트 테스트
```bash
# 회원가입
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "테스트사용자"
  }'

# 로그인
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

### 2. 프론트엔드 설정

#### 필수 요구사항
- Node.js 18+
- npm 9+

#### 설치 및 실행
```bash
cd frontend

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (필요시)
# VITE_API_URL=http://localhost:5000/api/v1

# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

---

## 📋 프로젝트 구조

### 백엔드 (`/backend`)
```
src/
├── app.js              # Express 메인 앱
├── config/
│   └── database.js     # Sequelize 설정
├── models/             # 데이터베이스 모델
│   ├── User.js
│   ├── Aquarium.js
│   ├── Fish.js
│   ├── FishSpecies.js
│   ├── Schedule.js
│   ├── Notification.js
│   └── EmailLog.js
├── controllers/        # API 컨트롤러
│   ├── authController.js
│   ├── aquariumController.js
│   └── scheduleController.js
├── services/           # 비즈니스 로직
│   ├── authService.js
│   └── emailService.js
├── routes/             # API 라우트
│   ├── auth.js
│   ├── aquariums.js
│   └── schedules.js
├── middleware/         # 미들웨어
│   └── auth.js
├── jobs/               # Cron 작업
│   └── emailAlarmJob.js
└── migrations/         # 데이터베이스 마이그레이션
```

### 프론트엔드 (`/frontend`)
```
src/
├── App.jsx            # 메인 앱 컴포넌트
├── main.jsx           # 엔트리 포인트
├── pages/             # 페이지 컴포넌트
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── components/        # 재사용 가능한 컴포넌트
│   ├── AquariumForm.jsx
│   └── AquariumList.jsx
├── services/          # API 서비스
│   └── api.js
├── context/           # 상태 관리 (Zustand)
│   └── store.js
└── styles/            # CSS 파일
    ├── auth.css
    ├── dashboard.css
    └── components.css
```

---

## 🔧 주요 기능

### 1. 인증 (Authentication)
- ✅ 회원가입 / 로그인
- ✅ JWT 토큰 기반 인증
- ✅ 토큰 갱신 (Refresh Token)
- ✅ 자동 로그아웃

### 2. 어항 관리 (Aquarium Management)
- ✅ 어항 생성 / 조회 / 수정 / 삭제
- ✅ 어항 타입 (담수/해수)
- ✅ 물고기 정보 포함

### 3. 일정 관리 (Schedule Management)
- ✅ 일정 생성 (급이, 물 교환, 청소)
- ✅ 일정 조회 / 수정 / 삭제
- ✅ 일정 완료 표시

### 4. 이메일 알람 (Email Alarm)
- ✅ Cron Job 기반 매시간 체크
- ✅ SendGrid를 통한 이메일 발송
- ✅ 조용한 시간대 설정
- ✅ 중복 발송 방지
- ✅ 이메일 기록 추적

---

## 📊 API 명세

### 인증
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### 어항
```
POST   /api/v1/aquariums           # 생성
GET    /api/v1/aquariums           # 목록 조회
GET    /api/v1/aquariums/:id       # 상세 조회
PUT    /api/v1/aquariums/:id       # 수정
DELETE /api/v1/aquariums/:id       # 삭제
```

### 일정
```
POST   /api/v1/schedules           # 생성
GET    /api/v1/schedules           # 조회 (aquarium_id 필수)
PUT    /api/v1/schedules/:id       # 수정
POST   /api/v1/schedules/:id/complete # 완료
DELETE /api/v1/schedules/:id       # 삭제
```

---

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 (Windows)
1. PostgreSQL 공식 웹사이트에서 다운로드
2. 설치 시 기본 설정 유지
3. pgAdmin 또는 psql을 통해 관리

### 데이터베이스 생성
```bash
# psql 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE fishcare_dev;

# 연결 확인
\l
```

---

## 🔐 환경 변수 설정

### 백엔드 (.env)
```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fishcare_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=dev_secret_key
JWT_REFRESH_SECRET=dev_refresh_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@fishcare.app

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 프론트엔드 (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🧪 테스트

### 백엔드 테스트
```bash
cd backend

# 모든 테스트 실행
npm test

# 특정 파일 테스트
npm test -- authController.test.js

# Watch 모드
npm run test:watch
```

### 프론트엔드 테스트
```bash
cd frontend

# 테스트 설정 예정
```

---

## 🚀 배포

### 백엔드 배포 (AWS / Google Cloud)
1. PostgreSQL 데이터베이스 프로비저닝
2. SendGrid API 키 설정
3. 환경 변수 구성
4. Node.js 런타임 선택
5. 자동 배포 설정 (GitHub Actions)

### 프론트엔드 배포 (Vercel / Netlify)
1. `npm run build` 실행
2. `dist/` 디렉토리 배포
3. 환경 변수 설정
4. 커스텀 도메인 연결

---

## 📝 주요 파일 설명

### 백엔드 핵심 파일

#### `src/app.js`
- Express 서버 설정
- CORS, JSON 파서 구성
- 라우트 등록
- 데이터베이스 동기화
- Cron Job 시작

#### `src/jobs/emailAlarmJob.js`
- 매시간 일정 체크
- SendGrid 이메일 발송
- 조용한 시간대 처리
- 중복 발송 방지
- 발송 기록 저장

#### `src/services/emailService.js`
- SendGrid API 통합
- 이메일 템플릿 생성
- 테스트 이메일 발송

### 프론트엔드 핵심 파일

#### `src/context/store.js`
- Zustand 상태 관리
- 인증 상태
- 어항 데이터
- 일정 데이터

#### `src/services/api.js`
- Axios 인터셉터
- API 호출 통합
- 토큰 자동 갱신
- 에러 처리

---

## 🐛 트러블슈팅

### 데이터베이스 연결 실패
```
Error: connect ECONNREFUSED
해결: PostgreSQL 서비스 실행 확인
psql -U postgres -d fishcare_dev
```

### CORS 에러
```
Access to XMLHttpRequest blocked
해결: 백엔드 .env의 FRONTEND_URL 확인
또는 CORS 미들웨어 설정 확인
```

### 이메일 미발송
```
해결:
1. SendGrid API 키 확인
2. 발신 이메일 주소 확인
3. 스팸 필터 확인
4. 서버 로그 확인
```

---

## 📚 다음 단계 (Phase 2+)

### 예정된 기능
- 물고기 종류 데이터베이스 확장
- 커뮤니티 게시판
- AI 기반 어항 추천
- 모바일 앱 (React Native)
- 다중 언어 지원
- 고급 분석 대시보드

---

## 📞 지원

문제가 발생하면:
1. 로그 확인 (서버 콘솔)
2. GitHub Issues 확인
3. 이메일: support@fishcare.app

---

**마지막 업데이트**: 2026년 10월 10일  
**개발자**: FishCare Development Team
