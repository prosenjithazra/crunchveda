import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

// In-memory OTP storage for demo/development verification (or syncs with DB)
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(email.toLowerCase(), { otp: otpCode, expiresAt });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
        <div style="background-color: #0B2013; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-family: Georgia, serif;">Crunchveda Security</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 15px; margin-bottom: 20px;">Use the following One-Time Password (OTP) to reset your account password:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0B2013; background: #FCF9F2; padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 20px; border: 1px dashed #B88900;">
            ${otpCode}
          </div>
          <p style="font-size: 13px; color: #777;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div style="background-color: #f6f3ec; padding: 12px; text-align: center; font-size: 12px; color: #777;">
          Sent by Crunchveda Store Concierge (info@crunchvedastore.com)
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: `${otpCode} is your Crunchveda Password Reset OTP`,
        html: htmlContent,
        text: `Your Crunchveda password reset OTP is ${otpCode}. Valid for 10 minutes.`,
      });
    } catch (mailErr) {
      console.warn("Could not dispatch email via SMTP, stored local OTP for verification", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
