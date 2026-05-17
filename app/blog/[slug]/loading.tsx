export default function BlogDetailLoading() {
  return (
    <main className="min-h-screen pt-nav-h">
      <article className="mx-auto w-full max-w-container px-container-x py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="min-w-0">
            <div className="h-4 w-28 overflow-hidden rounded-full bg-white/10">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
            </div>

            <div className="mt-7 h-6 w-24 overflow-hidden rounded-sm bg-green-500/25">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-green-200/20 to-transparent bg-[length:200%_100%]" />
            </div>

            <div className="mt-5 aspect-[16/9] overflow-hidden rounded-lg bg-white/10 shadow-2xl">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="w-full min-w-0">
                <div className="h-12 w-full max-w-3xl overflow-hidden rounded-xl bg-white/10 sm:h-16">
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div
                      key={index}
                      className="h-3 w-28 overflow-hidden rounded-full bg-white/10"
                    >
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="h-8 w-12 overflow-hidden rounded-md bg-white/10"
                  >
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 h-9 w-24 overflow-hidden rounded-sm border border-white/10 bg-white/5">
              <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
            </div>

            <div className="mt-10 max-w-3xl space-y-5">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className={`h-4 overflow-hidden rounded-full bg-white/10 ${
                    index % 3 === 0 ? "w-11/12" : index % 3 === 1 ? "w-full" : "w-4/5"
                  }`}
                >
                  <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="mb-4 flex items-center justify-between">
              <div className="h-8 w-40 overflow-hidden rounded-lg bg-white/10">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
              </div>
              <div className="h-3 w-12 overflow-hidden rounded-full bg-white/10">
                <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
              </div>
            </div>

            <div className="scrollbar-none -mx-container-x flex gap-4 overflow-x-auto px-container-x pb-2 lg:mx-0 lg:block lg:space-y-5 lg:overflow-visible lg:px-0 lg:pb-0">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="w-[18rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.065] lg:w-full"
                >
                  <div className="aspect-[16/10] bg-white/10">
                    <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-20 overflow-hidden rounded-sm bg-green-500/20">
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-green-200/20 to-transparent bg-[length:200%_100%]" />
                    </div>
                    <div className="h-8 w-full overflow-hidden rounded-lg bg-white/10">
                      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
