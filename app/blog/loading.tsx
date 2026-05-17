export default function BlogLoading() {
  return (
    <main className="min-h-screen pt-nav-h">
      <section className="mx-auto w-full max-w-container px-container-x py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto h-4 w-20 overflow-hidden rounded-full bg-white/10">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          </div>
          <div className="mx-auto mt-5 h-16 max-w-2xl overflow-hidden rounded-2xl bg-white/10 sm:h-20">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          </div>
          <div className="mx-auto mt-5 h-6 max-w-xl overflow-hidden rounded-full bg-white/10">
            <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.055] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-11 w-28 shrink-0 overflow-hidden rounded-full bg-white/10"
                >
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
              ))}
            </div>
            <div className="h-12 w-full overflow-hidden rounded-full bg-white/10 lg:max-w-sm">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.075]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-white/10">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
              </div>
              <div className="space-y-4 p-6">
                <div className="h-4 w-40 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
                <div className="h-8 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
                <div className="h-16 w-full overflow-hidden rounded-xl bg-white/10">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
