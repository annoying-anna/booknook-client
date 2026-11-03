"use client";

import { Award, BookOpen, Bookmark, Calendar, CheckCircle2, Download, Printer, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function DigitalLibraryCard({
  userName,
  userEmail,
  userImage,
  addedCount,
  borrowedCount,
}: {
  userName: string;
  userEmail: string;
  userImage?: string | null;
  addedCount: number;
  borrowedCount: number;
}) {
  const memberId = `BNK-${Math.abs(userEmail.split("").reduce((acc, char) => acc + char.charCodeAt(0), 1000)).toString().slice(0, 4)}-${userEmail.slice(0, 3).toUpperCase()}`;

  function handlePrint() {
    window.print();
    toast.success("Preparing digital card for print/PDF export.");
  }

  // Reading challenge progress
  const targetGoal = 12;
  const currentRead = Math.min(borrowedCount + 1, targetGoal);
  const progressPercent = Math.round((currentRead / targetGoal) * 100);

  return (
    <div className="space-y-8">
      {/* 3D Holographic Membership Card */}
      <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl">
        {/* Hologram / Foil sheen effect */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/20 to-blue-400/0 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-400/0 blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-black text-slate-950 shadow-lg">
              <BookOpen size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                BookNook Sanctuary Pass
              </p>
              <h3 className="text-sm font-semibold text-slate-300">
                Universal Community Library
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300">
            <Sparkles size={12} /> Master Bibliophile
          </span>
        </div>

        {/* Card Body: Member Info */}
        <div className="relative z-10 my-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-blue-900/60 shadow-xl text-3xl font-bold text-amber-300">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              userName[0]?.toUpperCase() || "B"
            )}
          </div>

          <div className="text-center sm:text-left flex-1 space-y-1">
            <h4 className="text-2xl font-black tracking-tight text-white">{userName}</h4>
            <p className="text-xs font-mono text-slate-400">{userEmail}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-slate-300">
              <span>Card ID: <strong className="font-mono text-amber-300">{memberId}</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-emerald-400">Good Standing</strong></span>
            </div>
          </div>
        </div>

        {/* Barcode Graphic */}
        <div className="relative z-10 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            {/* Visual Barcode Lines */}
            <div className="flex items-center gap-1 h-8 opacity-80">
              {[3, 1, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2, 4, 2, 1, 3, 5, 2, 1, 4, 2, 3, 1, 4, 2, 3, 1].map((w, i) => (
                <span
                  key={i}
                  className="h-full bg-white rounded-xs"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400">
              {memberId}-2026
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="btn btn-outline text-xs h-9 px-4 border-white/20 text-white hover:bg-white/10 hover:border-amber-400/60 transition-all"
          >
            <Printer size={14} /> Print / Save Pass
          </button>
        </div>
      </div>

      {/* Community Reading Challenge Tracker */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-ink flex items-center gap-2">
              <Award size={18} className="text-amber-500" /> 2026 Member Reading Challenge
            </h3>
            <p className="font-reading text-xs text-ink-soft">
              Track your goal of reading 12 literary masterworks this year.
            </p>
          </div>
          <span className="text-sm font-bold text-ink">
            {currentRead} of {targetGoal} Books Read ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full rounded-full bg-line overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Member Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          {[
            { title: "First Borrow", desc: "Completed 1st loan", active: borrowedCount > 0 },
            { title: "Library Patron", desc: "Added books to shelf", active: addedCount > 0 },
            { title: "Avid Explorer", desc: "Borrowed 3+ genres", active: borrowedCount >= 3 },
            { title: "Honor Member", desc: "Zero late returns", active: true },
          ].map((badge) => (
            <div
              key={badge.title}
              className={`rounded-2xl border p-3 text-center space-y-1 transition-all ${
                badge.active
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                  : "border-line bg-paper/40 text-ink-faint opacity-50"
              }`}
            >
              <CheckCircle2 size={16} className="mx-auto" />
              <p className="text-xs font-bold">{badge.title}</p>
              <p className="text-[10px]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
