"use client";

type CartSummaryProps = {
  onOrderNow: () => void;
  totalQuantity: number;
};

export function CartSummary({ onOrderNow, totalQuantity }: CartSummaryProps) {
  return (
    <div className="border-t border-white/10 bg-charcoal-900 px-5 py-5 sm:px-7">
      <div className="mb-4 flex items-center justify-between text-sm font-bold text-white/70">
        <span>Total items</span>
        <span className="text-white">{totalQuantity}</span>
      </div>

      <button
        type="button"
        onClick={onOrderNow}
        disabled={totalQuantity === 0}
        className="h-btn-h-lg w-full rounded-md bg-green-500 px-6 text-base font-bold text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none"
      >
        Order Now
      </button>
    </div>
  );
}
