"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, X } from "lucide-react";

type OrderDateTimeModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (preferredDateTime: string) => void;
};

function getMinimumDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
}

export function OrderDateTimeModal({
  isOpen,
  onCancel,
  onConfirm,
}: OrderDateTimeModalProps) {
  const minimumDateTime = useMemo(() => getMinimumDateTime(), []);
  const [dateTime, setDateTime] = useState(minimumDateTime);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70000] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Choose preferred order date and time"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Cancel order date selection"
        onClick={onCancel}
        className="absolute inset-0 bg-charcoal-900/65 backdrop-blur-md"
      />

      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900 p-6 shadow-2xl sm:p-7"
        initial={{ y: 24, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          aria-label="Close date and time modal"
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-gold-500"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-500/35 bg-green-500/10 text-green-500">
          <CalendarClock aria-hidden="true" className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-wider text-gold-500">
          Preferred delivery or pickup
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold leading-none text-white">
          Choose your date and time
        </h2>
        <p className="mt-4 text-sm font-medium leading-6 text-white/65">
          Pick when you would like your Abirikky order prepared. We will confirm
          availability on WhatsApp.
        </p>

        <label className="mt-7 block text-sm font-bold text-white/80">
          Date and time
          <input
            type="datetime-local"
            required
            min={minimumDateTime}
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
            className="mt-3 h-12 w-full rounded-md border border-white/15 bg-white/10 px-4 text-base font-semibold text-white outline-none transition-colors duration-200 [color-scheme:dark] focus:border-green-500"
          />
        </label>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-md border border-white/15 px-5 text-sm font-bold text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(dateTime)}
            disabled={!dateTime}
            className="h-12 rounded-md bg-green-500 px-5 text-sm font-bold text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to WhatsApp
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
