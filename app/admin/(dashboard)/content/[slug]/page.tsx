import AdminContentManager from "@/components/AdminComponents/AdminContentManager";

export default async function AdminContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <AdminContentManager moduleId={slug} />;
}
