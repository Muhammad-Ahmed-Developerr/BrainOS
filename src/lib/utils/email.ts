import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getOtpEmailHtml(code: string, type: "signup" | "forgot-password"): string {
  const isSignup = type === "signup";
  const title = isSignup ? "Verify Your Email" : "Reset Your Password";
  const subtitle = isSignup
    ? "Welcome to BrainOS! Enter the code below to verify your email address."
    : "Enter the code below to reset your BrainOS password.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} – BrainOS</title>
</head>
<body style="margin:0;padding:0;background:#0B1020;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1020;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#111728;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6d28d9,#0891b2);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                Brain<span style="color:#67e8f9;">OS</span>
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;">
                Neural Wellness Platform
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#e2e8f0;font-size:20px;font-weight:600;">${title}</h2>
              <p style="margin:0 0 32px;color:#94a3b8;font-size:14px;line-height:1.6;">${subtitle}</p>
              <!-- OTP Code Box -->
              <div style="background:#0B1020;border:1px solid rgba(109,40,217,0.3);border-radius:12px;padding:28px;text-align:center;margin:0 0 32px;">
                <p style="margin:0 0 8px;color:#64748b;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:monospace;">Verification Code</p>
                <p style="margin:0;color:#a78bfa;font-size:40px;font-weight:700;letter-spacing:12px;font-family:monospace;">${code}</p>
                <p style="margin:12px 0 0;color:#64748b;font-size:11px;font-family:monospace;">Expires in 10 minutes</p>
              </div>
              <p style="margin:0;color:#475569;font-size:12px;line-height:1.7;">
                If you didn't request this, you can safely ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0;color:#334155;font-size:11px;font-family:monospace;">
                © ${new Date().getFullYear()} BrainOS · AI-Powered Mental Health OS
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationCode(
  email: string,
  code: string,
  type: "signup" | "forgot-password"
): Promise<void> {
  const subject =
    type === "signup"
      ? `BrainOS – Your verification code: ${code}`
      : `BrainOS – Password reset code: ${code}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Brain OS Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html: getOtpEmailHtml(code, type),
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
