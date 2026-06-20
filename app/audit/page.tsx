import { PageContainer, PageHeader } from "@/components/shared/page-container";

export default function AuditPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Audit"
        description="Workload concentration and override trends by team and manager."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Capacity & override analytics charts — built in the audit section.
      </div>
    </PageContainer>
  );
}
