import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

const readBackendJson = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      message: "Newsletter server returned a non-JSON response.",
      preview: text.slice(0, 180).replace(/\s+/g, " ").trim(),
    };
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";

    const token = request.headers.get("authorization");

    const query = new URLSearchParams({ page, limit });
    if (status) query.set("status", status);

    const backendRes = await fetch(
      `${BACKEND_API_URL}/newsletter?${query.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        cache: "no-store",
      }
    );

    const data = await readBackendJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error("Failed to fetch newsletter subscribers:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const token = request.headers.get("authorization");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_API_URL}/newsletter/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await readBackendJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error("Failed to update subscriber:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required" },
        { status: 400 }
      );
    }

    // 1. Submit to backend
    const backendResponse = await fetch(`${BACKEND_API_URL}/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const data = await readBackendJson(backendResponse);
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // 2. Send welcome email to user
    const namePart = email.split("@")[0];
    const userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const companyName = "Crunchveda";
    const supportEmail = "info@crunchvedastore.com";
    const website = "https://crunchvedastore.com";
    const logoUrl = "https://crunchvedastore.com/assets/crunchvedaLogo.png";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #e3f7ea; color: #ffffff; padding: 24px; text-align: center;">
          <img src="${logoUrl}" alt="Crunchveda Logo" style="max-height: 50px; display: inline-block;" />
        </div>
        <div style="padding: 30px; background-color: #fbf9f6;">
          <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Hi ${userName},</p>
          <p style="font-size: 14px;">Welcome to <strong>${companyName}</strong>! 🎉</p>
          <p style="font-size: 14px;">Thank you for subscribing to our newsletter. We're excited to have you as part of our community.</p>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #ebdcb9; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #8F5E15; padding-bottom: 8px; font-size: 15px; border-bottom: 1px solid #ebdcb9;">By subscribing, you'll receive:</h3>
            <ul style="padding-left: 20px; font-size: 14px; color: #4A5568; margin-bottom: 0; line-height: 1.8;">
              <li>Exclusive product launches and early access</li>
              <li>Special discounts and member-only offers</li>
              <li>Latest news, updates, and announcements</li>
              <li>Styling tips, inspiration, and featured collections</li>
            </ul>
          </div>

          <p style="font-size: 14px;">We'll only send emails that provide value, and you can unsubscribe at any time using the link included in our emails.</p>
          <p style="font-size: 14px;">Thank you for joining us—we're looking forward to sharing exciting updates with you!</p>
          
          <p style="font-size: 14px; margin-top: 24px; margin-bottom: 0; border-top: 1px solid #ebdcb9; padding-top: 16px;">
            Best regards,<br/><br/>
            <strong>${companyName} Team</strong><br/>
            Website: <a href="${website}" style="color: #8F5E15; text-decoration: none; font-weight: bold;">${website}</a><br/>
            Email: ${supportEmail}
          </p>
        </div>
        <div style="background-color: #0B2013; color: #8c9f93; padding: 16px; text-align: center; font-size: 12px;">
          &copy; 2026 Crunchveda. All rights reserved.
        </div>
      </div>
    `;

    const textContent = `Hi ${userName},

Welcome to ${companyName}! 🎉

Thank you for subscribing to our newsletter. We're excited to have you as part of our community.

By subscribing, you'll receive:

* Exclusive product launches and early access
* Special discounts and member-only offers
* Latest news, updates, and announcements
* Styling tips, inspiration, and featured collections

We'll only send emails that provide value, and you can unsubscribe at any time using the link included in our emails.

Thank you for joining us—we're looking forward to sharing exciting updates with you!

Best regards,

${companyName} Team
Website: ${website}
Email: ${supportEmail}`;

    await sendEmail({
      to: email,
      subject: `Welcome to Crunchveda!`,
      html: htmlContent,
      text: textContent,
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully and welcome email sent",
      data,
    });
  } catch (error: any) {
    console.error("Failed to process newsletter subscription:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
