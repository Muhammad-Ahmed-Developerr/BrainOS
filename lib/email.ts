import nodemailer from 'nodemailer';

export interface SendEmailResult {
  success: boolean;
  sentViaSmtp: boolean;
  devCode?: string;
  error?: string;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
  subject: string,
  title: string,
  description: string
): Promise<SendEmailResult> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const htmlContent = `
    <div style="background-color: #020203; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #0a0a0c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <div style="display: inline-block; width: 48px; h-line: 48px; background: linear-gradient(135deg, #22d3ee, #9333ea); border-radius: 12px; padding: 2px; margin-bottom: 20px;">
          <div style="background: #020203; border-radius: 10px; padding: 10px; font-weight: bold; color: #22d3ee; font-size: 20px;">⚡</div>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; margin-bottom: 8px;">
          Brain<span style="color: #22d3ee;">OS</span> Security Enclave
        </h1>
        <h2 style="font-size: 16px; color: #a1a1aa; font-weight: 500; margin-bottom: 24px;">${title}</h2>
        <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin-bottom: 28px;">${description}</p>
        <div style="background: rgba(34,211,238,0.08); border: 1px dashed rgba(34,211,238,0.4); border-radius: 14px; padding: 20px; margin-bottom: 28px;">
          <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #22d3ee; margin-bottom: 8px;">Your Verification Code</span>
          <span style="font-family: monospace, Courier; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${code}</span>
        </div>
        <p style="font-size: 12px; color: #71717a; margin-top: 20px;">This security code expires in 10 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    </div>
  `;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"BrainOS Enclave" <${user}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });

      return { success: true, sentViaSmtp: true, devCode: code };
    } catch (err: any) {
      console.warn('SMTP sending error, providing code fallback:', err?.message);
      return { success: true, sentViaSmtp: false, devCode: code, error: err?.message };
    }
  }

  // Fallback when SMTP is not configured
  console.log(`[BrainOS Email Service] Code generated for ${toEmail}: ${code}`);
  return { success: true, sentViaSmtp: false, devCode: code };
}
