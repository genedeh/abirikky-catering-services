import type { Metadata } from "next";

import { BlogDetailView } from "@/views/blog/BlogDetailView";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type CmsBlogPostMetadata = {
  post: {
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt?: string | null;
    coverImage?: {
      url?: string | null;
      alt?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  };
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPostMetadata(slug);
  const post = data?.post;

  if (!post) {
    return {
      title: "Blog Not Found | Abirikky Blog",
      description: "This Abirikky blog post is not available right now.",
    };
  }

  const title = `${post.title} | Abirikky Blog`;
  const description =
    post.excerpt || "Read the latest catering story from Abirikky.";
  const canonicalUrl = `/blog/${post.slug}`;
  const imageUrl = post.coverImage?.url;
  const images = imageUrl
    ? [
        {
          url: imageUrl,
          width: post.coverImage?.width ?? 1200,
          height: post.coverImage?.height ?? 630,
          alt: post.coverImage?.alt ?? post.title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishedAt ?? undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  return <BlogDetailView slug={slug} />;
}

async function getBlogPostMetadata(slug: string) {
  const cmsApiUrl = process.env.CMS_API_URL;

  if (!cmsApiUrl) {
    return null;
  }

  try {
    const response = await fetch(
      new URL(
        `/api/public/blog-posts/${encodeURIComponent(slug)}?includeRelated=true`,
        cmsApiUrl,
      ),
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CmsBlogPostMetadata;
  } catch {
    return null;
  }
}
