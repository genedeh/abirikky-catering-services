import Image from "next/image";
import { CirclePlay, ShoppingBag } from "lucide-react";

const floatingPlates = [
  {
    src: "/hero/heroImage1.png",
    className:
      "-left-28 top-[-5rem] h-[22.5rem] w-[22.5rem] lg:-left-40 lg:top-[-7rem] lg:h-[30rem] lg:w-[30rem] xl:top-[-9rem] xl:h-[37.5rem] xl:w-[37.5rem]",
  },
  {
    src: "/hero/heroImage2.png",
    className:
      "bottom-[-6rem] right-[1%] h-[22rem] w-[22rem] lg:bottom-[-7rem] lg:right-[6%] lg:h-[32rem] lg:w-[32rem] xl:h-[41rem] xl:w-[41rem]",
  },
];

const floatingAccents = [
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "left-[8%] top-[18%] h-18 w-24 rotate-12 sm:left-[10%] lg:left-[6%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "right-[48%] top-[18%] h-16 w-28 -rotate-12 md:right-[43%] xl:right-[46%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "left-[14%] bottom-[23%] h-20 w-24 rotate-45 md:left-[24%] xl:left-[19%]",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className:
      "right-[9%] top-[12%] h-16 w-16 rotate-12 md:right-[7%] xl:right-[11%]",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className:
      "right-[38%] bottom-[10%] h-16 w-28 rotate-12 md:right-[32%] xl:right-[36%]",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-nav-h">
      <div className="pointer-events-none absolute -left-8 top-24 hidden select-none font-display text-[7rem] font-bold leading-none text-white/[0.035] sm:block md:text-[10rem] lg:left-0 lg:text-[13rem] xl:text-[16rem]">
        ounje
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
            sizes="56px"
            className="object-contain"
          />
        </span>
      ))}

      <div className="relative -left-[30px] mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-container items-center px-container-x py-14 sm:py-16 lg:py-20">
        <div className="relative z-raised ml-2.5 w-full max-w-[43rem] md:w-[52%] lg:w-[50%]">
          <h1 className="font-display text-[3.25rem] font-bold leading-[1.04] text-white sm:text-[4.25rem] md:text-[4.5rem] lg:text-[5.35rem] xl:text-[6rem]">
            Enjoy Delicious
            <br />
            The <span className="text-gold-500">Nigerian Foods</span>
          </h1>

          <p className="mt-7 max-w-[35rem] text-base font-medium leading-7 text-white/70 sm:text-lg">
            We serve the best Nigerian foods. Cooked with selected ingredients
            by a professional chef with an authentic taste. We hope you enjoy
            our meals!
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="#order"
              className="inline-flex h-btn-h-lg items-center justify-center gap-3 rounded-lg bg-gold-500 px-7 font-semibold text-white shadow-gold-sm transition-colors duration-200 hover:bg-gold-600"
            >
              <ShoppingBag aria-hidden="true" className="h-5 w-5" />
              Order Now
            </a>

            <a
              href="#how-to-order"
              className="inline-flex h-btn-h-lg items-center justify-center gap-3 bg-transparent px-2 font-semibold text-green-500 transition-colors duration-200 hover:text-green-400"
            >
              <CirclePlay aria-hidden="true" className="h-9 w-9" />
              How to Order
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-[-8rem] right-[-13rem] top-[8rem] z-base hidden w-[58vw] max-w-[52rem] md:block lg:right-[-11rem] xl:right-[-9rem]">
          <div className="relative h-full min-h-[33rem]">
            <div className="absolute right-[-5rem] top-1/2 aspect-square w-[min(68vw,58rem)] -translate-y-1/2 rounded-full bg-gold-300/10 blur-sm" />
            <div className="absolute right-0 top-1/2 aspect-square w-[min(58vw,48rem)] -translate-y-1/2 rounded-full bg-gold-500" />

            {floatingPlates.map((plate) => (
              <div
                key={plate.src}
                aria-hidden="true"
                className={`pointer-events-none absolute z-raised ${plate.className}`}
              >
                <Image
                  src={plate.src}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 480px, 360px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
