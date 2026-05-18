import { RefreshCw } from "lucide-react";

type ErrorStateCardProps = {
  title?: string;
  description: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function ErrorStateCard({
  title = "Something went wrong",
  description,
  isRefreshing = false,
  onRefresh,
}: ErrorStateCardProps) {
  return (
    <div className="relative z-raised mx-auto mt-16 max-w-xl rounded-xl border border-state-error/30 bg-state-error/10 p-8 text-center">
      <p className="font-display text-3xl font-bold text-white">{title}</p>
      <p className="mt-3 text-base font-medium leading-7 text-white/65">
        {description}
      </p>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-gold-600 disabled:cursor-wait disabled:opacity-60"
      >
        <RefreshCw
          aria-hidden="true"
          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        Refresh
      </button>
    </div>
  );
}
