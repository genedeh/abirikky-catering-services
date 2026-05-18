import { blogPosts } from "@/constants/blogData";

export type BlogComment = {
  id: string;
  postSlug: string;
  blogPostId?: string;
  parentCommentId?: string | null;
  author: string;
  body: string;
  createdAtLabel: string;
  likes: number;
  dislikes: number;
  replies: BlogComment[];
  status?: string;
  isUserComment?: boolean;
  failed?: boolean;
};

const commentAuthors = [
  "Bessie Cooper",
  "Marvin McKinney",
  "Ifeoma Nwosu",
  "Tunde Adebayo",
  "Adaeze Okafor",
  "Damilola Briggs",
];

const commentBodies = [
  "I think the team can use this update to explain what changes first for merchants and what comes later.",
  "The first campaign went smoothly. Please make sure the article keeps the operational details easy to understand.",
  "I like how the related stories give more context. It makes the story feel connected to the wider catering experience.",
  "This is useful for hosts planning bigger events. The timing notes make the food service feel less stressful.",
  "The menu planning section feels practical. I would love to see more examples for smaller home gatherings.",
  "Good reminder that presentation matters as much as the cooking when guests are moving through a venue.",
];

const replyBodies = [
  "Yes, that would make the article easier to scan. The next step should be clear before the deeper context.",
  "Agree. A short timeline near the top would also help readers understand what is live now.",
  "Exactly. Those small planning details are usually what make the event feel calm.",
  "The examples are helpful because they show how the service works in real situations.",
  "I would also add a quick checklist for hosts who are booking catering for the first time.",
  "That would be useful, especially for people comparing buffet and plated service.",
];

function buildReplies(postSlug: string, commentIndex: number, count: number) {
  return Array.from({ length: count }, (_, replyIndex): BlogComment => {
    const author = commentAuthors[(commentIndex + replyIndex + 1) % commentAuthors.length];

    return {
      id: `${postSlug}-comment-${commentIndex + 1}-reply-${replyIndex + 1}`,
      postSlug,
      author,
      body: replyBodies[(commentIndex + replyIndex) % replyBodies.length],
      createdAtLabel: replyIndex === 0 ? "2h ago" : `${replyIndex + 1}d ago`,
      likes: 1 + ((commentIndex + replyIndex) % 4),
      dislikes: (commentIndex + replyIndex) % 2,
      replies: [],
    };
  });
}

function buildCommentsForPost(postSlug: string, postIndex: number) {
  return Array.from({ length: 6 }, (_, commentIndex): BlogComment => {
    const replyCount = commentIndex === 0 ? 7 : commentIndex % 2 === 0 ? 2 : 0;

    return {
      id: `${postSlug}-comment-${commentIndex + 1}`,
      postSlug,
      author: commentAuthors[(postIndex + commentIndex) % commentAuthors.length],
      body: commentBodies[(postIndex + commentIndex) % commentBodies.length],
      createdAtLabel: commentIndex === 0 ? "3h ago" : `${commentIndex + 1}d ago`,
      likes: 2 + ((postIndex + commentIndex) % 5),
      dislikes: (postIndex + commentIndex) % 2,
      replies: buildReplies(postSlug, commentIndex, replyCount),
    };
  });
}

export const blogCommentsBySlug: Record<string, BlogComment[]> = blogPosts.reduce(
  (commentsBySlug, post, postIndex) => {
    commentsBySlug[post.slug] = buildCommentsForPost(post.slug, postIndex);
    return commentsBySlug;
  },
  {} as Record<string, BlogComment[]>,
);
