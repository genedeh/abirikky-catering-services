"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";

type BlogShareModalProps = {
  excerpt: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

type ShareOption = {
  label: string;
  description: string;
  href: string;
  Icon: () => React.ReactNode;
};

export function BlogShareModal({
  excerpt,
  isOpen,
  title,
  onClose,
}: BlogShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      setShareUrl(window.location.href);
      setHasCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const shareOptions = useMemo<ShareOption[]>(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const whatsappText = encodeURIComponent(`${title}\n\n${excerpt}\n\n${shareUrl}`);

    return [
      {
        label: "WhatsApp",
        description: "Send to a chat",
        href: `https://wa.me/?text=${whatsappText}`,
        Icon: WhatsAppIcon,
      },
      {
        label: "Facebook",
        description: "Share to feed",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        Icon: FacebookIcon,
      },
      {
        label: "X",
        description: "Post a tweet",
        href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        Icon: XIcon,
      },
    ];
  }, [excerpt, shareUrl, title]);

  const handleCopy = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopied(true);
    } catch {
      setHasCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[52000] flex items-center justify-center px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Share blog post"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close share modal"
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-900/65 backdrop-blur-md"
          />

          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-charcoal-900/95 p-6 shadow-2xl"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-green-500/15 blur-3xl" />

            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gold-500">
                  Share story
                </p>
                <h2 className="mt-2 font-display text-4xl font-bold leading-none text-white">
                  Send this blog
                </h2>
                <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-white/65">
                  {title}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close share modal"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-7 grid gap-3">
              {shareOptions.map(({ label, description, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-colors duration-200 hover:border-green-500/60 hover:bg-white/[0.075]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-charcoal-900 transition-colors duration-200 group-hover:bg-green-500 group-hover:text-white">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-white">
                      {label}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-white/50">
                      {description}
                    </span>
                  </span>
                </a>
              ))}

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-4 rounded-2xl border border-gold-500/45 bg-gold-500/10 p-4 text-left transition-colors duration-200 hover:border-green-500 hover:bg-green-500/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                  {hasCopied ? (
                    <Check aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <Copy aria-hidden="true" className="h-5 w-5" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-black text-white">
                    {hasCopied ? "Copied" : "Copy link"}
                  </span>
                  <span className="mt-1 block text-xs font-bold text-white/50">
                    {hasCopied ? "Blog link copied" : "Save the link to share later"}
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M15.821 14.1212C15.58 14.8034 14.622 15.3676 13.858 15.5327C13.335 15.6437 12.653 15.7317 10.355 14.7794C7.774 13.7101 4.19 9.90097 4.19 7.36621C4.19 6.07582 4.934 4.57337 6.235 4.57337C6.861 4.57337 6.999 4.58538 7.205 5.07952C7.446 5.6617 8.034 7.09613 8.104 7.24317C8.393 7.84635 7.81 8.19946 7.387 8.72462C7.252 8.88266 7.099 9.05372 7.27 9.3478C7.44 9.63589 8.028 10.5942 8.892 11.3634C10.008 12.3577 10.913 12.6748 11.237 12.8098C11.478 12.9099 11.766 12.8869 11.942 12.6988C12.165 12.4577 12.442 12.0576 12.724 11.6635C12.923 11.3814 13.176 11.3464 13.441 11.4464C13.62 11.5085 15.895 12.5648 15.991 12.7338C16.062 12.8569 16.062 13.439 15.821 14.1212M10.002 0L9.997 0C4.484 0 0 4.48535 0 10C0 12.1867 0.705 14.2153 1.904 15.8608L0.658 19.5769L4.501 18.3485C6.082 19.3948 7.969 20 10.002 20C15.515 20 20 15.5147 20 10C20 4.48535 15.515 0 10.002 0" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M13.86 10.47L21.14 2H19.41L13.09 9.35L8.04 2H2.22L9.86 13.12L2.22 22H3.95L10.63 14.24L15.96 22H21.78L13.86 10.47ZM11.5 13.22L10.72 12.11L4.57 3.3H7.21L12.18 10.41L12.95 11.52L19.41 20.76H16.77L11.5 13.22Z" />
    </svg>
  );
}
