import { redirect } from "next/navigation";
import { adminContentService } from "@/services/admin/contentService";

export default async function AdminContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const moduleData = await adminContentService.getModuleById(slug);
    if (moduleData && moduleData.records && moduleData.records.length > 0) {
      redirect(`/admin/content/${slug}/${moduleData.records[0].id}`);
    }
  } catch (error) {
    console.error("Failed to redirect to first section:", error);
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>No sections found in this module.</h2>
    </div>
  );
}
