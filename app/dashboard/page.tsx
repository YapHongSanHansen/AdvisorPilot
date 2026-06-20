import { PageContainer, PageHeader } from "@/components/shared/page-container";

const metrics = ["Headcount", "Available capacity", "Overloaded staff", "Open projects"];

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        description="Headcount, available capacity, overloaded staff, and workload distribution."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((label) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Metrics wire up in the data &amp; scoring sections.
      </p>
    </PageContainer>
  );
}
