import { PageContainer, PageHeader } from "@/components/shared/page-container";

export default function AllocatePage() {
  return (
    <PageContainer>
      <PageHeader
        title="New allocation"
        description="Enter a project's requirements to rank eligible employees."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Requirement form — duration, required hours, skills, urgency, and preferred work
        style — built in the forms section.
      </div>
    </PageContainer>
  );
}
