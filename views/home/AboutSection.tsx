import Image from "next/image";

const floatingAccents = [
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "left-[5%] top-[12%] h-16 w-24 -rotate-12 md:left-[9%] lg:left-[4%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "right-[10%] top-[18%] h-14 w-20 rotate-12 md:right-[14%] xl:right-[18%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "bottom-[14%] left-[45%] h-14 w-24 rotate-45 md:left-[48%] xl:left-[52%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "bottom-[23%] right-[7%] h-12 w-16 -rotate-12 md:right-[10%] xl:right-[12%]",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-base mt-24 overflow-hidden py-24 sm:mt-28 sm:py-28 lg:mt-36 lg:py-32"
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

      <div className="mx-auto grid w-full max-w-container items-center gap-14 px-container-x lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative min-h-[28rem] md:min-h-[31rem] lg:min-h-[34rem]">
          <div className="absolute left-4 top-1/2 h-[24rem] w-[16rem] -translate-y-1/2 rounded-lg bg-gold-500 sm:left-10 sm:h-[29rem] sm:w-[19rem] md:left-1/2 md:top-[45%] md:h-[18rem] md:w-[34rem] md:-translate-x-1/2 lg:left-14 lg:top-1/2 lg:h-[34rem] lg:w-[22rem] lg:-translate-x-0" />

          <div className="pointer-events-none absolute left-[-2rem] top-1/2 z-raised h-[28rem] w-[36rem] -translate-y-1/2 sm:left-[-1rem] sm:h-[33rem] sm:w-[43rem] md:left-auto md:right-0 md:top-[59%] md:h-[26rem] md:w-[40rem] lg:left-[-2rem] lg:right-auto lg:top-1/2 lg:h-[40rem] lg:w-[52rem]">
            <Image
              src="/hero/heroImage3.png"
              alt="Prepared Nigerian dish"
              fill
              sizes="(min-width: 1024px) 832px, (min-width: 640px) 688px, 576px"
              className="object-contain drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </div>

        <div className="relative z-raised">
          <div className="pointer-events-none absolute -right-4 top-12 hidden select-none font-display text-[8rem] font-bold leading-none text-white/[0.035] md:block lg:-right-8 lg:text-[12rem] xl:text-[15rem]">
            Mo fe
          </div>

          <p className="relative z-raised text-lg font-semibold text-gold-500 sm:text-xl">
            About Us / <span className="text-green-500">Nipa re</span>
          </p>

          <h2 className="relative z-raised mt-5 max-w-3xl font-display text-[3rem] font-bold leading-[1.05] text-white sm:text-[4rem] lg:text-[5rem]">
            We craft unforgettable{" "}
            <span className="text-green-500">Nigerian taste</span> with global
            flair
          </h2>

          <p className="relative z-raised mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 sm:text-lg">
            Our kitchen celebrates the warmth of Nigerian cooking while
            bringing intercontinental dishes to the same table. From smoky
            jollof and rich soups to polished catering plates, every menu is
            prepared with fresh ingredients, careful seasoning, and a generous
            sense of hospitality.
          </p>
        </div>
      </div>
    </section>
  );
}
