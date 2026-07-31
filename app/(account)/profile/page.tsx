"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { CAMPUSES, FACULTIES, LEVELS } from "@/lib/auth/config";
import AuthGuard from "@/components/auth/AuthGuard";
import toast from "react-hot-toast";
import { Pencil, ShieldCheck, Calendar, MapPin } from "lucide-react";

function ProfileContent() {
  const { currentUser, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: currentUser?.firstName ?? "",
    lastName: currentUser?.lastName ?? "",
    campus: currentUser?.campus ?? "",
    faculty: currentUser?.faculty ?? "",
    department: currentUser?.department ?? "",
    level: currentUser?.level ?? "",
  });

  if (!currentUser) return null;

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated");
  };

  const joinedDate = new Date(currentUser.joinedAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Profile</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Your account</h1>
        </div>

        <Card className="space-y-6 p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/20 text-2xl font-bold text-sky-300">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white">{currentUser.firstName} {currentUser.lastName}</h2>
                {currentUser.verifiedStudent && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-400">{currentUser.email}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> Joined {joinedDate}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {currentUser.campus}</span>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Campus</label>
                <select value={form.campus} onChange={(e) => setForm({ ...form, campus: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
                  <option value="">Select campus</option>
                  {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Faculty</label>
                  <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
                    <option value="">Select faculty</option>
                    {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
                    <option value="">Select level</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Department</label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave}>Save changes</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Campus" value={currentUser.campus} />
                <InfoRow label="Faculty" value={currentUser.faculty} />
                <InfoRow label="Department" value={currentUser.department} />
                <InfoRow label="Level" value={currentUser.level} />
              </div>
              <Button variant="secondary" onClick={() => setEditing(true)} className="inline-flex items-center gap-2">
                <Pencil size={14} /> Edit profile
              </Button>
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-8">
          <h3 className="text-lg font-semibold text-white">Security</h3>
          <div className="space-y-3">
            <Button variant="secondary" disabled>Change password (coming soon)</Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-sm text-slate-200">{value || "—"}</p>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
