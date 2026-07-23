import { NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    const stored = otpStore.get(email.toLowerCase());

    // Verify OTP if stored in memory
    if (stored) {
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return NextResponse.json(
          { success: false, message: "OTP has expired. Please request a new code." },
          { status: 400 }
        );
      }
      if (stored.otp !== otp.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid OTP code. Please check your email and try again." },
          { status: 400 }
        );
      }
      // OTP verified successfully
      otpStore.delete(email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
