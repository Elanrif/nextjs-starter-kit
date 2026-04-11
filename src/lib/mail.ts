import nodemailer from "nodemailer";
import { randomBytes, createHmac } from "node:crypto";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyTransporter(): Promise<void> {
  try {
    await transporter.verify();
    logger.info("Nodemailer transporter ready");
  } catch (error) {
    logger.error({ err: error }, "Nodemailer transporter error");
  }
}

export function generateResetToken(): { resetToken: string; code: string } {
  const secret = process.env.SMTP_RESET_TOKEN_SECRET;
  if (!secret) throw new Error("SMTP_RESET_TOKEN_SECRET is not set");
  const code = randomBytes(16).toString("hex");
  const resetToken = createHmac("sha256", secret).update(code).digest("hex");
  return { resetToken, code };
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  resetUrl: string,
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
              .message { background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600; }
              .warning { background: #fff3cd; color: #856404; padding: 12px; border-radius: 5px; margin-bottom: 20px; font-size: 14px; }
              .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
              .token { background: #e9ecef; padding: 10px; border-radius: 3px; word-break: break-all; font-family: monospace; font-size: 12px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <div class="message">
                  <p>Hi there,</p>
                  <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                  <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
                  <center>
                    <a href="${resetUrl}" class="button" style="color: white;">Reset Password</a>
                  </center>
                  <div class="warning">
                    ⚠️ <strong>Secure Link:</strong> Never share this email or link with anyone. We will never ask for your password via email.
                  </div>
                  <p>Or copy and paste this link in your browser:</p>
                  <div class="token">${resetUrl}</div>
                </div>
                <p style="font-size: 14px; color: #666;">
                  <strong>Didn't request this?</strong><br/>
                  If you didn't request a password reset, please contact support immediately.
                </p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME ?? "Your Company"}. All rights reserved.</p>
                <p>This is an automated message, please do not reply directly.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    logger.info({ to: email }, "Password reset email sent");
    return true;
  } catch (error) {
    logger.error({ email, err: error }, "Failed to send password reset email");
    return false;
  }
}

export async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: `Welcome to ${process.env.APP_NAME ?? "Our App"}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome ${firstName}! 🎉</h1>
              </div>
              <div class="content">
                <p>Great to have you on board!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    logger.info({ to: email }, "Welcome email sent");
    return true;
  } catch (error) {
    logger.error({ email, err: error }, "Failed to send welcome email");
    return false;
  }
}
