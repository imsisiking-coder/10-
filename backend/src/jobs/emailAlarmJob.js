import cron from 'node-cron';
import { Op } from 'sequelize';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import Aquarium from '../models/Aquarium.js';
import Fish from '../models/Fish.js';
import FishSpecies from '../models/FishSpecies.js';
import EmailLog from '../models/EmailLog.js';
import Notification from '../models/Notification.js';
import emailService from '../services/emailService.js';

// 조용한 시간대 판정
function isInQuietHours(currentHour, startHour, endHour) {
  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    return currentHour >= startHour || currentHour < endHour;
  }
}

// 이메일 알람 Cron Job (매시간 정각)
export function initializeEmailAlarmJob() {
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron Job] 이메일 알람 체크 시작...');

    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      // 다음 1시간 내에 발동할 모든 일정 조회
      const schedules = await Schedule.findAll({
        where: {
          next_scheduled_at: {
            [Op.between]: [now, oneHourLater],
          },
          deleted_at: null,
        },
        include: [
          {
            model: Aquarium,
            where: { deleted_at: null },
            include: [
              {
                model: User,
                where: { deleted_at: null },
              },
            ],
          },
        ],
      });

      console.log(`조회된 일정: ${schedules.length}개`);

      for (const schedule of schedules) {
        try {
          const user = schedule.Aquarium.User;
          const aquarium = schedule.Aquarium;
          const prefs = JSON.parse(user.preferences || '{}');

          // 1. 이메일 알림 활성화 확인
          if (!prefs.emailNotificationEnabled) {
            console.log(`건너뜀: 사용자 ${user.id} - 이메일 알림 비활성화`);
            continue;
          }

          // 2. 조용한 시간대 확인
          const scheduledHour = new Date(schedule.next_scheduled_at).getHours();
          if (isInQuietHours(scheduledHour, prefs.quietStartHour || 22, prefs.quietEndHour || 8)) {
            console.log(`건너뜀: 스케줄 ${schedule.id} - 조용한 시간대`);
            continue;
          }

          // 3. 중복 발송 확인
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const lastLog = await EmailLog.findOne({
            where: {
              schedule_id: schedule.id,
              sent_at: {
                [Op.gte]: today,
              },
            },
            order: [['sent_at', 'DESC']],
          });

          if (lastLog) {
            console.log(`건너뜀: 스케줄 ${schedule.id} - 이미 오늘 발송됨`);
            continue;
          }

          // 4. 물고기 정보 조회
          const fish = await Fish.findAll({
            where: { aquarium_id: aquarium.id, deleted_at: null },
            include: [FishSpecies],
          });

          const fishNames = fish.map((f) => f.name || f.FishSpecies.common_name).join(', ');

          // 5. 이메일 발송
          const typeLabel = {
            feeding: '밥 주기',
            water_change: '물 교환',
            cleaning: '청소',
          }[schedule.type] || schedule.type;

          await emailService.sendScheduleReminder({
            to: user.email,
            userName: user.username,
            aquariumName: aquarium.name,
            fishNames,
            typeLabel,
            scheduleId: schedule.id,
          });

          // 6. 발송 기록 저장
          await EmailLog.create({
            schedule_id: schedule.id,
            user_id: user.id,
            email: user.email,
            sent_at: now,
            status: 'sent',
          });

          // 7. 인앱 알림 생성
          await Notification.create({
            user_id: user.id,
            schedule_id: schedule.id,
            type: 'schedule_reminder',
            message: `${typeLabel} 시간입니다!`,
          });

          console.log(`✓ 이메일 발송 완료: ${user.email} (스케줄 ${schedule.id})`);
        } catch (error) {
          console.error(`✗ 스케줄 ${schedule.id} 처리 중 오류:`, error);

          // 실패 기록
          await EmailLog.create({
            schedule_id: schedule.id,
            user_id: schedule.Aquarium.User.id,
            email: schedule.Aquarium.User.email,
            sent_at: now,
            status: 'failed',
            error_message: error.message,
          });
        }
      }

      console.log('[Cron Job] 이메일 알람 체크 완료');
    } catch (error) {
      console.error('[Cron Job] 치명적 오류:', error);
    }
  });
}
