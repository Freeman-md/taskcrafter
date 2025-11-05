import { SectionCards } from "@/components/dashboard/section-cards";

import ActiveGoals from "@/components/dashboard/active-goals";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <ActiveGoals />
      <RecentActivity />
    </div>
  );
}
