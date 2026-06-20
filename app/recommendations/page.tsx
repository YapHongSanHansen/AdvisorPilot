import { PageContainer, PageHeader } from "@/components/shared/page-container";

export default function RecommendationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Recommendations"
        description="Top three candidates with scores, risks, and plain-language reasons."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Ranked candidate cards with score breakdowns and accept / override — built in the
        scoring &amp; decision sections.
      </div>
    </PageContainer>
  );
}
