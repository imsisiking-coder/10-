import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailProvider = process.env.EMAIL_PROVIDER || 'sendgrid';

if (emailProvider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const gmailTransporter = process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  : null;

function getFromAddress() {
  return process.env.SMTP_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'noreply@fishcare.app';
}

async function sendEmail(msg) {
  const provider = process.env.EMAIL_PROVIDER || (process.env.SENDGRID_API_KEY ? 'sendgrid' : 'gmail');

  if (provider === 'gmail') {
    if (!gmailTransporter) {
      throw new Error('Gmail SMTP 설정이 없습니다. SMTP_USER와 SMTP_PASS를 확인하세요.');
    }

    const response = await gmailTransporter.sendMail({
      ...msg,
      from: msg.from || getFromAddress(),
    });

    console.log('✓ Gmail SMTP 이메일 발송 성공:', msg.to);
    return response;
  }

  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API 키가 없습니다. EMAIL_PROVIDER를 gmail로 설정하거나 SENDGRID_API_KEY를 추가하세요.');
  }

  const response = await sgMail.send(msg);
  console.log('✓ SendGrid 이메일 발송 성공:', msg.to);
  return response;
}

class EmailService {
  async sendScheduleReminder(data) {
    const { to, userName, aquariumName, fishNames, typeLabel, scheduleId } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { padding: 20px; }
          .task-info { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .task-info p { margin: 8px 0; }
          .button { display: inline-block; background-color: #2196F3; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🐠 ${typeLabel} 시간입니다!</h2>
          </div>
          
          <div class="content">
            <p>안녕하세요 ${userName}님,</p>
            <p>${aquariumName}의 물고기들을 돌볼 시간입니다!</p>
            
            <div class="task-info">
              <h3>📌 작업 정보</h3>
              <p><strong>어항:</strong> ${aquariumName}</p>
              <p><strong>물고기:</strong> ${fishNames || '미지정'}</p>
              <p><strong>작업:</strong> ${typeLabel}</p>
            </div>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:4173'}/schedule/${scheduleId}" class="button">
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

    const msg = {
      to,
      from: getFromAddress(),
      subject: `🐠 [시급] ${typeLabel} 시간입니다! - 피쉬 키우기`,
      html,
      replyTo: process.env.SMTP_REPLY_TO || 'support@fishcare.app',
    };

    try {
      const response = await sendEmail(msg);
      console.log('✓ 이메일 발송 성공:', to);
      return response;
    } catch (error) {
      console.error('✗ 이메일 발송 실패:', error);
      throw error;
    }
  }

  async sendTestEmail(to) {
    const msg = {
      to,
      from: getFromAddress(),
      subject: '🐠 테스트 이메일 - 피쉬 키우기',
      html: `
        <h2>테스트 이메일입니다</h2>
        <p>피쉬 키우기 이메일 알람 시스템이 정상 작동합니다!</p>
        <p>이 이메일을 받으셨다면 알림 설정이 올바르게 구성되었습니다.</p>
      `,
    };

    try {
      await sendEmail(msg);
      console.log('✓ 테스트 이메일 발송:', to);
      return true;
    } catch (error) {
      console.error('✗ 테스트 이메일 발송 실패:', error);
      throw error;
    }
  }
}

export default new EmailService();
