"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BlogCommentsPanel } from "@/components/blog/BlogCommentsPanel";
import { BlogShareModal } from "@/components/blog/BlogShareModal";
import { MarkdownRenderContent } from "@/components/MarkdownRenderContent";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ErrorStateCard } from "@/components/ui/ErrorStateCard";
import { ResilientImage } from "@/components/ui/ResilientImage";
import type { BlogPost } from "@/constants/blogData";
import {
  useBlogPostQuery,
  useTrackBlogViewMutation,
} from "@/hooks/useBlogQueries";
import { useBlogComments } from "@/hooks/useBlogComments";

type BlogDetailViewProps = {
  slug: string;
};

export function BlogDetailView({ slug }: BlogDetailViewProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const trackedPostIdRef = useRef<string | null>(null);
  const blogQuery = useBlogPostQuery(slug);
  const post = blogQuery.data?.post;
  const relatedPosts = blogQuery.data?.relatedPosts ?? [];
  const trackViewMutation = useTrackBlogViewMutation(slug);
  const {
    addComment,
    addReply,
    collapseReplies,
    comments,
    commentsError,
    expandMoreReplies,
    getVisibleReplyCount,
    isCommentsError,
    isCommentsLoading,
    isCommentSubmitting,
    reactions,
    refetchComments,
    saveUserName,
    toggleDislike,
    toggleLike,
    totalCommentCount,
    userName,
  } = useBlogComments(post?.id);

  useEffect(() => {
    if (!post?.id || trackedPostIdRef.current === post.id) {
      return;
    }

    trackedPostIdRef.current = post.id;
    trackViewMutation.mutate(post.id);
  }, [post?.id, trackViewMutation]);

  if (blogQuery.isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (blogQuery.isError) {
    return (
      <main className="relative min-h-screen pt-nav-h">
        <ErrorStateCard
          title="Blog post unavailable"
          description="We could not load this blog post from the CMS. Refresh and try again."
          isRefreshing={blogQuery.isFetching}
          onRefresh={() => void blogQuery.refetch()}
        />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative min-h-screen pt-nav-h">
        <EmptyStateCard
          title="Blog post not found"
          description="This story is not available right now."
        />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full max-w-full overflow-x-hidden pt-nav-h">
      <article className="relative mx-auto w-full max-w-container overflow-x-hidden px-container-x py-12 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute left-[-7rem] top-24 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[-8rem] top-[20rem] h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative z-raised grid min-w-0 w-full max-w-full gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="min-w-0 w-full max-w-full overflow-hidden">
            <div className="flex w-full items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-500 transition-colors duration-200 hover:text-green-500"
              >
                <ArrowIcon className="h-4 w-4" />
                Back to blog
              </Link>

              <span className="inline-flex shrink-0 rounded-sm bg-green-500 px-3 py-1 text-[0.7rem] font-black uppercase tracking-wider text-white">
                {post.category}
              </span>
            </div>

            <div className="relative mt-5 aspect-[16/9] w-full max-w-[calc(100vw-3rem)] overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-2xl sm:max-w-full">
              <ResilientImage
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                sizes="(min-width: 1280px) 900px, (min-width: 1024px) calc(100vw - 28rem), 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/45 to-transparent" />
            </div>

            <div className="mt-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="break-words font-display text-4xl font-bold leading-[0.98] text-white sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] font-bold uppercase tracking-wider text-white/55">
                  <span>By {post.author}</span>
                  <span aria-hidden="true" className="text-gold-500">
                    •
                  </span>
                  <span>{formatBlogDate(post.publishedAt)}</span>
                  <span aria-hidden="true" className="text-gold-500">
                    •
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs font-bold text-white/75 sm:shrink-0">
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon className="h-4 w-4 text-white" />
                  {post.viewsTotal ?? 0}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PeopleIcon className="h-4 w-4 text-gold-500" />
                  {post.commentCount}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CommentIcon className="h-4 w-4 text-green-500" />
                  {totalCommentCount}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
              >
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
              <button
                type="button"
                onClick={() => setIsCommentsOpen(true)}
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:border-green-500 hover:text-green-500"
              >
                <CommentIcon className="h-4 w-4" />
                Comments
              </button>
            </div>

            <div className="mt-10 w-full max-w-[calc(100vw-3rem)] break-words text-sm font-medium leading-8 text-white/75 sm:max-w-3xl sm:text-base">
              <p className="mb-8 text-lg leading-8 text-white/80">
                {post.excerpt}
              </p>
              <MarkdownRenderContent content={post.markdownContent} />
            </div>
          </div>

          {relatedPosts.length > 0 ? (
            <aside className="min-w-0 w-full max-w-full overflow-hidden lg:sticky lg:top-24">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold text-white lg:text-2xl">
                  Related Blogs
                </h2>
                <Link
                  href="/blog"
                  className="text-xs font-black uppercase tracking-wider text-gold-500 hover:text-green-500"
                >
                  See all
                </Link>
              </div>

              <div className="scrollbar-none flex w-full min-w-0 max-w-full snap-x gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-6 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-5 lg:overflow-visible lg:pb-0 lg:pr-0">
                {relatedPosts.map((relatedPost) => (
                  <RelatedStoryCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </article>

      <BlogCommentsPanel
        comments={comments}
        errorMessage={commentsError instanceof Error ? commentsError.message : undefined}
        getVisibleReplyCount={getVisibleReplyCount}
        isOpen={isCommentsOpen}
        isError={isCommentsError}
        isLoading={isCommentsLoading}
        isSubmitting={isCommentSubmitting}
        reactions={reactions}
        totalCommentCount={totalCommentCount}
        userName={userName}
        onAddComment={addComment}
        onAddReply={addReply}
        onClose={() => setIsCommentsOpen(false)}
        onCollapseReplies={collapseReplies}
        onExpandReplies={expandMoreReplies}
        onRefresh={() => void refetchComments()}
        onSaveUserName={saveUserName}
        onToggleDislike={toggleDislike}
        onToggleLike={toggleLike}
      />
      <BlogShareModal
        excerpt={post.excerpt}
        isOpen={isShareOpen}
        title={post.title}
        onClose={() => setIsShareOpen(false)}
      />
    </main>
  );
}

function RelatedStoryCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group w-[16rem] max-w-[78vw] shrink-0 snap-start overflow-hidden rounded-lg border border-white/15 bg-white/[0.065] backdrop-blur-sm transition-colors duration-200 hover:border-gold-500/50 sm:w-[18rem] lg:w-full lg:max-w-none"
    >
      <div className="relative aspect-[16/10] bg-white/10">
        <ResilientImage
          src={post.image}
          alt={post.imageAlt ?? post.title}
          fill
          sizes="(min-width: 1024px) 352px, 288px"
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-charcoal-900/25" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-sm bg-green-500 px-2 py-1 text-[0.6rem] font-black uppercase tracking-wider text-white">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-black text-white/70">
            <EyeIcon className="h-3.5 w-3.5" />
            {post.viewsTotal ?? 0}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold leading-tight text-white transition-colors duration-200 group-hover:text-gold-500">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

function BlogDetailSkeleton() {
  return (
    <main className="relative min-h-screen pt-nav-h">
      <div className="mx-auto w-full max-w-container px-container-x py-12">
        <div className="aspect-[16/9] rounded-lg bg-white/10" />
        <div className="mt-8 h-16 max-w-3xl rounded-full bg-white/10" />
        <div className="mt-5 h-5 max-w-xl rounded-full bg-white/10" />
        <div className="mt-10 space-y-5">
          <div className="h-5 max-w-3xl rounded-full bg-white/10" />
          <div className="h-5 max-w-2xl rounded-full bg-white/10" />
          <div className="h-5 max-w-3xl rounded-full bg-white/10" />
        </div>
      </div>
    </main>
  );
}

function formatBlogDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 6L5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2.5 12C4.7 7.8 7.85 5.7 12 5.7C16.15 5.7 19.3 7.8 21.5 12C19.3 16.2 16.15 18.3 12 18.3C7.85 18.3 4.7 16.2 2.5 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z" fill="currentColor" />
    </svg>
  );
}

function PeopleIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9.5 11.5C11.433 11.5 13 9.933 13 8C13 6.067 11.433 4.5 9.5 4.5C7.567 4.5 6 6.067 6 8C6 9.933 7.567 11.5 9.5 11.5Z" />
      <path d="M15.25 12C16.7688 12 18 10.7688 18 9.25C18 7.73122 16.7688 6.5 15.25 6.5C14.886 6.5 14.5385 6.57074 14.2207 6.69917C14.4031 7.0968 14.5 7.53718 14.5 8C14.5 9.31558 13.853 10.4801 12.8595 11.1924C13.3624 11.6984 14.0508 12 15.25 12Z" />
      <path d="M2.75 18.5C2.75 15.7386 5.54822 13.5 9 13.5C12.4518 13.5 15.25 15.7386 15.25 18.5V19H2.75V18.5Z" />
      <path d="M16.75 19H21.25V18.65C21.25 16.439 19.197 14.6204 16.556 14.5065C17.1968 15.5671 17.55 16.797 17.55 18.1V19H16.75Z" />
    </svg>
  );
}

function CommentIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="M60,0H4C1.789,0,0,1.789,0,4v40c0,2.211,1.789,4,4,4h8v15c0,0.404,0.243,0.77,0.617,0.924 C12.741,63.976,12.871,64,13,64c0.26,0,0.516-0.102,0.707-0.293L29.414,48H60c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M15,14 h16c0.553,0,1,0.447,1,1s-0.447,1-1,1H15c-0.553,0-1-0.447-1-1S14.447,14,15,14z M45,34H15c-0.553,0-1-0.447-1-1s0.447-1,1-1h30 c0.553,0,1,0.447,1,1S45.553,34,45,34z M14,27c0-0.553,0.447-1,1-1h24c0.553,0,1,0.447,1,1s-0.447,1-1,1H15 C14.447,28,14,27.553,14,27z M49,22H15c-0.553,0-1-0.447-1-1s0.447-1,1-1h34c0.553,0,1,0.447,1,1S49.553,22,49,22z" />
    </svg>
  );
}

function ShareIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.188 15.0173 5.37197 15.0504 5.55034L8.68495 9.08784C8.14949 8.41672 7.3242 8 6.4 8C4.74315 8 3.4 9.34315 3.4 11C3.4 12.6569 4.74315 14 6.4 14C7.3242 14 8.14949 13.5833 8.68495 12.9122L15.0504 16.4497C15.0173 16.628 15 16.812 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.0758 14 16.2505 14.4167 15.7151 15.0878L9.34962 11.5503C9.38273 11.372 9.4 11.188 9.4 11C9.4 10.812 9.38273 10.628 9.34962 10.4497L15.7151 6.91216C16.2505 7.58328 17.0758 8 18 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
