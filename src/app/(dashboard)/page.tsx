import { SectionCards } from "@/features/dashboard/components/section-cards";

import RecentActivity from "@/features/dashboard/components/recent-activity";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <RecentActivity />
    </div>
  );
}
