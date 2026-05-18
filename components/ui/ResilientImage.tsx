"use client";

import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ResilientImageProps = Omit<ImageProps, "src" | "alt"> & {
  alt: string;
  src: string;
  iconClassName?: string;
};

const RETRY_DELAY_MS = 5000;
const loadedImageSources = new Set<string>();

export function ResilientImage({
  alt,
  className = "",
  iconClassName = "h-8 w-8",
  src,
  ...imageProps
}: ResilientImageProps) {
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    () => (loadedImageSources.has(src) ? "loaded" : "loading"),
  );

  useEffect(() => {
    queueMicrotask(() => {
      setAttempt(0);
      setStatus(loadedImageSources.has(src) ? "loaded" : "loading");
    });
  }, [src]);

  useEffect(
    () => () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    },
    [],
  );

  const handleError = () => {
    setStatus("error");

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    retryTimeoutRef.current = setTimeout(() => {
      setStatus("loading");
      setAttempt((currentAttempt) => currentAttempt + 1);
    }, RETRY_DELAY_MS);
  };

  return (
    <>
      <Image
        {...imageProps}
        key={`${src}-${attempt}`}
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        onError={handleError}
        onLoad={() => {
          loadedImageSources.add(src);
          setStatus("loaded");
        }}
      />

      {status !== "loaded" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/10">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/18 to-transparent bg-[length:200%_100%]" />
          <div className="relative z-raised flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-charcoal-900/45 text-gold-300">
            <ImageIcon aria-hidden="true" className={iconClassName} />
          </div>
        </div>
      ) : null}
    </>
  );
}
