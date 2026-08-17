"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { WILAYAS } from "@/lib/wilayas";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", wilaya: "", city: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/customer/me"), fetch("/api/orders")]).then(async ([userRes, ordersRes]) => {
      if (!userRes.ok) { window.location.href = "/customer/login"; return; }
      const d = await userRes.json();
      setUser(d.user);
      setForm({ name: d.user.name || "", wilaya: d.user.wilaya || "", city: d.user.city || "", address: d.user.address || "" });
      if (ordersRes.ok) { const od = await ordersRes.json(); setOrders(od.orders || []); }
    }).catch(() => setError("Unable to load your account."));
  }, []);

  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));
  async function save(e) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try { const r = await fetch("/api/customer/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const d = await r.json(); if (!r.ok) { setError(d.error || "Unable to save."); return; } setUser(d.user); setMessage("Profile updated."); }
    catch { setError("Unable to connect to the server."); } finally { setBusy(false); }
  }
  async function requestPhoneCode() { setError(""); setMessage(""); const r = await fetch("/api/customer/phone/request", { method: "POST" }); const d = await r.json(); if (!r.ok) return setError(d.error || "Unable to send code."); setDevCode(d.devCode || ""); setMessage("Verification code sent."); }
  async function verifyPhone() { setError(""); const r = await fetch("/api/customer/phone/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }); const d = await r.json(); if (!r.ok) return setError(d.error || "Verification failed."); setUser((v) => ({ ...v, phoneVerified: true })); setMessage("Phone verified."); }
  async function logout() { await fetch("/api/customer/logout", { method: "POST" }); window.location.href = "/customer/login"; }

  if (!user) return <main className="min-h-screen flex items-center justify-center">Loading…</main>;
  return <main className="min-h-screen bg-[#f7f8f4] p-4"><div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-2xl font-black">My account</h1><p className="text-gray-500">{user.name} · {user.phone}</p></div><button onClick={logout} className="rounded-xl border px-4 py-2">Log out</button></div>
    {error && <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}{message && <div className="rounded-xl bg-green-50 text-green-700 p-3">{message}</div>}
    <form onSubmit={save} className="space-y-4"><h2 className="font-bold text-lg">Profile</h2><input required value={form.name} onChange={set("name")} placeholder="Your name" className="w-full rounded-xl border p-3" /><select required value={form.wilaya} onChange={set("wilaya")} className="w-full rounded-xl border p-3 bg-white"><option value="">Select wilaya</option>{WILAYAS.map((w) => <option key={w}>{w}</option>)}</select><input required value={form.city} onChange={set("city")} placeholder="City / Commune" className="w-full rounded-xl border p-3" /><textarea value={form.address} onChange={set("address")} placeholder="Address" className="w-full rounded-xl border p-3 min-h-24" /><button disabled={busy} className="w-full rounded-xl bg-black text-white p-3 font-bold">{busy ? "Saving…" : "Save profile"}</button></form>
    <section className="border-t pt-5 space-y-3"><h2 className="font-bold text-lg">My purchases</h2>{orders.length === 0 ? <p className="text-gray-500">You have no purchases yet.</p> : orders.map((order) => <div key={order.id} className="rounded-2xl border p-4"><div className="flex justify-between gap-3"><b>{order.id}</b><b>{String(order.total)} DA</b></div><p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString("fr-DZ")}</p><p className="text-sm mt-2">{order.items.map((item) => `${item.quantity} × ${item.name}`).join(" · ")}</p><p className="text-xs uppercase mt-2 text-gray-500">{order.status.replaceAll("_", " ")}</p></div>)}</section>
    <section className="border-t pt-5 space-y-3"><h2 className="font-bold">Phone verification</h2><p className="text-sm text-gray-500">Status: {user.phoneVerified ? "Verified" : "Not verified"}</p>{!user.phoneVerified && <><button onClick={requestPhoneCode} className="rounded-xl border px-4 py-2">Send verification code</button>{devCode && <p className="text-sm">Development code: <b>{devCode}</b></p>}<div className="flex gap-2"><input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="6-digit code" className="flex-1 rounded-xl border p-3" inputMode="numeric" /><button onClick={verifyPhone} className="rounded-xl bg-black text-white px-4">Verify</button></div></>}</section>
    <Link className="block text-sm underline" href="/">Back to store</Link>
  </div></main>;
}