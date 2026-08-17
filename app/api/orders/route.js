import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";

export async function POST(request) {
  try {
    const customer = await getCustomer();
    if (!customer) return NextResponse.json({ error: "You must be logged in to place an order." }, { status: 401 });

    const body = await request.json();
    if (!Array.isArray(body?.items) || !body.items.length) return NextResponse.json({ error: "Items are required." }, { status: 400 });

    const items = body.items.map((item) => ({
      productId: typeof item.id === "string" ? item.id : null,
      name: String(item.name || "").trim(),
      unit: item.unit ? String(item.unit) : null,
      price: Number(item.price),
      quantity: Number(item.qty),
    }));
    if (items.some((item) => !item.name || !Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000)) {
      return NextResponse.json({ error: "Invalid order items." }, { status: 400 });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const note = body.note ? String(body.note).slice(0, 1000) : null;
    const requestedId = typeof body.id === "string" && /^CMD-[A-Za-z0-9_-]+$/.test(body.id) ? body.id : undefined;

    const order = await db.customerOrder.create({
      data: {
        ...(requestedId ? { id: requestedId } : {}),
        customerId: customer.id,
        total,
        note,
        wilaya: customer.wilaya,
        city: customer.city,
        address: customer.address,
        items: { create: items },
      },
      include: { items: true },
    });
    return NextResponse.json({ ok: true, order }, { status: 201 });
  } catch (error) {
    console.error("customer order", error);
    return NextResponse.json({ error: "Unable to save order." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const customer = await getCustomer();
    if (!customer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orders = await db.customerOrder.findMany({ where: { customerId: customer.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("customer orders", error);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}