"use client";
import { useState } from "react";
import Link from "next/link";
import { WILAYAS } from "@/lib/wilayas";

export default function CustomerRegister() {
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirmPassword: "", wilaya: "", city: "", address: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((v) => ({ ...v, [key]: e.target.value }));
  async function submit(e) {
    e.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const r = await fetch("/api/customer/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Registration failed."); return; }
      window.location.href = "/customer/profile";
    } catch { setError("Unable to connect to the server."); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#f7f8f4] p-4 flex items-center justify-center">
    <form onSubmit={submit} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
      <div><h1 className="text-2xl font-black">Create customer account</h1><p className="text-gray-500 mt-1">Use your Algerian phone number to create your account.</p></div>
      {error && <div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}
      <input value={form.name} onChange={set("name")} placeholder="Your name (optional)" className="w-full rounded-xl border p-3" />
      <input required value={form.phone} onChange={set("phone")} placeholder="Phone number (05/06/07...)" className="w-full rounded-xl border p-3" inputMode="tel" />
      <input required minLength={8} type="password" value={form.password} onChange={set("password")} placeholder="Password (8+ characters)" className="w-full rounded-xl border p-3" />
      <input required minLength={8} type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Confirm password" className="w-full rounded-xl border p-3" />
      <select required value={form.wilaya} onChange={set("wilaya")} className="w-full rounded-xl border p-3 bg-white"><option value="">Select wilaya</option>{WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}</select>
      <input required value={form.city} onChange={set("city")} placeholder="City / Commune" className="w-full rounded-xl border p-3" />
      <textarea value={form.address} onChange={set("address")} placeholder="Address (optional)" className="w-full rounded-xl border p-3 min-h-24" />
      <button disabled={busy} className="w-full rounded-xl bg-black text-white p-3 font-bold">{busy ? "Creating…" : "Create account"}</button>
      <p className="text-sm text-center">Already have an account? <Link className="underline font-bold" href="/customer/login">Log in</Link></p>
    </form>
  </main>;
}