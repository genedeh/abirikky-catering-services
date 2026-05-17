import { MenuPageView } from "@/views/menu/MenuPageView";

type MenuDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata = {
  title: "Menu Detail | Abirikky",
  description: "View an Abirikky catering menu item.",
};

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { slug } = await params;

  return <MenuPageView initialSlug={slug} />;
}
