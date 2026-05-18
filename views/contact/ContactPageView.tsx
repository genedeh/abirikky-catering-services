"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { buildWhatsAppContactMessage } from "@/utils/whatsappOrder";

const serviceOptions = [
  "Event catering",
  "Corporate lunch",
  "Home delivery",
  "Wedding catering",
  "Private dining",
  "Custom menu planning",
];

const contactStats = [
  { label: "Event spreads", value: "Owambe" },
  { label: "Office meals", value: "Bowls" },
  { label: "Family plans", value: "Trays" },
];

const quickCards = [
  {
    icon: Phone,
    label: "Call or WhatsApp",
    value: "+234 802 833 5011",
  },
  {
    icon: CalendarDays,
    label: "Best for",
    value: "Events, office meals, family orders",
  },
  {
    icon: MessageCircle,
    label: "Response",
    value: "We confirm availability on WhatsApp",
  },
];

type ContactFormState = {
  email: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  message: string;
  name: string;
  phone: string;
  serviceInterest: string;
};

const initialFormState: ContactFormState = {
  email: "",
  eventDate: "",
  eventType: "",
  guestCount: "",
  message: "",
  name: "",
  phone: "",
  serviceInterest: serviceOptions[0],
};

export function ContactPageView() {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const whatsappPayload = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return buildWhatsAppContactMessage({
      ...formState,
      origin: window.location.origin,
    });
  }, [formState]);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setErrorMessage("");
    setHasCopied(false);
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.phone.trim() || !formState.message.trim()) {
      setErrorMessage("Please add your name, phone number, and message.");
      return;
    }

    const payload =
      whatsappPayload ??
      buildWhatsAppContactMessage({
        ...formState,
        origin: window.location.origin,
      });
    const whatsappWindow = window.open(payload.whatsappUrl, "_blank", "noopener,noreferrer");

    if (!whatsappWindow) {
      const whatsappLink = document.createElement("a");
      whatsappLink.href = payload.whatsappUrl;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.style.display = "none";
      document.body.appendChild(whatsappLink);
      whatsappLink.click();
      whatsappLink.remove();
    }
  };

  const handleCopyMessage = async () => {
    const payload =
      whatsappPayload ??
      buildWhatsAppContactMessage({
        ...formState,
        origin: window.location.origin,
      });

    try {
      await navigator.clipboard.writeText(payload.message);
      setHasCopied(true);
    } catch {
      setErrorMessage("We could not copy the message. Please try WhatsApp directly.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-nav-h">
      <section className="relative isolate min-h-[calc(100vh-var(--nav-h))] overflow-hidden">
        <Image
          src="/hero/heroImage2.png"
          alt="Abirikky catering spread"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/88 to-charcoal-900/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-charcoal-900 to-transparent" />

        <div className="relative z-raised mx-auto grid min-h-[calc(100vh-var(--nav-h))] w-full max-w-container items-center gap-12 px-container-x py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.72fr)]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
              Contact Abirikky
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
              Let&apos;s plan the food around your moment
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/72 sm:text-lg">
              Tell us what you&apos;re hosting, when you need it, and how many
              people you&apos;re feeding. We&apos;ll prepare a clear WhatsApp
              message so the team can confirm availability quickly.
            </p>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {contactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-white/45">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ContactForm
            errorMessage={errorMessage}
            formState={formState}
            hasCopied={hasCopied}
            onCopyMessage={handleCopyMessage}
            onFieldChange={updateField}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <section className="relative mx-auto grid w-full max-w-container gap-8 px-container-x pb-24 pt-8 lg:grid-cols-[0.85fr_1fr] lg:pb-32">
        <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-2xl">
          <Image
            src="/section/sectionImage2.png"
            alt="Prepared Abirikky catering dish"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/75 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-wider text-green-500">
            What happens next
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Your message arrives structured, so planning starts cleanly
          </h2>
          <div className="mt-8 grid gap-4">
            {quickCards.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-black uppercase tracking-wider text-white/45">
                    {label}
                  </span>
                  <span className="mt-1 block text-base font-bold text-white">
                    {value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactForm({
  errorMessage,
  formState,
  hasCopied,
  onCopyMessage,
  onFieldChange,
  onSubmit,
}: {
  errorMessage: string;
  formState: ContactFormState;
  hasCopied: boolean;
  onCopyMessage: () => void;
  onFieldChange: (field: keyof ContactFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-white/10 bg-charcoal-900/85 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          required
          value={formState.name}
          onChange={(value) => onFieldChange("name", value)}
        />
        <TextField
          label="Phone"
          required
          value={formState.phone}
          onChange={(value) => onFieldChange("phone", value)}
        />
        <TextField
          label="Email"
          type="email"
          value={formState.email}
          onChange={(value) => onFieldChange("email", value)}
        />
        <TextField
          label="Guest count"
          value={formState.guestCount}
          onChange={(value) => onFieldChange("guestCount", value)}
        />
        <TextField
          label="Event type"
          value={formState.eventType}
          onChange={(value) => onFieldChange("eventType", value)}
        />
        <TextField
          label="Preferred date"
          type="date"
          value={formState.eventDate}
          onChange={(value) => onFieldChange("eventDate", value)}
        />
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase tracking-wider text-white/55">
          Service interest
        </span>
        <select
          value={formState.serviceInterest}
          onChange={(event) => onFieldChange("serviceInterest", event.target.value)}
          className="mt-2 h-12 w-full rounded-md border border-white/15 bg-white/[0.06] px-4 text-sm font-bold text-white outline-none transition-colors duration-200 focus:border-green-500"
        >
          {serviceOptions.map((option) => (
            <option key={option} value={option} className="bg-charcoal-900 text-white">
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase tracking-wider text-white/55">
          Message
        </span>
        <textarea
          required
          value={formState.message}
          onChange={(event) => onFieldChange("message", event.target.value)}
          placeholder="Tell us about the menu, delivery location, service style, or timing."
          className="mt-2 min-h-32 w-full resize-y rounded-md border border-white/15 bg-white/[0.06] px-4 py-4 text-sm font-medium leading-6 text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-green-500"
        />
      </label>

      {errorMessage ? (
        <p className="mt-4 rounded-md border border-state-error/35 bg-state-error/10 px-4 py-3 text-sm font-bold text-red-100">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          className="inline-flex min-h-16 min-w-52 items-center justify-center gap-2 rounded-md bg-green-500 px-8 py-4 text-sm font-black text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600"
        >
          Send on WhatsApp
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onCopyMessage}
          className="inline-flex min-h-16 min-w-52 items-center justify-center rounded-md border border-gold-500 px-8 py-4 text-sm font-black text-gold-500 transition-colors duration-200 hover:bg-gold-500 hover:text-white"
        >
          {hasCopied ? "Copied" : "Copy message"}
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  const inputId = `contact-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label htmlFor={inputId} className="block">
      <span className="text-xs font-black uppercase tracking-wider text-white/55">
        {label}
      </span>
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-md border border-white/15 bg-white/[0.06] px-4 text-sm font-bold text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-green-500"
      />
    </label>
  );
}
