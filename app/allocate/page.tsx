import { PageContainer, PageHeader } from "@/components/shared/page-container";
import { AllocationForm } from "@/components/allocation/allocation-form";

export default function AllocatePage() {
  return (
    <PageContainer>
      <PageHeader
        title="New allocation"
        description="Enter a project's requirements to rank eligible employees."
      />
      <AllocationForm />
    </PageContainer>
  );
}
