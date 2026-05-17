import { notFound } from "next/navigation";

import { blogPosts, blogPostsBySlug } from "@/constants/blogData";
import { BlogDetailView } from "@/views/blog/BlogDetailView";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];

  if (!post) {
    return {
      title: "Blog Not Found | Abirikky",
    };
  }

  return {
    title: `${post.title} | Abirikky Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(
      (relatedPost) =>
        relatedPost.category === post.category && relatedPost.id !== post.id,
    )
    .slice(0, 3);

  return <BlogDetailView post={post} relatedPosts={relatedPosts} />;
}
