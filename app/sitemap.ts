import type { MetadataRoute } from "next";

type CmsListResponse<T> = {
  items?: T[];
};

type CmsSlugItem = {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
};

const staticRoutes = ["", "/menu", "/gallery", "/blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [blogPosts, menuItems] = await Promise.all([
    fetchCmsList<CmsSlugItem>("blog-posts?limit=200&status=published"),
    fetchCmsList<CmsSlugItem>("menu-items?limit=200&status=available"),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "weekly" : "daily") as
        | "weekly"
        | "daily",
      priority: route === "" ? 1 : 0.8,
    })),
    ...blogPosts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...menuItems
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${siteUrl}/menu/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];
}

function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, "");
}

async function fetchCmsList<T extends CmsSlugItem>(path: string): Promise<T[]> {
  const cmsApiUrl = process.env.CMS_API_URL;

  if (!cmsApiUrl) {
    return [];
  }

  try {
    const response = await fetch(new URL(`/api/public/${path}`, cmsApiUrl), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CmsListResponse<T>;

    return data.items ?? [];
  } catch {
    return [];
  }
}
