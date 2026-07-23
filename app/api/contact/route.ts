import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  process.env.BACKEND_API_URL ||
  "https://crunch-veda-backend.onrender.com/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";

    const token = request.headers.get("authorization");

    const query = new URLSearchParams({ page, limit });
    if (status) query.set("status", status);
    if (type) query.set("type", type);

    const backendRes = await fetch(
      `${BACKEND_API_URL}/contact?${query.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        cache: "no-store",
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error("Failed to fetch contact queries:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch contact queries" },
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
        { success: false, message: "Query ID is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_API_URL}/contact/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error("Failed to update contact query:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update query" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, enquiryType, message } = body;
    let databaseSaved = false;
    let dbErrorMsg = "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    // Forward to Express backend to store in MongoDB
    try {
      const backendRes = await fetch(`${BACKEND_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          enquiryType: enquiryType || "General Concierge",
          message,
        }),
      });

      const dbData = await backendRes.json();
      if (backendRes.ok && (dbData.success || dbData.status === "success")) {
        databaseSaved = true;
      } else {
        dbErrorMsg = dbData.message || "Failed to save to database";
      }
    } catch (dbError: any) {
      console.error("Failed to save contact query to database:", dbError);
      dbErrorMsg = dbError.message || "Database connection error";
    }

    // If database save failed, return 500 error
    if (!databaseSaved) {
      return NextResponse.json(
        { success: false, message: `Failed to save enquiry: ${dbErrorMsg}` },
        { status: 500 }
      );
    }

    // 2. Send email notifications (in a try-catch so SMTP errors don't block success)
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0B2013; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-family: Georgia, serif;">Crunchveda Store Inquiry</h2>
          </div>
          <div style="padding: 24px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Nature of Enquiry:</strong> ${enquiryType || "General Concierge"}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 12px; text-align: center; font-size: 12px; color: #777;">
            Sent via Crunchveda Website Contact Form (info@crunchvedastore.com)
          </div>
        </div>
      `;

      const textContent = `
New Inquiry from Crunchveda Website:
Name: ${name}
Email: ${email}
Enquiry Type: ${enquiryType || "General Concierge"}

Message:
${message}
      `;

      // Send query to support inbox
      await sendEmail({
        subject: `New ${enquiryType || "Contact"} Enquiry from ${name}`,
        html: htmlContent,
        text: textContent,
        replyTo: email,
      });

      // Send confirmation to user email
      const logoUrl = "https://crunchvedastore.com/assets/crunchvedaLogo.png";

      const userHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #e3f7ea; color: #ffffff; padding: 24px; text-align: center;">
            <img src="${logoUrl}" alt="Crunchveda Logo" style="max-height: 50px; display: inline-block;" />
          </div>
          <div style="padding: 30px; background-color: #fbf9f6;">
            <p style="font-size: 16px; margin-top: 0; font-weight: bold;">Hi ${name},</p>
            <p style="font-size: 14px;">Thank you for contacting <strong>Crunchveda</strong>.</p>
            <p style="font-size: 14px;">We have successfully received your message and appreciate you taking the time to reach out. Our team is currently reviewing your inquiry and will get back to you as soon as possible, typically within 24–48 business hours.</p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #ebdcb9; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #8F5E15; border-bottom: 1px solid #ebdcb9; padding-bottom: 8px; font-size: 15px;">Your submitted details:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 100px;">Name:</td>
                  <td style="padding: 6px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 6px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 6px 0;">${enquiryType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 6px 0; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px;">If your request is urgent, please feel free to reply to this email.</p>
            <p style="font-size: 14px;">Thank you for your patience and for choosing <strong>Crunchveda</strong>. We look forward to assisting you.</p>
            
            <p style="font-size: 14px; margin-top: 24px; margin-bottom: 0; border-top: 1px solid #ebdcb9; padding-top: 16px;">
              Best regards,<br/><br/>
              <strong>Crunchveda Team</strong><br/>
              Email: info@crunchvedastore.com<br/>
              Website: <a href="https://crunchvedastore.com" style="color: #8F5E15; text-decoration: none; font-weight: bold;">https://crunchveda.com</a>
            </p>
          </div>
          <div style="background-color: #0B2013; color: #8c9f93; padding: 16px; text-align: center; font-size: 12px;">
            &copy; 2026 Crunchveda. All rights reserved.
          </div>
        </div>
      `;

      const userText = `Hi ${name},

Thank you for contacting Crunchveda.

We have successfully received your message and appreciate you taking the time to reach out. Our team is currently reviewing your inquiry and will get back to you as soon as possible, typically within 24–48 business hours.

Your submitted details:

Name: ${name}
Email: ${email}
Subject: ${enquiryType}
Message: ${message}

If your request is urgent, please feel free to reply to this email.

Thank you for your patience and for choosing Crunchveda. We look forward to assisting you.

Best regards,

Crunchveda Team
Email: info@crunchvedastore.com
Website: https://crunchvedastore.com`;

      await sendEmail({
        to: email,
        subject: `Thank you for contacting Crunchveda`,
        html: userHtml,
        text: userText,
      });
    } catch (emailError) {
      console.error("Failed to send contact emails via nodemailer:", emailError);
      // We don't crash here since the enquiry has been successfully saved to the database.
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted and email sent successfully",
    });
  } catch (error: any) {
    console.error("Failed to process contact inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit inquiry",
      },
      { status: 500 }
    );
  }
}
