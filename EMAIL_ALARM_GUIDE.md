# 🐠 피쉬 키우기 - 이메일 알람 시스템 가이드

**버전:** 1.0  
**수정일:** 2026년 10월 10일

---

## 📧 이메일 알람 시스템 개요

웹사이트 기반의 "피쉬 키우기"는 **이메일 알람**을 주요 알림 수단으로 사용합니다.

### 핵심 특징
- ✅ 모든 사용자가 이메일 받기 가능 (브라우저 제한 없음)
- ✅ 설정 시간에 정확한 이메일 전송
- ✅ 모바일/PC 모두 실시간 수신
- ✅ 조용한 시간대 설정 가능

---

## 🏗️ 시스템 아키텍처

```
사용자가 일정 설정
  ↓
급이: 오전 10시 / 물 교환: 토요일 18시 / 청소: 2주마다
  ↓
Cron Job (매시간 정각 체크)
  ↓
다음 1시간 내 발동할 일정 있는가?
  ↓
조건 확인:
  • 이메일 알림 활성화?
  • 조용한 시간대 제외?
  • 이미 발송됨?
  ↓
SendGrid API로 이메일 발송
  ↓
사용자 이메일 수신
  ↓
클릭해서 웹사이트에서 "완료 처리"
```

---

## 📧 이메일 종류 및 내용

### 1. 정시 알람 이메일 (주요)
**전송 시간**: 설정된 시간 정각

**예시 (밥 주기)**
```
제목: 🐠 [시급] 밥 주기 시간입니다! - 피쉬 키우기

안녕하세요 준호님,

메인 어항의 물고기들에게 밥을 줄 시간입니다! 🍽️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 작업 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
어항: 메인 어항
물고기: 금붕어 (2마리)
작업: 밥 주기
예정 시간: 오전 10시 00분
현재 시간: 오전 10시 00분

💡 팁: 한번에 한줌 정도의 양을 주면 됩니다!

[웹사이트에서 완료 처리하기]
https://fishcare.app/schedule/12345

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. 리마인드 이메일 (미완료 시)
**전송 시간**: 미완료 상태로 다음날 아침

```
제목: 🐠 [미완료] 어제 밥 주기를 아직 완료하지 않았습니다

안녕하세요 준호님,

어제 예정된 "밥 주기" 작업을 완료하지 않으셨습니다.
지금이라도 완료 처리해주시기 바랍니다.

[지금 완료 처리하기]
https://fishcare.app/schedule/12345
```

### 3. 일일 요약 이메일 (선택)
**전송 시간**: 매일 아침 8시 (사용자가 구독한 경우만)

```
제목: 🐠 오늘의 작업 요약 - 피쉬 키우기

안녕하세요 준호님,

2026-10-10의 작업 현황을 요약해드립니다! 📋

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ 09:00 - 밥 주기 (완료됨)
○ 14:00 - 물 교환 (미완료)
○ 18:00 - 청소 (미완료)

완료율: ▓▓░░░░░░░░ 33%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[상세 보기]
https://fishcare.app/dashboard
```

### 4. 긴급 알림 이메일
**전송 시간**: 즉시 (물고기 질병 등 비정상 감지)

```
제목: 🚨 긴급 - 어항 상태 이상 감지!

안녕하세요 준호님,

메인 어항에 수질 이상이 감지되었습니다!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 문제: pH 급상승
현재 수치: 8.5 (정상: 6.5-7.5)
권장사항: 물 교환 권장

[어항 상세 정보 보기]
https://fishcare.app/aquarium/123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚙️ 사용자 알람 설정

### 설정 페이지 UI
```
┌─────────────────────────────────────┐
│ 알림 설정                            │
├─────────────────────────────────────┤
│                                     │
│ 이메일 알림                         │
│ ☑️ 이메일 알림 활성화              │
│                                     │
│ 이메일 주소                         │
│ [user@gmail.com]                    │
│                                     │
│ 받을 이메일 종류                    │
│ ☑️ 정시 알람 (급이, 물교환, 청소)   │
│ ☑️ 리마인드 이메일 (미완료 작업)    │
│ □ 일일 요약 이메일                  │
│ ☑️ 긴급 알림                        │
│                                     │
│ 조용한 시간대 설정                  │
│ □ 활성화                            │
│   시작: [22:00 ▼]                   │
│   종료: [08:00 ▼]                   │
│                                     │
│ 참고: 긴급 알림은 조용한 시간대도   │
│ 제외되지 않습니다.                  │
│                                     │
│ 테스트                              │
│ [테스트 이메일 보내기]              │
│                                     │
│ [설정 저장]                         │
│                                     │
└─────────────────────────────────────┘
```

---

## 💻 백엔드 구현

### 1. Cron Job (매시간 실행)

```javascript
// server/jobs/emailAlarmJob.js
const cron = require('node-cron');
const db = require('../database');
const emailService = require('../services/emailService');

// 매시간 정각 (00분)에 실행
cron.schedule('0 * * * *', async () => {
  console.log('[Job] 이메일 알람 체크 시작...');
  
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    // 다음 1시간 내에 발동할 모든 일정 조회
    const schedules = await db.query(`
      SELECT 
        s.*,
        u.id as user_id,
        u.email,
        u.preferences,
        a.name as aquarium_name,
        GROUP_CONCAT(f.name) as fish_names
      FROM schedules s
      JOIN aquariums a ON s.aquarium_id = a.id
      JOIN users u ON a.user_id = u.id
      LEFT JOIN fish f ON a.id = f.aquarium_id
      WHERE 
        s.next_scheduled_at BETWEEN ? AND ?
        AND s.deleted_at IS NULL
        AND u.deleted_at IS NULL
      GROUP BY s.id
    `, [now, oneHourLater]);
    
    console.log(`조회된 일정: ${schedules.length}개`);
    
    for (const schedule of schedules) {
      // 1. 사용자 설정 확인
      const prefs = JSON.parse(schedule.preferences || '{}');
      
      if (!prefs.emailNotificationEnabled) {
        console.log(`건너뜀: 사용자 ${schedule.user_id} - 이메일 알림 비활성화`);
        continue;
      }
      
      // 2. 조용한 시간대 확인
      const scheduledHour = new Date(schedule.next_scheduled_at).getHours();
      if (isInQuietHours(scheduledHour, prefs.quietStartHour || 22, prefs.quietEndHour || 8)) {
        console.log(`건너뜀: 스케줄 ${schedule.id} - 조용한 시간대`);
        continue;
      }
      
      // 3. 중복 발송 확인
      const lastLog = await db.queryOne(`
        SELECT sent_at FROM email_logs 
        WHERE schedule_id = ? 
        AND DATE(sent_at) = CURDATE()
        ORDER BY sent_at DESC 
        LIMIT 1
      `, [schedule.id]);
      
      if (lastLog) {
        console.log(`건너뜀: 스케줄 ${schedule.id} - 이미 오늘 발송됨`);
        continue;
      }
      
      // 4. 이메일 발송
      try {
        const typeLabel = {
          'feeding': '밥 주기',
          'water_change': '물 교환',
          'cleaning': '청소'
        }[schedule.type] || schedule.type;
        
        const emailData = {
          to: schedule.email,
          subject: `🐠 [시급] ${typeLabel} 시간입니다! - 피쉬 키우기`,
          html: generateEmailHTML({
            userName: schedule.user_name,
            aquariumName: schedule.aquarium_name,
            fishNames: schedule.fish_names,
            typeLabel: typeLabel,
            scheduleId: schedule.id
          })
        };
        
        await emailService.send(emailData);
        
        // 5. 발송 기록 저장
        await db.query(`
          INSERT INTO email_logs 
          (schedule_id, user_id, sent_at, status, email)
          VALUES (?, ?, ?, 'sent', ?)
        `, [schedule.id, schedule.user_id, now, schedule.email]);
        
        // 6. 인앱 알림 생성 (보조)
        await db.query(`
          INSERT INTO notifications
          (user_id, schedule_id, type, message, created_at)
          VALUES (?, ?, 'schedule_reminder', ?, ?)
        `, [schedule.user_id, schedule.id, `${typeLabel} 시간입니다!`, now]);
        
        console.log(`✓ 이메일 발송 완료: ${schedule.email} (스케줄 ${schedule.id})`);
        
      } catch (error) {
        console.error(`✗ 이메일 발송 실패 (스케줄 ${schedule.id}):`, error);
        
        // 실패 기록
        await db.query(`
          INSERT INTO email_logs 
          (schedule_id, user_id, sent_at, status, error_message)
          VALUES (?, ?, ?, 'failed', ?)
        `, [schedule.id, schedule.user_id, now, error.message]);
      }
    }
    
    console.log('[Job] 이메일 알람 체크 완료');
    
  } catch (error) {
    console.error('[Job] 치명적 오류:', error);
  }
});

// 조용한 시간대 판정
function isInQuietHours(currentHour, startHour, endHour) {
  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // startHour > endHour (자정 넘김, 예: 22:00 ~ 08:00)
    return currentHour >= startHour || currentHour < endHour;
  }
}

// HTML 이메일 생성
function generateEmailHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #e3f2fd; padding: 20px; border-radius: 8px; }
        .content { padding: 20px; }
        .task-info { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .task-info p { margin: 8px 0; }
        .button { display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
        .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🐠 ${data.typeLabel} 시간입니다!</h2>
        </div>
        
        <div class="content">
          <p>안녕하세요 ${data.userName}님,</p>
          <p>${data.aquariumName}의 물고기들을 돌볼 시간입니다!</p>
          
          <div class="task-info">
            <h3>📌 작업 정보</h3>
            <p><strong>어항:</strong> ${data.aquariumName}</p>
            <p><strong>물고기:</strong> ${data.fishNames || '미지정'}</p>
            <p><strong>작업:</strong> ${data.typeLabel}</p>
          </div>
          
          <a href="https://fishcare.app/schedule/${data.scheduleId}" class="button">
            웹사이트에서 완료 처리하기
          </a>
        </div>
        
        <div class="footer">
          <p>이 이메일이 필요 없다면 설정에서 "이메일 알림"을 비활성화하세요.</p>
          <p>© 2026 피쉬 키우기</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = cron;
```

### 2. 이메일 서비스 (SendGrid)

```javascript
// server/services/emailService.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async send(mailData) {
    const msg = {
      to: mailData.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@fishcare.app',
      subject: mailData.subject,
      html: mailData.html,
      replyTo: 'support@fishcare.app'
    };
    
    try {
      const response = await sgMail.send(msg);
      console.log('이메일 발송 성공:', response[0].statusCode);
      return response;
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw error;
    }
  }
  
  // 테스트 이메일 발송
  async sendTest(userEmail) {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@fishcare.app',
      subject: '🐠 테스트 이메일 - 피쉬 키우기',
      html: `
        <h2>테스트 이메일입니다</h2>
        <p>피쉬 키우기 이메일 알람 시스템이 정상 작동합니다!</p>
        <p>이 이메일을 받으셨다면 알림 설정이 올바르게 구성되었습니다.</p>
      `
    };
    
    return this.send(msg);
  }
}

module.exports = new EmailService();
```

---

## 🗄️ 데이터베이스 테이블

### email_logs 테이블
```sql
CREATE TABLE email_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_id INT NOT NULL,
  user_id INT NOT NULL,
  email VARCHAR(255),
  sent_at TIMESTAMP,
  status ENUM('sent', 'failed', 'bounced') DEFAULT 'sent',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (schedule_id) REFERENCES schedules(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_schedule (schedule_id),
  INDEX idx_user (user_id),
  INDEX idx_sent_at (sent_at)
);
```

### user_preferences 업데이트
```sql
ALTER TABLE users ADD COLUMN preferences JSON;

-- 예시:
{
  "emailNotificationEnabled": true,
  "dailySummaryEnabled": false,
  "quietStartHour": 22,
  "quietEndHour": 8
}
```

---

## 📊 모니터링 및 분석

### 주요 메트릭
- **이메일 발송율**: 목표 99% 이상
- **배달 성공률**: 목표 95% 이상
- **오픈율**: 현황 추적
- **클릭율**: 웹사이트 방문 전환율

### 문제 해결
| 문제 | 원인 | 해결 |
|-----|------|-----|
| 이메일 미수신 | 스팸 필터 | Gmail/Outlook 설정 확인 |
| 지연 발송 | SendGrid 지연 | 로그 확인, 재시도 |
| 중복 발송 | DB 기록 실패 | 트랜잭션 검토 |

---

## 📞 지원
문제가 발생하면 support@fishcare.app으로 문의하세요.

---

**버전**: 1.0  
**최종 수정**: 2026년 10월 10일
