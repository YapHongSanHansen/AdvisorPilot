import { PageContainer, PageHeader } from "@/components/shared/page-container";
import { RecommendationView } from "@/components/allocation/recommendation-view";

export default function RecommendationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Recommendations"
        description="Top candidates with scores, risks, and plain-language reasons."
      />
      <RecommendationView />
    </PageContainer>
  );
}
