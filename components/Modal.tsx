"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    box.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={box} tabIndex={-1} className="animate-pop relative w-full max-w-md rounded-t-2xl border border-line bg-surface p-6 shadow-2xl outline-none sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-paper"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
