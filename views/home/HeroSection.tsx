import Image from "next/image";
import { CirclePlay, ShoppingBag } from "lucide-react";

const floatingPlates = [
  {
    src: "/hero/heroImage1.png",
    className:
      "z-20 -left-4 top-[-1rem] h-[19rem] w-[26rem] md:left-[-2.25rem] md:top-[0.5rem] md:h-[22rem] md:w-[31rem] lg:-left-52 lg:top-[-9rem] lg:h-[34rem] lg:w-[45rem] xl:top-[-12rem] xl:h-[43rem] xl:w-[56rem]",
  },
  {
    src: "/hero/heroImage2.png",
    className:
      "z-10 bottom-[-2.5rem] right-[-6rem] h-[20rem] w-[29rem] md:bottom-[0.25rem] md:right-[-3.25rem] md:h-[24rem] md:w-[34rem] lg:bottom-[-9rem] lg:right-[3%] lg:h-[36rem] lg:w-[48rem] xl:h-[46rem] xl:w-[60rem]",
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
    <section className="relative z-overlay min-h-screen overflow-hidden pt-nav-h md:overflow-visible lg:z-sticky">
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

      <div className="relative mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-container items-center px-container-x py-14 text-center sm:py-16 md:pl-14 md:pr-container-x md:text-left lg:-left-[30px] lg:px-container-x lg:py-20">
        <div className="relative z-raised mx-auto w-full max-w-[43rem] md:mx-0 md:ml-2.5 md:w-[52%] lg:w-[50%]">
          <h1 className="font-display text-[3.25rem] font-bold leading-[1.04] text-white sm:text-[4.25rem] md:text-[4.5rem] lg:text-[5.35rem] xl:text-[6rem]">
            Enjoy Delicious
            <br />
            The <span className="text-gold-500">Nigerian Foods</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[35rem] text-base font-medium leading-7 text-white/70 sm:text-lg md:mx-0">
            We serve the best Nigerian foods. Cooked with selected ingredients
            by a professional chef with an authentic taste. We hope you enjoy
            our meals!
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6 md:justify-start">
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

        <div className="pointer-events-none absolute bottom-[-7rem] right-[-22rem] z-base block h-[25rem] w-[38rem] md:bottom-[-8rem] md:right-[-13rem] md:top-[8rem] md:h-auto md:w-[58vw] md:max-w-[52rem] lg:right-[-11rem] xl:right-[-9rem]">
          <div className="relative h-full min-h-[25rem] md:min-h-[33rem]">
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
                  sizes="(min-width: 1280px) 896px, (min-width: 1024px) 720px, 544px"
                  className="object-contain drop-shadow-2xl"
                  loading="eager"
                  fetchPriority={
                    plate.src === "/hero/heroImage2.png" ? "high" : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
