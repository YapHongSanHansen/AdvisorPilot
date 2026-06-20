import { PageContainer, PageHeader } from "@/components/shared/page-container";
import { ProfileDrafter } from "@/components/profile/profile-drafter";

export default function ProfilePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Work-style profile"
        description="Draft from approved work artifacts, edit, and approve. Only approved profiles affect scoring."
      />
      <ProfileDrafter />
    </PageContainer>
  );
}
