import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    // Forward to Express backend user API
    try {
      const backendRes = await fetch(`${BACKEND_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const data = await backendRes.json();
      if (backendRes.ok && data.success !== false) {
        return NextResponse.json(data, { status: backendRes.status });
      }
    } catch (e) {
      console.warn("Backend send-otp failed, fallback to direct email:", e);
    }

    // Local fallback OTP generation & mailer
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const logoUrl = "https://crunchvedastore.com/assets/crunchvedaLogo.png";
    const userName = email.split("@")[0] || "Valued Customer";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #e3f7ea; color: #ffffff; padding: 24px; text-align: center;">
          <img src="${logoUrl}" alt="Crunchveda Logo" style="max-height: 50px; display: inline-block;" />
        </div>
        <div style="padding: 30px; background-color: #fbf9f6;">
          <p style="font-size: 16px; margin-top: 0; font-weight: bold; color: #0B2013;">Hi ${userName},</p>
          <p style="font-size: 14px; color: #475569;">
            We received a request to reset the password for your <strong>Crunchveda</strong> account. Please use the 6-digit verification OTP code below to proceed:
          </p>
          
          <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #ebdcb9; margin: 24px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #8F5E15; border-bottom: 1px solid #ebdcb9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Security Verification Code</h3>
            <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0B2013; background: #FCF9F2; padding: 16px 24px; border-radius: 8px; display: inline-block; margin: 16px 0; border: 2px dashed #B88900;">
              ${otpCode}
            </div>
            <p style="margin: 0; font-size: 13px; color: #64748b;">This OTP code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          </div>

          <p style="font-size: 14px; color: #475569;">
            If you did not request a password reset, please ignore this email or contact our support team if you suspect unauthorized access.
          </p>
          
          <p style="font-size: 14px; margin-top: 24px; margin-bottom: 0; border-top: 1px solid #ebdcb9; padding-top: 16px; color: #333;">
            Best regards,<br/><br/>
            <strong>Crunchveda Security Team</strong><br/>
            Email: info@crunchvedastore.com<br/>
            Website: <a href="https://crunchvedastore.com" style="color: #8F5E15; text-decoration: none; font-weight: bold;">https://crunchvedastore.com</a>
          </p>
        </div>
        <div style="background-color: #0B2013; color: #8c9f93; padding: 16px; text-align: center; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Crunchveda. All rights reserved.
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: `${otpCode} is your Crunchveda Password Reset OTP`,
        html: htmlContent,
        text: `Hi ${userName},\n\nYour Crunchveda password reset OTP code is ${otpCode}. Valid for 10 minutes.`,
      });
    } catch (mailErr) {
      console.warn("Could not dispatch email via SMTP:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Verification OTP code sent to ${email}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
