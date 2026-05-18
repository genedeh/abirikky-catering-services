"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Loader2, RefreshCw, X } from "lucide-react";

import type { BlogComment } from "@/constants/blogCommentsData";
import type { BlogCommentReaction } from "@/utils/blogCommentStorage";

type BlogCommentsPanelProps = {
  comments: BlogComment[];
  errorMessage?: string;
  getVisibleReplyCount: (commentId: string) => number;
  isOpen: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  reactions: Record<string, BlogCommentReaction>;
  totalCommentCount: number;
  userName: string;
  onAddComment: (body: string, author: string) => void;
  onAddReply: (commentId: string, body: string, author: string) => void;
  onClose: () => void;
  onCollapseReplies: (commentId: string) => void;
  onExpandReplies: (commentId: string, replyCount: number) => void;
  onRefresh: () => void;
  onSaveUserName: (userName: string) => void;
  onToggleDislike: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
};

type ReplyTarget = {
  id: string;
  author: string;
} | null;

type PendingSubmit =
  | {
      body: string;
      replyTarget: ReplyTarget;
    }
  | null;

export function BlogCommentsPanel({
  comments,
  errorMessage,
  getVisibleReplyCount,
  isOpen,
  isError = false,
  isLoading = false,
  isSubmitting = false,
  reactions,
  totalCommentCount,
  userName,
  onAddComment,
  onAddReply,
  onClose,
  onCollapseReplies,
  onExpandReplies,
  onRefresh,
  onSaveUserName,
  onToggleDislike,
  onToggleLike,
}: BlogCommentsPanelProps) {
  const [draft, setDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget>(null);
  const [pendingSubmit, setPendingSubmit] = useState<PendingSubmit>(null);
  const commentListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const orderedComments = useMemo(() => {
    const normalizedUserName = userName.trim().toLowerCase();

    if (!normalizedUserName) {
      return comments;
    }

    return [...comments].sort((firstComment, secondComment) => {
      const isFirstUserComment =
        firstComment.author.trim().toLowerCase() === normalizedUserName;
      const isSecondUserComment =
        secondComment.author.trim().toLowerCase() === normalizedUserName;

      if (isFirstUserComment === isSecondUserComment) {
        return 0;
      }

      return isFirstUserComment ? -1 : 1;
    });
  }, [comments, userName]);

  const submitComment = (body: string, target: ReplyTarget, author: string) => {
    if (target) {
      onAddReply(target.id, body, author);
    } else {
      onAddComment(body, author);
      window.requestAnimationFrame(() => {
        commentListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    setDraft("");
    setReplyTarget(null);
  };

  const handleSubmit = () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      return;
    }

    if (!userName.trim()) {
      setNameDraft(userName);
      setPendingSubmit({
        body: trimmedDraft,
        replyTarget,
      });
      return;
    }

    submitComment(trimmedDraft, replyTarget, userName);
  };

  const handleNameSubmit = () => {
    const trimmedName = nameDraft.trim();

    if (!trimmedName || !pendingSubmit) {
      return;
    }

    onSaveUserName(trimmedName);
    submitComment(pendingSubmit.body, pendingSubmit.replyTarget, trimmedName);
    setPendingSubmit(null);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[50000]"
          role="dialog"
          aria-modal="true"
          aria-label="Blog comments"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close comments"
            onClick={onClose}
            className="absolute inset-0 bg-charcoal-900/55 backdrop-blur-md"
          />

          <motion.aside
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-charcoal-900 shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[min(32rem,92vw)] md:rounded-l-2xl md:rounded-tr-none"
            initial={{ opacity: 0, x: 36, y: 48 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 36, y: 48 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="border-b border-white/10 px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white/70">
                    {totalCommentCount} comments
                  </p>
                  <h2 className="mt-5 font-display text-5xl font-bold leading-none text-white">
                    Comments
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close comments"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </header>

            <Composer
              draft={draft}
              isSubmitting={isSubmitting}
              replyTarget={replyTarget}
              onCancelReply={() => setReplyTarget(null)}
              onDraftChange={setDraft}
              onSubmit={handleSubmit}
            />

            <div
              ref={commentListRef}
              className="cart-drawer-scroll min-h-0 flex-1 overflow-y-auto"
            >
              {isLoading ? (
                <div className="flex h-full min-h-64 items-center justify-center text-white/70">
                  <Loader2 aria-hidden="true" className="h-10 w-10 animate-spin" />
                </div>
              ) : isError ? (
                <div className="p-6 text-center">
                  <p className="font-display text-3xl font-bold text-white">
                    Comments unavailable
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/65">
                    {errorMessage ||
                      "We could not load the comments. Refresh and try again."}
                  </p>
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-gold-600"
                  >
                    <RefreshCw aria-hidden="true" className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              ) : orderedComments.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-display text-3xl font-bold text-white">
                    No comments yet
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/65">
                    Start the conversation with a helpful note.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {orderedComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      getVisibleReplyCount={getVisibleReplyCount}
                      reactions={reactions}
                      onCollapseReplies={onCollapseReplies}
                      onExpandReplies={onExpandReplies}
                      onReply={(target) => setReplyTarget(target)}
                      onToggleDislike={onToggleDislike}
                      onToggleLike={onToggleLike}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.aside>

          <NamePromptModal
            isOpen={Boolean(pendingSubmit)}
            nameDraft={nameDraft}
            onCancel={() => setPendingSubmit(null)}
            onNameChange={setNameDraft}
            onSubmit={handleNameSubmit}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Composer({
  draft,
  isSubmitting,
  replyTarget,
  onCancelReply,
  onDraftChange,
  onSubmit,
}: {
  draft: string;
  isSubmitting: boolean;
  replyTarget: ReplyTarget;
  onCancelReply: () => void;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="border-b border-white/10 px-5 py-6 sm:px-7">
      <div className="grid grid-cols-[2.75rem_1fr] gap-4">
        <AvatarIcon />

        <div>
          {replyTarget ? (
            <div className="mb-3 flex min-h-10 items-center justify-between border border-white/15 bg-white/[0.04] px-4 text-sm font-bold text-white">
              <span>Replying to {replyTarget.author}</span>
              <button
                type="button"
                onClick={onCancelReply}
                className="text-gold-500 underline underline-offset-4 transition-colors duration-200 hover:text-green-500"
              >
                Cancel
              </button>
            </div>
          ) : null}

          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={
              replyTarget ? `Reply to ${replyTarget.author}` : "Start a discussion"
            }
            className="min-h-24 w-full resize-y border border-white/15 bg-white/[0.04] px-4 py-4 text-sm font-medium leading-6 text-white outline-none transition-colors duration-200 placeholder:text-white/45 focus:border-green-500"
          />

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !draft.trim()}
            className="mt-3 h-12 bg-gold-500 px-8 text-sm font-black text-white transition-colors duration-200 hover:bg-green-500"
          >
            {isSubmitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  getVisibleReplyCount,
  reactions,
  onCollapseReplies,
  onExpandReplies,
  onReply,
  onToggleDislike,
  onToggleLike,
}: {
  comment: BlogComment;
  getVisibleReplyCount: (commentId: string) => number;
  reactions: Record<string, BlogCommentReaction>;
  onCollapseReplies: (commentId: string) => void;
  onExpandReplies: (commentId: string, replyCount: number) => void;
  onReply: (target: { id: string; author: string }) => void;
  onToggleDislike: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
}) {
  const visibleReplyCount = getVisibleReplyCount(comment.id);
  const visibleReplies = comment.replies.slice(0, visibleReplyCount);
  const hasHiddenReplies = visibleReplyCount < comment.replies.length;
  const isExpanded = visibleReplyCount > 1;

  return (
    <article className="px-5 py-6 sm:px-7">
      <div className="grid grid-cols-[2.75rem_1fr] gap-4">
        <AvatarIcon />
        <div>
          <CommentBody
            comment={comment}
            reaction={reactions[comment.id]}
            onReply={onReply}
            onToggleDislike={onToggleDislike}
            onToggleLike={onToggleLike}
          />

          {comment.replies.length > 0 ? (
            <div className="mt-4 border-l border-white/15 pl-5">
              {visibleReplies.map((reply) => (
                <div key={reply.id} className="mb-5 last:mb-0">
                  <div className="grid grid-cols-[2.5rem_1fr] gap-4">
                    <AvatarIcon small />
                    <CommentBody
                      comment={reply}
                      reaction={reactions[reply.id]}
                      onReply={onReply}
                      onToggleDislike={onToggleDislike}
                      onToggleLike={onToggleLike}
                      hideReplyAction
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 flex flex-wrap gap-3">
                {hasHiddenReplies ? (
                  <button
                    type="button"
                    onClick={() => onExpandReplies(comment.id, comment.replies.length)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-green-500 transition-colors duration-200 hover:text-gold-500"
                  >
                    <ChevronDown aria-hidden="true" className="h-4 w-4" />
                    Show next replies
                  </button>
                ) : null}

                {isExpanded ? (
                  <button
                    type="button"
                    onClick={() => onCollapseReplies(comment.id)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gold-500 transition-colors duration-200 hover:text-green-500"
                  >
                    <ChevronUp aria-hidden="true" className="h-4 w-4" />
                    Collapse replies
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CommentBody({
  comment,
  hideReplyAction = false,
  reaction,
  onReply,
  onToggleDislike,
  onToggleLike,
}: {
  comment: BlogComment;
  hideReplyAction?: boolean;
  reaction?: BlogCommentReaction;
  onReply: (target: { id: string; author: string }) => void;
  onToggleDislike: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="text-base font-black text-white">{comment.author}</h3>
        <span className="text-xs font-bold text-white/45">
          {comment.createdAtLabel}
        </span>
        {comment.status === "pending" || comment.isUserComment ? (
          <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-gold-300">
            Pending
          </span>
        ) : null}
      </div>
      <p className="mt-2 whitespace-pre-line break-words text-sm font-medium leading-7 text-white/72">
        {comment.body}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ReactionButton
          active={reaction === "like"}
          count={comment.likes}
          label={`Like comment by ${comment.author}`}
          onClick={() => onToggleLike(comment.id)}
          type="like"
        />
        <ReactionButton
          active={reaction === "dislike"}
          count={comment.dislikes}
          label={`Dislike comment by ${comment.author}`}
          onClick={() => onToggleDislike(comment.id)}
          type="dislike"
        />
        {!hideReplyAction ? (
          <button
            type="button"
            onClick={() => onReply({ id: comment.id, author: comment.author })}
            className="h-9 border border-white/10 bg-white/[0.04] px-4 text-xs font-black text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
          >
            Reply
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ReactionButton({
  active,
  count,
  label,
  onClick,
  type,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  type: "like" | "dislike";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 border px-3 text-xs font-black transition-colors duration-200 ${
        active
          ? type === "like"
            ? "border-green-500 bg-green-500 text-white"
            : "border-gold-500 bg-gold-500 text-white"
          : "border-white/10 bg-white/[0.04] text-white hover:border-green-500 hover:text-green-500"
      }`}
    >
      {type === "like" ? (
        <LikeIcon className="h-4 w-4" />
      ) : (
        <DislikeIcon className="h-4 w-4" />
      )}
      {count}
    </button>
  );
}

function NamePromptModal({
  isOpen,
  nameDraft,
  onCancel,
  onNameChange,
  onSubmit,
}: {
  isOpen: boolean;
  nameDraft: string;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[51000] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Choose comment display name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-charcoal-900 p-6 shadow-2xl"
            initial={{ y: 18, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 18, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
              Before you post
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-white">
              What name should we show?
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-white/65">
              This name will be saved locally and used for your comments on this
              device.
            </p>

            <input
              value={nameDraft}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Your name"
              className="mt-6 h-12 w-full border border-white/15 bg-white/[0.05] px-4 text-sm font-bold text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-green-500"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onCancel}
                className="h-12 border border-white/15 px-5 text-sm font-bold text-white transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!nameDraft.trim()}
                className="h-12 bg-green-500 px-5 text-sm font-bold text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:shadow-none"
              >
                Save and post
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AvatarIcon({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.055] text-gold-500 ${
        small ? "h-10 w-10" : "h-11 w-11"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={small ? "h-5 w-5" : "h-6 w-6"}
      >
        <path
          d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function LikeIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M7 0L5 5V14H14L16 8V5H10V2C10 0.895431 9.10457 0 8 0H7Z" fill="currentColor" />
      <path d="M3 5H0V14H3V5Z" fill="currentColor" />
    </svg>
  );
}

function DislikeIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M7 16L5 11V2H14L16 8V11H10V14C10 15.1046 9.10457 16 8 16H7Z" fill="currentColor" />
      <path d="M3 11H0V2H3V11Z" fill="currentColor" />
    </svg>
  );
}
