import Image from "next/image";

const floatingAccents = [
  {
    src: "/bgIcons/bgIcon1.png",
    className: "left-[8%] top-[18%] h-14 w-24 -rotate-12 md:left-[12%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className: "right-[10%] top-[16%] h-12 w-20 rotate-12 md:right-[16%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className: "bottom-[17%] left-[18%] h-12 w-20 rotate-45 md:left-[24%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className: "bottom-[13%] right-[12%] h-14 w-24 -rotate-45 md:right-[20%]",
  },
];

export function GalleryCtaSection() {
  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden bg-gold-500 px-container-x py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute left-4 top-0 hidden h-full overflow-hidden md:block lg:left-10">
        <div className="animate-[galleryMarqueeDown_12s_linear_infinite] select-none font-display text-[9rem] font-bold leading-none text-white/10 [writing-mode:vertical-rl] lg:text-[12rem]">
          Abirikky Abirikky
        </div>
      </div>
      <div className="pointer-events-none absolute right-4 top-0 hidden h-full overflow-hidden md:block lg:right-10">
        <div className="animate-[galleryMarqueeUp_12s_linear_infinite] select-none font-display text-[9rem] font-bold leading-none text-white/10 [writing-mode:vertical-lr] lg:text-[12rem]">
          Abirikky Abirikky
        </div>
      </div>

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

      <div className="relative z-raised mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          Come See the Moments We Serve
        </h2>

        <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/85 sm:text-lg">
          Explore our gallery for real events, beautiful food spreads, and the
          Abirikky experience waiting for your next celebration.
        </p>

        <a
          href="/gallery"
          className="group mt-10 inline-flex min-w-56 items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-gold-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-charcoal-900 hover:text-white hover:shadow-2xl"
        >
          <span className="transition-transform duration-300 group-hover:scale-105">
            View Gallery
          </span>
        </a>
      </div>
    </section>
  );
}
