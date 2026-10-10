# 🐠 피쉬 키우기 - TRD (Technical Requirements Document)

**작성일:** 2026년 10월  
**버전:** 1.0  
**문서 타입:** Technical Requirements Document (기술 요구사항 명세서)

---

## 📋 목차
1. [기술 개요](#기술-개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [기술 스택](#기술-스택)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [API 명세](#api-명세)
6. [보안 요구사항](#보안-요구사항)
7. [성능 요구사항](#성능-요구사항)
8. [에러 처리 전략](#에러-처리-전략)
9. [로깅 및 모니터링](#로깅-및-모니터링)
10. [테스트 전략](#테스트-전략)
11. [개발 환경](#개발-환경)
12. [배포 전략](#배포-전략)

---

## 🎯 기술 개요

### 프로젝트 개요
물고기 사육 관리 앱 "피쉬 키우기"의 기술 명세서입니다. 이 문서는 개발팀이 참고해야 할 모든 기술 요구사항을 정의합니다.

### 대상 플랫폼
- **Primary**: 웹사이트 (Chrome, Firefox, Safari, Edge)
- **Secondary**: PWA (Progressive Web App) - 모바일 웹
- **Future**: 모바일 앱 (React Native)

### 개발 방법론
- Agile/Scrum 기반
- Sprint 1주 단위
- 2주 단위 릴리스 계획

---

## 🏗️ 시스템 아키텍처

### 고수준 아키텍처 (High-Level Architecture)

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│    ┌──────────────────────────────────────────┐    │
│    │  React.js 웹사이트  │   PWA (모바일)     │    │
│    │  (Chrome 최적화)    │  (설치 가능)       │    │
│    └──────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│                  API Gateway                        │
│    (REST API)                                       │
└──────────────────────┬──────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth       │  │ Core Service │  │ Alert        │
│ Service    │  │              │  │ Service      │
└────────────┘  └──────────────┘  └──────────────┘
    │                  │                  │
    │                  │    ┌─────────────┼─────────────┐
    │                  │    │             │             │
    │                  │    ▼             ▼             ▼
    │                  │  Browser  Email  Cron
    │                  │  Push     Service Job
    │                  │
    └──────────────────┼──────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                Database Layer                       │
│  ┌──────────────┐         ┌──────────────┐         │
│  │ Primary DB   │         │ Cache Layer  │         │
│  │ (PostgreSQL) │         │ (Redis)      │         │
│  └──────────────┘         └──────────────┘         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           External Services                          │
│  ┌──────────────┐    ┌────────────────┐            │
│  │ Email Service│    │ Image Storage  │            │
│  │ (SendGrid)   │    │ (AWS S3)       │            │
│  └──────────────┘    └────────────────┘            │
└──────────────────────────────────────────────────────┘
```
│  │ Firebase     │    │ Image Storage  │            │
│  │ Cloud        │    │ (AWS S3)       │            │
│  │ Messaging    │    │                │            │
│  └──────────────┘    └────────────────┘            │
└──────────────────────────────────────────────────────┘
```

### 마이크로서비스 구조 (Phase 2 이후)

#### 1. Authentication Service
- 사용자 인증 및 인가
- JWT 토큰 관리
- OAuth 2.0 구현

#### 2. Schedule Service
- 일정 관리 로직
- 알람 트리거
- 푸시 알람 발송

#### 3. Fish Information Service
- 물고기 정보 검색
- 물고기 DB 관리
- 추천 기능

#### 4. User Management Service
- 사용자 프로필 관리
- 어항 관리
- 사용자 설정

#### 5. Analytics Service
- 사용 패턴 분석
- 통계 계산
- 보고서 생성

---

## 💻 기술 스택

### Frontend (클라이언트)

#### 프레임워크 및 라이브러리
- **React** 18.0+
  - Hook 기반 함수형 컴포넌트
  - React Router v6 (라우팅)
  - Context API (상태 관리, Redux 검토)
  
#### 주요 라이브러리
- **상태 관리**: Redux Toolkit 또는 Zustand
- **UI 컴포넌트**: Material-UI 또는 Chakra UI
- **HTTP 클라이언트**: Axios
- **폼 관리**: React Hook Form
- **날짜 처리**: Day.js
- **차트**: Chart.js 또는 Recharts
- **PWA**: Workbox (Service Worker)

#### 웹 API 활용
- **Web Push Notification API**: 브라우저 푸시 알림
- **Service Worker**: 백그라운드 동작, 오프라인 지원
- **Notification API**: 데스크탑 알림
- **Local Storage**: 클라이언트 캐싱
- **IndexedDB**: 대용량 데이터 로컬 저장

#### 개발 도구
- **빌드**: Vite 또는 Create React App
- **번들링**: Webpack / esbuild
- **테스트**: Vitest + React Testing Library
- **코드 품질**: ESLint + Prettier
- **번전 관리**: Git + GitHub

#### 반응형 디자인
- **모바일 우선 접근법**
- **CSS Grid & Flexbox**
- **미디어 쿼리**:
  - 모바일 (< 768px)
  - 태블릿 (768px - 1024px)
  - 데스크탑 (> 1024px)

### Backend (서버)

#### 런타임 환경
- **Node.js** 18.0.0 LTS 이상
- **Runtime**: Express.js 또는 Fastify

#### 주요 라이브러리
- **Web Framework**: Express.js 4.18.0+
- **ORM**: Sequelize 또는 TypeORM
- **데이터 검증**: Joi / Class Validator
- **API 문서**: Swagger/OpenAPI
- **로깅**: Winston / Pino
- **테스트**: Jest + Supertest
- **스케줄링**: node-cron / Bull (큐)

#### 인증 & 보안
- **JWT**: jsonwebtoken 9.0.0+
- **패스워드**: bcrypt
- **환경 변수**: dotenv
- **CORS**: cors middleware
- **Rate Limiting**: express-rate-limit

### Database

#### Primary Database
- **PostgreSQL** 14.0+ 또는 **MySQL** 8.0+
- **이유**: 
  - 데이터 무결성 (ACID)
  - 스케일링 용이
  - 관계형 데이터 구조

#### Cache Layer
- **Redis** 7.0+
- **사용처**:
  - 세션 관리
  - 자주 접근하는 물고기 정보 캐싱
  - 알람 큐

#### File Storage
- **AWS S3** 또는 **Google Cloud Storage**
- **용도**: 물고기 이미지, 사용자 업로드 이미지

### DevOps & Deployment

#### 컨테이너화
- **Docker** 20.10+
- **Docker Compose** for local development

#### 배포
- **AWS ECS** 또는 **Google Cloud Run**
- **Kubernetes** (향후)

#### CI/CD
- **GitHub Actions**
- **Deploy**: Automated deployment on merge

#### 모니터링
- **Sentry**: 에러 추적
- **Datadog** 또는 **New Relic**: APM
- **CloudWatch**: AWS 로그 및 모니터링

---

## 📊 데이터베이스 설계

### Entity Relationship Diagram (ERD)

```
User (사용자)
├── id (PK)
├── email (UK)
├── password_hash
├── username
├── created_at
├── updated_at
└── deleted_at

Aquarium (어항)
├── id (PK)
├── user_id (FK)
├── name
├── size (갤런 또는 리터)
├── type (담수/해수)
├── created_at
├── updated_at
└── deleted_at

Fish (물고기)
├── id (PK)
├── aquarium_id (FK)
├── species_id (FK)
├── name (별명)
├── added_date
├── notes
├── created_at
├── updated_at
└── deleted_at

FishSpecies (물고기 종류)
├── id (PK)
├── common_name
├── scientific_name
├── description
├── habitat
├── food_type
├── feeding_frequency
├── care_tips
├── image_url
├── difficulty_level
├── min_temp
├── max_temp
├── created_at
└── updated_at

Schedule (일정)
├── id (PK)
├── aquarium_id (FK)
├── schedule_type (feeding/water_change/cleaning)
├── time_of_day (시간)
├── frequency (daily/weekly/monthly)
├── last_completed_at
├── next_scheduled_at
├── created_at
├── updated_at
└── deleted_at

Notification (알람)
├── id (PK)
├── user_id (FK)
├── schedule_id (FK)
├── notification_type
├── scheduled_time
├── sent_at
├── read_at
├── created_at
└── updated_at

MaintenanceLog (관리 기록)
├── id (PK)
├── schedule_id (FK)
├── completed_at
├── notes
├── image_url
├── created_at
└── updated_at
```

### 주요 테이블 명세

#### Users 테이블
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

#### FishSpecies 테이블
```sql
CREATE TABLE fish_species (
  id INT PRIMARY KEY AUTO_INCREMENT,
  common_name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(100),
  description TEXT,
  habitat VARCHAR(255),
  food_type VARCHAR(255),
  feeding_frequency VARCHAR(100),
  care_tips TEXT,
  image_url VARCHAR(500),
  difficulty_level ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
  min_temp INT,
  max_temp INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_common_name (common_name)
);
```

#### Schedule 테이블
```sql
CREATE TABLE schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aquarium_id INT NOT NULL,
  schedule_type ENUM('feeding', 'water_change', 'cleaning') NOT NULL,
  time_of_day TIME,
  frequency VARCHAR(50),
  last_completed_at TIMESTAMP NULL,
  next_scheduled_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (aquarium_id) REFERENCES aquariums(id),
  INDEX idx_aquarium_id (aquarium_id),
  INDEX idx_next_scheduled_at (next_scheduled_at)
);
```

---

## 🔌 API 명세

### API 설계 원칙
- RESTful 아키텍처 준수
- JSON 요청/응답
- HTTP 상태 코드 표준 사용
- API 버저닝 (v1, v2)

### 주요 Endpoints

#### Authentication
```
POST /api/v1/auth/register
- 사용자 회원가입
- Request: { email, password, username }
- Response: { user_id, token }

POST /api/v1/auth/login
- 사용자 로그인
- Request: { email, password }
- Response: { token, user }

POST /api/v1/auth/refresh
- 토큰 갱신
- Request: { refresh_token }
- Response: { access_token }
```

#### Fish Information
```
GET /api/v1/fish-species
- 물고기 종류 전체 조회
- Query: { page, limit, search, difficulty }
- Response: { data: [], total, page, limit }

GET /api/v1/fish-species/:id
- 특정 물고기 정보 조회
- Response: { id, common_name, habitat, care_tips, ... }

GET /api/v1/fish-species/search?name=
- 물고기 검색
- Query: { name, type, difficulty }
- Response: { results: [] }
```

#### Aquarium Management
```
POST /api/v1/aquariums
- 어항 생성
- Request: { name, size, type }
- Response: { aquarium_id, name, ... }

GET /api/v1/aquariums
- 사용자의 어항 목록 조회
- Response: { aquariums: [] }

GET /api/v1/aquariums/:aquarium_id
- 특정 어항 조회
- Response: { id, name, fish: [] }

PUT /api/v1/aquariums/:aquarium_id
- 어항 정보 수정
- Request: { name, size, type }

DELETE /api/v1/aquariums/:aquarium_id
- 어항 삭제
```

#### Schedule Management
```
POST /api/v1/aquariums/:aquarium_id/schedules
- 일정 생성
- Request: { schedule_type, time_of_day, frequency }
- Response: { schedule_id, ... }

GET /api/v1/aquariums/:aquarium_id/schedules
- 어항의 일정 조회
- Response: { schedules: [] }

PUT /api/v1/schedules/:schedule_id
- 일정 수정
- Request: { time_of_day, frequency }

DELETE /api/v1/schedules/:schedule_id
- 일정 삭제

POST /api/v1/schedules/:schedule_id/complete
- 일정 완료 처리
- Request: { notes, image_url? }
```

#### Notifications
```
GET /api/v1/notifications
- 사용자 알람 조회
- Query: { page, limit, read, type }
- Response: { notifications: [], total }

PUT /api/v1/notifications/:notification_id/read
- 알람 읽음 처리

PUT /api/v1/notifications/preferences
- 알람 수신 설정 변경
- Request: { pushEnabled, emailEnabled, inAppEnabled }

GET /api/v1/notifications/today
- 오늘의 작업 조회
- Response: { tasks: [] }

POST /api/v1/notifications/test
- 테스트 알람 전송 (웹 개발용)
- Request: { channel: 'push' | 'email' | 'inapp' }
```

#### Push Subscription (웹 푸시 알림)
```
POST /api/v1/push-subscription
- 브라우저 푸시 알림 구독
- Request: { subscription: PushSubscription }
- Response: { success: true }

DELETE /api/v1/push-subscription
- 브라우저 푸시 알림 구독 취소

POST /api/v1/push-send
- 푸시 알림 전송 (서버 -> 클라이언트)
- Request: { title, body, data, icon }
```

### API Response Format

#### Success Response
```json
{
  "success": true,
  "status": 200,
  "data": {
    // actual data
  },
  "message": "Operation successful"
}
```

#### Error Response
```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Descriptive error message"
  }
}
```

---

## 🔐 보안 요구사항

### Authentication & Authorization
- **JWT (JSON Web Token)** 기반 인증
- **Access Token**: 15분 유효기간
- **Refresh Token**: 30일 유효기간
- **Role-based Access Control (RBAC)**:
  - Admin
  - User

### Data Security
- **전송 암호화**: HTTPS/TLS 1.3
- **저장소 암호화**: 
  - 비밀번호: bcrypt (salt rounds: 10)
  - 민감한 데이터: AES-256
- **HTTPS 강제**: HTTP 요청 모두 리다이렉트

### Input Validation & Sanitization
- **서버사이드 검증**: 모든 입력값
- **SQL Injection 방지**: ORM 사용, Parameterized Queries
- **XSS 방지**: Content Security Policy (CSP) 헤더
- **CSRF 방지**: CSRF 토큰

### Rate Limiting & DDoS Prevention
- **API Rate Limiting**: 사용자당 분당 100 요청
- **DDoS 방지**: AWS Shield, CloudFlare
- **Brute Force 방지**: 5회 실패 시 잠금 (30분)

### Compliance
- **GDPR**: EU 사용자 데이터 보호
- **개인정보보호법**: 한국 사용자 데이터 보호
- **정기 보안 감사**: 분기별

---

## ⚡ 성능 요구사항

### Response Time SLA
- **API 응답 시간**: < 500ms (p95)
- **페이지 로드 시간**: < 2초 (p95)
- **검색 응답 시간**: < 300ms

### Scalability
- **동시 사용자**: 최소 1,000 명
- **일별 활성 사용자 (DAU)**: 5,000+
- **월별 활성 사용자 (MAU)**: 50,000+
- **수평 확장**: 로드 밸런싱 구현

### Database Performance
- **쿼리 응답 시간**: < 100ms
- **인덱싱**: 주요 쿼리에 인덱스 설정
- **캐싱**: 자주 접근하는 데이터 Redis 캐싱
- **DB 최적화**: 정기적인 성능 모니터링

### Resource Utilization
- **CPU 사용률**: < 70%
- **메모리 사용률**: < 80%
- **디스크 사용률**: < 85%

### Monitoring & Alerting
- **실시간 모니터링**: Datadog, New Relic
- **알람 임계값**:
  - CPU > 75%
  - 메모리 > 85%
  - 에러율 > 1%
  - 응답 시간 > 1초

---

## 🔧 개발 환경

### 로컬 개발 환경 설정

#### Prerequisites
- Node.js 18.0.0 LTS
- npm 9.0.0+
- Docker & Docker Compose
- Git

#### 초기 설정
```bash
# 저장소 클론
git clone https://github.com/fishcare/fishcare-app.git
cd fishcare-app

# 환경 변수 설정
cp .env.example .env
# .env 파일 수정 (DB 연결정보 등)

# 의존성 설치
npm install

# 데이터베이스 초기화
npm run db:setup

# 개발 서버 실행
npm run dev
```

#### Docker Compose 사용
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fishcare_db

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      REDIS_HOST: redis
```

### 개발 도구 및 IDE
- **IDE**: Visual Studio Code
- **필수 확장**:
  - ESLint
  - Prettier
  - REST Client
  - SQLTools

### 테스트 전략

#### Unit Tests
- Framework: Jest
- Coverage: 80% 이상
- Command: `npm run test:unit`

#### Integration Tests
- Framework: Supertest + Jest
- Coverage: 60% 이상
- Command: `npm run test:integration`

#### E2E Tests (앱)
- Framework: Detox
- Target: Critical user flows
- Command: `npm run test:e2e`

---

## 📋 배포 체크리스트

### Pre-Deployment
- [ ] 모든 테스트 통과 (Unit, Integration, E2E)
- [ ] 코드 리뷰 완료
- [ ] 보안 감사 완료
- [ ] 성능 테스트 완료
- [ ] 문서 업데이트

### Deployment
- [ ] 환경 변수 설정
- [ ] 데이터베이스 마이그레이션
- [ ] 배포 전 백업
- [ ] 배포 실행
- [ ] 배포 후 검증

### Post-Deployment
- [ ] 모니터링 확인
- [ ] 에러 로그 검토
- [ ] 성능 메트릭 확인
- [ ] 사용자 피드백 모니터링

---
## 🔔 웹사이트 알람 시스템 상세 설계

### 알람 아키텍처 (웹사이트 특화)

```
┌─────────────────────────────────────────────────────┐
│              사용자 설정                             │
│  ┌─────────────────────────────────────────────┐   │
│  │ • 브라우저 푸시 알림                         │   │
│  │ • 이메일 알림                               │   │
│  │ • 인앱 알림                                 │   │
│  │ • 조용한 시간대 설정 (예: 23:00-08:00)      │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 브라우저    │ │ 백엔드      │ │ Cron 작업   │
│ 푸시 알림   │ │ 알림 서비스 │ │ 스케줄러    │
│             │ │             │ │             │
│ • Service   │ │ • 트리거    │ │ • 이메일    │
│   Worker    │ │ • 라우팅    │ │   발송      │
│             │ │ • DB 저장   │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ 사용자 │    │ 사용자 │    │ 사용자 │
   │(온라인)│   │(오프라인)  │  │(모든곳) │
   └────────┘    └────────┘    └────────┘
```

### 1. 브라우저 푸시 알림 (Web Push Notification)

#### 1.1 구현 기술 스택
```
Browser Push API + Service Worker + Firebase Cloud Messaging (선택)
```

#### 1.2 처리 흐름

**사용자 구독 (초기 1회)**
```javascript
// 1. Service Worker 등록
navigator.serviceWorker.register('/sw.js');

// 2. 푸시 구독 요청
const subscription = await serviceWorkerContainer
  .pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVAPIDKey
  });

// 3. 백엔드에 구독 정보 저장
await fetch('/api/v1/push-subscription', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

**알람 발송 (매시간 체크)**
```javascript
// 백엔드 Cron Job (Node.js)
// 매시간 실행되는 작업

1. 다음 1시간 내 일정 조회
2. 해당 사용자의 구독 정보 가져오기
3. Web Push API로 푸시 발송
4. DB에 알람 기록 저장
5. 사용자의 브라우저에서 Service Worker가 수신
6. 데스크탑 알림 표시
```

**Service Worker 처리**
```javascript
// /public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  // 브라우저 오프라인 상태에서도 알림 표시
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/fish-icon.png',
    badge: '/fish-badge.png',
    tag: data.id, // 중복 방지
    data: data.scheduleId
  });
});

// 알림 클릭 시 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // 앱 열기 또는 해당 페이지로 이동
  clients.matchAll({ type: 'window' }).then((clients) => {
    if (clients.length > 0) {
      clients[0].focus();
      clients[0].navigate(`/schedule/${event.notification.data}`);
    } else {
      clients.openWindow('/');
    }
  });
});
```

#### 1.3 지원 범위
- ✅ Chrome/Chromium (최적)
- ✅ Firefox
- ✅ Edge
- ✅ Android Chrome
- ❌ iOS Safari (미지원)
- ❌ 일부 구형 브라우저

#### 1.4 iOS Safari 대체 방안
```
iOS 사용자 감지
  ↓
푸시 알림 대신 이메일로 자동 전환
  ↓
사용자 설정에서 "이메일 알림"을 "필수"로 표시
  ↓
모든 알람을 이메일로 수신
```

### 2. 이메일 알림

#### 2.1 구현 방식
```
Cron Job (매시간/매일)
  ↓
이메일 서비스 (SendGrid / AWS SES)
  ↓
사용자 이메일 주소로 전송
```

#### 2.2 이메일 템플릿
```
제목: 🐠 피쉬 키우기 - 밥 주기 시간입니다!

본문:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
안녕하세요 [사용자명]님,

메인 어항의 물고기들에게 밥을 줄 시간입니다!

📌 작업 정보
• 어항: 메인 어항
• 물고기: 금붕어 (2마리)
• 시간: 오전 10시
• 예정된 시간: 2026-10-10 10:00 AM

[앱에서 완료 처리하기]
[나중에 알려주기]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

주의: 이 이메일이 필요 없다면
설정에서 "이메일 알림"을 비활성화하세요.
```

#### 2.3 전송 규칙
- **실시간 알림**: 긴급 상황 (물고기 이상)
- **정시 알림**: 일정 발동 시간 정각
- **요약 이메일**: 일일/주간 요약 (선택사항)
- **오프 타임**: 조용한 시간대 제외

### 3. 인앱 알림 (항상 활성)

#### 3.1 UI 구현
```
상단 우측 모서리에 알림 벨 아이콘
  ├─ 읽지 않은 알림 수 배지 (빨간색)
  └─ 클릭 시 알림 패널 표시

알림 패널:
┌──────────────────────────────┐
│ 알림 (3개 읽지 않음)          │
├──────────────────────────────┤
│ ✓ 밥 주기 완료! (2시간 전)   │
│ • 물 교환 준비 (1시간 전)    │
│ • 어항 청소 예정 (내일)      │
├──────────────────────────────┤
│ [모두 읽음으로 표시]          │
│ [알림 설정]                  │
└──────────────────────────────┘
```

#### 3.2 기능
- 실시간 업데이트 (WebSocket 또는 Long Polling)
- 클릭하면 해당 페이지로 이동
- 읽음/읽지 않음 상태 표시
- 오래된 알림 자동 삭제 (30일 후)

### 4. 알람 선호도 설정

#### 사용자 설정 UI
```
┌─────────────────────────────────────┐
│ 알림 및 알람 설정                    │
├─────────────────────────────────────┤
│                                     │
│ 알림 채널                           │
│ ☑️ 브라우저 푸시 알림               │
│   (현재 구독됨)                     │
│                                     │
│ ☑️ 이메일 알림                      │
│   □ 일일 요약 이메일 받기           │
│                                     │
│ ☑️ 인앱 알림 (항상 활성)            │
│                                     │
│ 조용한 시간대                       │
│ □ 활성화                            │
│   시작 시간: [22:00  ▼]             │
│   종료 시간: [08:00  ▼]             │
│                                     │
│ 테스트                              │
│ [테스트 푸시 알림 보내기]            │
│ [테스트 이메일 보내기]              │
│                                     │
│ [설정 저장]                         │
│                                     │
└─────────────────────────────────────┘
```

### 5. 백엔드 알람 스케줄링

#### Node.js Cron Job 예시
```javascript
// server/jobs/scheduleJob.js
const cron = require('node-cron');
const db = require('../database');
const pushService = require('../services/pushService');
const emailService = require('../services/emailService');

// 매시간 정각에 실행
cron.schedule('0 * * * *', async () => {
  console.log('Checking schedules...');
  
  // 지금부터 1시간 내의 모든 일정 조회
  const schedules = await db.query(`
    SELECT s.*, u.id as user_id, u.email, u.preferences
    FROM schedules s
    JOIN aquariums a ON s.aquarium_id = a.id
    JOIN users u ON a.user_id = u.id
    WHERE s.next_scheduled_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
    AND s.deleted_at IS NULL
  `);
  
  for (const schedule of schedules) {
    // 사용자 알림 선호도 확인
    const prefs = JSON.parse(schedule.preferences);
    
    // 1. 브라우저 푸시 알림
    if (prefs.pushEnabled) {
      await pushService.send(schedule.user_id, {
        title: '🐠 밥 주기 시간입니다!',
        body: `메인 어항의 물고기들에게 밥을 주세요`,
        data: { scheduleId: schedule.id }
      });
    }
    
    // 2. 이메일 알림
    if (prefs.emailEnabled) {
      await emailService.send(schedule.email, {
        template: 'schedule-reminder',
        data: schedule
      });
    }
    
    // 3. 인앱 알림
    await db.insertNotification({
      user_id: schedule.user_id,
      schedule_id: schedule.id,
      message: `밥 주기 시간입니다!`,
      type: 'reminder'
    });
    
    // 다음 일정 계산
    const nextSchedule = calculateNextSchedule(schedule);
    await db.update('schedules', 
      { next_scheduled_at: nextSchedule },
      { id: schedule.id }
    );
  }
});
```

---
## � 에러 처리 전략

### 클라이언트 에러 (4xx)
- **400 Bad Request**: 잘못된 요청 포맷
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_REQUEST",
      "message": "Required field 'email' is missing"
    }
  }
  ```

- **401 Unauthorized**: 인증 실패
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired token"
    }
  }
  ```

- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음

### 서버 에러 (5xx)
- **500 Internal Server Error**: 예상치 못한 에러
- **503 Service Unavailable**: 서비스 이용 불가

### 재시도 로직
- 클라이언트에서 자동 재시도 (최대 3회)
- 지수 백오프: 1초 → 2초 → 4초
- 재시도 불가 에러는 즉시 사용자에게 표시

### 사용자 친화적 에러 메시지
- 기술적 오류 대신 이해하기 쉬운 메시지
- 해결 방법 제시
- 예시:
  - 기술: "Database connection timeout"
  - 사용자: "잠시 후 다시 시도해주세요. 문제가 계속되면 고객지원에 문의하세요."

---

## 📊 로깅 및 모니터링

### 로깅 전략

#### 로깅 레벨
| 레벨 | 사용 시기 | 예시 |
|-----|---------|------|
| DEBUG | 개발 단계 세부 추적 | 함수 진입/종료, 변수 값 |
| INFO | 중요한 이벤트 | 사용자 로그인, API 호출 |
| WARN | 잠재적 문제 | 권장되지 않는 API 사용 |
| ERROR | 복구 가능한 에러 | 네트워크 재시도 |
| FATAL | 복구 불가능한 에러 | 서버 크래시 |

#### 로깅 포맷
```json
{
  "timestamp": "2026-10-10T15:30:45.123Z",
  "level": "INFO",
  "service": "auth-service",
  "message": "User login successful",
  "userId": "usr_12345",
  "metadata": {
    "loginMethod": "email",
    "ipAddress": "192.168.1.1",
    "userAgent": "mobile"
  }
}
```

### 모니터링 대시보드

#### 주요 메트릭
1. **서버 상태**:
   - CPU 사용률 (목표: < 70%)
   - 메모리 사용률 (목표: < 80%)
   - 디스크 사용률 (목표: < 85%)

2. **API 성능**:
   - 평균 응답 시간 (목표: < 500ms)
   - p95 응답 시간 (목표: < 1초)
   - p99 응답 시간 (목표: < 2초)
   - 에러율 (목표: < 1%)

3. **사용자 활동**:
   - 동시 사용자 수
   - 요청 처리량 (RPS)
   - API 호출 분포

4. **데이터베이스**:
   - 쿼리 응답 시간 (목표: < 100ms)
   - 연결 풀 사용률
   - 슬로우 쿼리 로그

### 알람 임계값
- CPU > 75% (경고), > 90% (심각)
- 메모리 > 85% (경고), > 95% (심각)
- 응답 시간 > 1초 (경고), > 2초 (심각)
- 에러율 > 1% (경고), > 5% (심각)

---

## 🧪 테스트 전략

### 1. 단위 테스트 (Unit Tests)

#### 범위
- 개별 함수 테스트
- 비즈니스 로직 검증
- 엣지 케이스 처리

#### 예시
```javascript
describe('calculateFeedingAmount', () => {
  it('should calculate correct amount for 10cm fish', () => {
    const amount = calculateFeedingAmount(10);
    expect(amount).toBe('1 pinch');
  });

  it('should return error for invalid size', () => {
    expect(() => calculateFeedingAmount(-5)).toThrow();
  });
});
```

#### 목표 커버리지
- 전체: 80% 이상
- 핵심 기능: 95% 이상
- 유틸리티: 90% 이상

### 2. 통합 테스트 (Integration Tests)

#### 범위
- API 엔드포인트 테스트
- 데이터베이스 상호작용
- 외부 서비스 연동 (Mocking)

#### 예시
```javascript
describe('POST /api/v1/aquariums', () => {
  it('should create new aquarium', async () => {
    const response = await request(app)
      .post('/api/v1/aquariums')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Living Room', size: 20 })
      .expect(201);

    expect(response.body.data.id).toBeDefined();
  });
});
```

#### 목표 커버리지
- 모든 주요 API 엔드포인트 (60% 이상)

### 3. E2E 테스트 (End-to-End Tests)

#### 범위
- 실제 사용자 시나리오
- 크리티컬 워크플로우
- 모바일 앱 UI 테스트

#### 테스트 시나리오
1. **회원가입 및 로그인**
   - 회원가입 → 이메일 인증 → 로그인

2. **어항 생성 및 물고기 추가**
   - 어항 생성 → 물고기 검색 → 물고기 추가 → 확인

3. **일정 설정 및 알람**
   - 급이 시간 설정 → 알람 수신 → 완료 처리

4. **기록 및 통계 조회**
   - 기록 추가 → 통계 조회 → 분석 확인

### 4. 성능 테스트 (Performance Tests)

#### 로드 테스트
- 동시 사용자 1,000명 시뮬레이션
- 피크 트래픽 처리 능력 측정
- 병목 지점 식별

#### 스트레스 테스트
- 데이터베이스 크기: 100만 레코드
- API 응답 시간 측정
- 메모리 누수 확인

### 5. 보안 테스트

#### 테스트 항목
- SQL Injection 취약점 검사
- XSS 취약점 검사
- CSRF 토큰 검증
- 인증/인가 검증
- API 레이트 리미팅

### 테스트 자동화
```yaml
# .github/workflows/test.yml
name: Test Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Upload Coverage
        run: npm run coverage
```

---

## 🚀 배포 전략

### CI/CD 파이프라인

```
코드 푸시 → 테스트 → 빌드 → 스테이징 배포 → 승인 → 프로덕션 배포
```

### 배포 절차

#### 1. 사전 배포 체크
- [ ] 모든 테스트 통과 (Unit, Integration, E2E)
- [ ] 코드 리뷰 2명 승인
- [ ] 보안 감사 완료
- [ ] 성능 벤치마크 통과
- [ ] 마이그레이션 스크립트 검증
- [ ] 롤백 계획 수립

#### 2. 스테이징 배포
- 프로덕션 환경과 동일한 설정
- 1시간 이상 모니터링
- 기본 스모크 테스트 실행

#### 3. 프로덕션 배포
- 카나리 배포 (5% 트래픽)
- 30분 모니터링
- 100% 배포

#### 4. 배포 후 검증
- 핵심 기능 확인
- 성능 메트릭 확인
- 에러율 확인
- 사용자 피드백 모니터링

### 롤백 계획
- 배포 후 1시간 이내 이상 감지 시 즉시 롤백
- 자동 롤백 트리거:
  - 에러율 > 5%
  - 응답 시간 > 2초 (p95)
  - 서버 크래시

### 배포 주기
- 월요일~금요일: 언제든 배포 가능
- 주말/휴일: 긴급 상황만 배포
- 정기 배포: 주 1회 (수요일 14:00 KST)

---

## 📞 문의사항
기술적 문제나 개선사항이 있으면 DevOps 팀에 문의하세요.

---

**문서 버전**: 2.0 (상세판)  
**마지막 업데이트**: 2026년 10월 10일  
**다음 검토**: 2026년 10월 24일
