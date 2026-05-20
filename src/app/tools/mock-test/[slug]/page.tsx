import MockTestDetailsClient from "@/components/MockTestDetailsClient";

export default async function ToolsMockTestSlugDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <MockTestDetailsClient slug={resolvedParams.slug} />;
}
