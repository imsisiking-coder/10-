import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { authenticateToken, errorHandler } from './middleware/auth.js';
import { initializeEmailAlarmJob } from './jobs/emailAlarmJob.js';

// 모델 임포트
import User from './models/User.js';
import Aquarium from './models/Aquarium.js';
import Fish from './models/Fish.js';
import FishSpecies from './models/FishSpecies.js';
import Schedule from './models/Schedule.js';
import Notification from './models/Notification.js';
import EmailLog from './models/EmailLog.js';

// 라우트 임포트
import authRoutes from './routes/auth.js';
import aquariumRoutes from './routes/aquariums.js';
import scheduleRoutes from './routes/schedules.js';

dotenv.config();

const app = express();

// 미들웨어
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/aquariums', aquariumRoutes);
app.use('/api/v1/schedules', scheduleRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 에러 핸들러
app.use(errorHandler);

// 데이터베이스 동기화 및 서버 시작
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 데이터베이스 연결
    await sequelize.authenticate();
    console.log('✓ 데이터베이스 연결 성공');

    // 모델 동기화
    await sequelize.sync({ alter: false });
    console.log('✓ 모델 동기화 완료');

    // Cron Job 초기화
    initializeEmailAlarmJob();
    console.log('✓ 이메일 알람 Cron Job 시작됨');

    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
    });
  } catch (error) {
    console.error('서버 시작 오류:', error);
    process.exit(1);
  }
}

startServer();

export default app;
