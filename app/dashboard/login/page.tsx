"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    if (!response.ok) { setError("Invalid credentials."); return; }
    router.push("/dashboard");
  }
  return <main style={{ maxWidth: 420, margin: "10vh auto", padding: 24 }}><h1>Client dashboard</h1><p>Sign in to review website enquiries.</p><form onSubmit={submit} style={{ display: "grid", gap: 12 }}><input name="email" type="email" required placeholder="Admin email" /><input name="password" type="password" required placeholder="Password" /><button type="submit">Sign in</button>{error && <p role="alert">{error}</p>}</form></main>;
}
