"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ErrorStateCard } from "@/components/ui/ErrorStateCard";
import { ResilientImage } from "@/components/ui/ResilientImage";
import { blogCategories, type BlogCategory, type BlogPost } from "@/constants/blogData";
import {
  useBlogCategoriesQuery,
  useBlogPostsQuery,
} from "@/hooks/useBlogQueries";

const INITIAL_VISIBLE_COUNT = 9;
const LOAD_MORE_COUNT = 6;

export function BlogPageView() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>([]);
  const blogQuery = useBlogPostsQuery({
    page,
    limit: page === 1 ? INITIAL_VISIBLE_COUNT : LOAD_MORE_COUNT,
    category: activeCategory === "all" ? undefined : activeCategory,
    search: searchQuery,
    status: "published",
  });
  const categoriesQuery = useBlogCategoriesQuery();
  const categories =
    categoriesQuery.data ??
    blogCategories.map((category) => ({
      name: category,
      slug: category === "All" ? "all" : category,
    }));
  const hasMorePosts = Boolean(blogQuery.data?.pagination.hasNextPage);

  useEffect(() => {
    if (!blogQuery.data) {
      return;
    }

    queueMicrotask(() => {
      setVisiblePosts((currentPosts) => {
        if (page === 1) {
          return blogQuery.data.items;
        }

        const existingIds = new Set(currentPosts.map((post) => post.id));
        const nextPosts = blogQuery.data.items.filter(
          (post) => !existingIds.has(post.id),
        );

        return [...currentPosts, ...nextPosts];
      });
    });
  }, [blogQuery.data, page]);

  const handleCategoryChange = (category: BlogCategory) => {
    setActiveCategory(category);
    setPage(1);
    setVisiblePosts([]);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
    setVisiblePosts([]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-nav-h">
      <section
        aria-labelledby="blog-page-title"
        className="relative mx-auto w-full max-w-container px-container-x py-16 sm:py-20 lg:py-24"
      >
        <div className="pointer-events-none absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[-7rem] top-[22rem] h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-32 hidden select-none font-display text-[7rem] font-bold leading-none text-white/[0.035] lg:block">
          stories
        </div>

        <div className="relative z-raised mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
            Blog
          </p>
          <h1
            id="blog-page-title"
            className="mt-3 font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl"
          >
            Fresh notes from the Abirikky table
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/70 sm:text-lg">
            Catering ideas, Nigerian food stories, event planning notes, and
            kitchen updates for hosts who want food with presence.
          </p>
        </div>

        <div className="relative z-raised mt-12 rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter blog by category"
              className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1"
            >
              {categories.map((category) => {
                const isActive = category.slug === activeCategory;

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`h-11 shrink-0 rounded-full border px-5 text-sm font-bold transition-colors duration-200 ${
                      isActive
                        ? "border-gold-500 bg-gold-500 text-white shadow-gold-sm"
                        : "border-white/15 bg-white/5 text-white/75 hover:border-green-500 hover:text-green-500"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>

            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search blog</span>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/55" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search stories"
                className="h-12 w-full rounded-full border border-white/15 bg-charcoal-900/70 pl-12 pr-5 text-sm font-semibold text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-green-500"
              />
            </label>
          </div>
        </div>

        {blogQuery.isError && visiblePosts.length === 0 && !blogQuery.data ? (
          <ErrorStateCard
            description="We could not load the blog posts. Refresh and try again."
            isRefreshing={blogQuery.isFetching}
            onRefresh={() => void blogQuery.refetch()}
          />
        ) : blogQuery.isLoading && visiblePosts.length === 0 ? (
          <BlogGridSkeleton />
        ) : visiblePosts.length > 0 ? (
          <div className="relative z-raised mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post, index) => (
              <BlogCard key={post.id} post={post} priority={index < 3} />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            title="No blog posts found"
            description="Try another search or switch categories for more Abirikky stories."
          />
        )}

        {hasMorePosts ? (
          <div className="relative z-raised mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={blogQuery.isFetching}
              className="rounded-full border border-gold-500 px-10 py-4 text-base font-bold text-gold-500 transition-colors duration-200 hover:bg-gold-500 hover:text-white"
            >
              {blogQuery.isFetching ? "Loading..." : "Load More"}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function BlogCard({ post, priority }: { post: BlogPost; priority: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.075] shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-gold-500/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/10">
        <ResilientImage
          src={post.image}
          alt={post.imageAlt ?? post.title}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-card-overlay" />
        <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
          {post.category}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/45">
          <span>{formatBlogDate(post.publishedAt)}</span>
          <span className="text-green-500">{post.readTime}</span>
          <span className="inline-flex items-center gap-1.5">
            <PeopleIcon className="h-4 w-4 text-gold-500" />
            {post.commentCount}
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white transition-colors duration-200 group-hover:text-gold-500">
          {post.title}
        </h2>
        <p className="mt-4 text-sm font-medium leading-7 text-white/65">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="relative z-raised mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.075] shadow-2xl"
        >
          <div className="aspect-[4/3] bg-white/10" />
          <div className="space-y-4 p-6">
            <div className="h-4 w-2/3 rounded-full bg-white/10" />
            <div className="h-8 rounded-full bg-white/10" />
            <div className="h-20 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function formatBlogDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function SearchIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10.8 18.1C14.8317 18.1 18.1 14.8317 18.1 10.8C18.1 6.76832 14.8317 3.5 10.8 3.5C6.76832 3.5 3.5 6.76832 3.5 10.8C3.5 14.8317 6.76832 18.1 10.8 18.1Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PeopleIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M9.5 11.5C11.433 11.5 13 9.933 13 8C13 6.067 11.433 4.5 9.5 4.5C7.567 4.5 6 6.067 6 8C6 9.933 7.567 11.5 9.5 11.5Z" />
      <path d="M15.25 12C16.7688 12 18 10.7688 18 9.25C18 7.73122 16.7688 6.5 15.25 6.5C14.886 6.5 14.5385 6.57074 14.2207 6.69917C14.4031 7.0968 14.5 7.53718 14.5 8C14.5 9.31558 13.853 10.4801 12.8595 11.1924C13.3624 11.6984 14.0508 12 15.25 12Z" />
      <path d="M2.75 18.5C2.75 15.7386 5.54822 13.5 9 13.5C12.4518 13.5 15.25 15.7386 15.25 18.5V19H2.75V18.5Z" />
      <path d="M16.75 19H21.25V18.65C21.25 16.439 19.197 14.6204 16.556 14.5065C17.1968 15.5671 17.55 16.797 17.55 18.1V19H16.75Z" />
    </svg>
  );
}
