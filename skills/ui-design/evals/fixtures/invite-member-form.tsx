"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function InviteMemberForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [members, setMembers] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
    setRole("member");
    const res = await fetch("/api/members", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
    const created = await res.json();
    setMembers([...members, created.email]);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <button className="float-right" onClick={onClose}>
        <X className="h-4 w-4" />
      </button>
      <h2 className="text-lg font-semibold">Invite a member</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full rounded border px-3 py-2"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
        />
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white"
          type="submit"
        >
          Send invite
        </button>
      </form>
      <ul>
        {members.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
