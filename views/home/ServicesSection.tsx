"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const floatingAccents = [
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "left-[6%] top-[18%] h-14 w-20 rotate-12 md:left-[4%] lg:left-[7%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "right-[9%] top-[10%] h-16 w-24 -rotate-12 md:right-[12%] xl:right-[15%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "bottom-[18%] left-[36%] h-12 w-16 -rotate-12 md:left-[42%] xl:left-[38%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "bottom-[9%] right-[6%] h-14 w-24 rotate-45 md:right-[10%] xl:right-[8%]",
  },
];

const services = [
  { title: "Weddings", variant: "filled", className: "w-[12rem]" },
  { title: "Grand Celebrations", variant: "outlined", className: "w-[15rem]" },
  { title: "Conference Catering", variant: "outlined", className: "w-[16rem]" },
  { title: "Corporate Catering", variant: "filled", className: "w-[15rem]" },
  { title: "Food in Bowl", variant: "filled", className: "w-[13rem]" },
  { title: "Home Delivery", variant: "outlined", className: "w-[14rem]" },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftViewportRef = useRef<HTMLDivElement>(null);
  const leftTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const leftViewport = leftViewportRef.current;
    const leftTrack = leftTrackRef.current;

    if (!section || !leftViewport || !leftTrack) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const getScrollDistance = () =>
          Math.max(0, leftTrack.scrollHeight - leftViewport.offsetHeight);

        gsap.set(leftTrack, { y: 0 });

        const tween = gsap.to(leftTrack, {
          y: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance() + window.innerHeight * 0.25}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(leftTrack, { clearProps: "transform" });
        };
      });

      return () => {
        media.revert();
      };
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-base overflow-visible py-24 sm:py-28 lg:min-h-screen lg:py-14"
    >
      {floatingAccents.map((accent) => (
        <span
          key={`${accent.src}-${accent.className}`}
          aria-hidden="true"
          className={`pointer-events-none absolute z-base block ${accent.className}`}
        >
          <Image
            src={accent.src}
            alt=""
            fill
            sizes="96px"
            className="object-contain"
          />
        </span>
      ))}

      <div className="mx-auto grid w-full max-w-container items-start gap-16 px-container-x lg:h-[calc(100vh-7rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div
          ref={leftViewportRef}
          className="relative z-raised lg:h-full lg:overflow-hidden"
        >
          <div ref={leftTrackRef} className="relative z-raised lg:pb-24">
            <div className="pointer-events-none absolute -left-6 bottom-48 hidden select-none font-display text-[7rem] font-bold leading-none text-white/[0.035] md:block lg:text-[10rem] xl:text-[12rem]">
              delicious
            </div>

            <p className="relative z-raised text-lg font-semibold text-gold-500 sm:text-xl">
              Services / <span className="text-green-500">awọn iṣẹ</span>
            </p>

            <h2 className="relative z-raised mt-5 max-w-3xl font-display text-[3rem] font-bold leading-[1.05] text-white sm:text-[4rem] lg:text-[5rem]">
              Catering made for{" "}
              <span className="text-green-500">every gathering</span>
            </h2>

            <p className="relative z-raised mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 sm:text-lg">
              From intimate home dining to full-scale celebrations, our team
              prepares Nigerian classics and intercontinental dishes with the
              timing, polish, and warmth your guests will remember.
            </p>

            <div className="relative z-raised mt-12 flex max-w-2xl flex-wrap items-center gap-4 sm:gap-5">
              {services.map(({ title, variant, className }) => (
                <div
                  key={title}
                  className={`inline-flex h-14 items-center justify-center rounded-full px-6 text-center text-sm font-extrabold uppercase tracking-normal shadow-sm transition-colors duration-200 sm:h-16 sm:text-base ${className} ${
                    variant === "filled"
                      ? "bg-white text-charcoal-700 hover:bg-cream-100"
                      : "border-2 border-gold-500 bg-transparent text-white hover:bg-gold-500/10"
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>

            <div className="relative z-raised mt-14 max-w-2xl">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/25 blur-2xl" />
              <a
                href="#menu"
                className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border-2 border-green-500 px-16 py-5 text-center text-base font-bold text-green-500 shadow-green-sm transition-colors duration-200 hover:bg-green-500 hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-10 w-14 -translate-y-1/2"
                >
                  <Image
                    src="/bgIcons/bgIcon1.png"
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </span>
                <span className="relative z-raised">Come choose your taste</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 h-10 w-14 -translate-y-1/2 scale-x-[-1]"
                >
                  <Image
                    src="/bgIcons/bgIcon1.png"
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="relative min-h-[32rem] lg:h-full lg:min-h-0 lg:self-start">
          <div className="pointer-events-none absolute -top-8 right-0 hidden select-none font-display text-[8rem] font-bold leading-none text-white/[0.035] md:block lg:text-[12rem] xl:text-[14rem]">
            fun mi
          </div>

          <div className="absolute right-4 top-1/2 h-[28rem] w-[18rem] -translate-y-1/2 rounded-lg bg-gold-500 sm:right-10 sm:h-[33rem] sm:w-[21rem] lg:right-8 lg:h-[38rem] lg:w-[24rem]" />

          <div className="pointer-events-none absolute right-[calc(5.5rem-180px)] top-[58%] z-raised h-[30rem] w-[30rem] -translate-y-1/2 sm:right-[calc(7rem-180px)] sm:h-[36rem] sm:w-[36rem] lg:right-[calc(8.5rem-180px)] lg:h-[43rem] lg:w-[43rem]">
            <Image
              src="/section/sectionImage2.png"
              alt="Catering service dish"
              fill
              sizes="(min-width: 1024px) 688px, (min-width: 640px) 576px, 480px"
              className="object-contain drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
