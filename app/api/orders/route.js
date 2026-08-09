import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  if (!body?.shopId || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ error: "shopId and items are required" }, { status: 400 });
  }
  return NextResponse.json({
    order: {
      id: "CMD-" + Date.now().toString().slice(-7),
      ...body,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: Date.now()
    }
  }, { status: 201 });
}