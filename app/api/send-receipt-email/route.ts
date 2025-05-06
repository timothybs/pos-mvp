import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, method, email } = body;

  if (!email || !amount || !method) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY!;
  const FROM_EMAIL = "receipts@yourdomain.com"; // Replace with a verified sender domain

  const message = `
    Thanks for your payment!

    Amount: £${amount.toFixed(2)}
    Method: ${method === "open-banking" ? "Open Banking" : "Tap to Pay"}

    If you have any questions, please contact our team.
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Receipt",
      text: message.trim()
    })
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("❌ Failed to send receipt via Resend:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}