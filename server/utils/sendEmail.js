const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, otp }) => {
  const user = process.env.EMAIL_USER || "sheikmusthak006@gmail.com";
  const pass = process.env.EMAIL_PASS;

  // Development Fallback if password/credentials are not configured in .env
  if (!pass) {
    console.log("--------------------------------------------------");
    console.log("✉️  [OTP DEV FALLBACK MODE]");
    console.log(`From: ${user}`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`OTP Code: ${otp}`);
    console.log("--------------------------------------------------");
    return { success: true, devMode: true };
  }

  let transporter;

  if (process.env.EMAIL_SERVICE) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: user,
        pass: pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0b0b0b;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
        }
        .container {
          max-width: 520px;
          margin: 40px auto;
          background: #141414;
          border: 1px solid #282828;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .header {
          background: linear-gradient(135deg, #1f0404 0%, #000000 100%);
          padding: 32px 24px;
          text-align: center;
          border-bottom: 2px solid #E50914;
        }
        .brand {
          font-size: 36px;
          font-weight: 900;
          color: #E50914;
          letter-spacing: 4px;
          margin: 0;
          text-transform: uppercase;
        }
        .subtitle {
          color: #a0a0a0;
          font-size: 14px;
          margin-top: 6px;
        }
        .content {
          padding: 32px 24px;
          text-align: center;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #ffffff;
        }
        .message {
          font-size: 14px;
          color: #b0b0b0;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .otp-box {
          background: #1f1f1f;
          border: 1px dashed #E50914;
          border-radius: 8px;
          padding: 20px;
          margin: 0 auto 28px;
          display: inline-block;
        }
        .otp-code {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 10px;
          color: #E50914;
          font-family: monospace;
          margin: 0;
        }
        .timer-warning {
          font-size: 13px;
          color: #ff9800;
          background: rgba(255, 152, 0, 0.1);
          padding: 10px 16px;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 20px;
        }
        .footer {
          background: #0a0a0a;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666666;
          border-top: 1px solid #1f1f1f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand">KGF STORE</h1>
          <div class="subtitle">Email Verification</div>
        </div>
        <div class="content">
          <div class="greeting">Verify Your Email Address</div>
          <div class="message">
            Thank you for registering with <strong>KGF Store</strong>. Please use the One-Time Password (OTP) below to complete your account verification.
          </div>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <div>
            <span class="timer-warning">⏱️ This code expires in <strong>10 minutes</strong>.</span>
          </div>
          <div class="message" style="font-size: 12px; margin-bottom: 0;">
            If you did not request this verification code, please ignore this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} KGF Store. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"KGF Store" <${user}>`,
    to,
    subject: subject || "Verify your KGF Account — OTP",
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
