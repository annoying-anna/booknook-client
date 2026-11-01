import { BookOpen } from "lucide-react";

export default function LoadingSpinner({ text = "Loading BookNook..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 px-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin flex items-center justify-center"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}
