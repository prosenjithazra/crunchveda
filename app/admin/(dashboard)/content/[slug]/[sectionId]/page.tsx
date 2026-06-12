import AdminContentSectionManager from "@/components/AdminComponents/AdminContentSectionManager";

export default async function AdminContentSectionPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;

  return <AdminContentSectionManager moduleId={slug} sectionId={sectionId} />;
}
