import Link from "next/link";

import {
  IconAlertTriangle,
  IconCircleCheckFilled,
  IconPlus,
} from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Activity } from "@/types/activity";

interface ActivityItemProps {
  activity: Activity;
}

const activities: Activity[] = [
  {
    id: "activity-1",
    type: "completed",
    title: 'Task completed: "Design system documentation"',
    detail: "Launch Mobile App • 2 hours ago",
  },
  {
    id: "activity-2",
    type: "new-goal",
    title: 'New goal created: "Q1 Marketing Campaign"',
    detail: "Generated 12 tasks • 5 hours ago",
  },
  {
    id: "activity-3",
    type: "deadline",
    title: 'Deadline approaching: "User testing phase"',
    detail: "Team Onboarding • Due in 2 days",
  },
];

function ActivityItem({ activity }: ActivityItemProps) {
  const iconConfig = getIconConfig(activity.type);
  const IconComponent = iconConfig.icon;

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        aria-hidden
        className={cn(
          "flex size-9 items-center justify-center rounded-full text-base",
          iconConfig.background,
          iconConfig.color
        )}
      >
        <IconComponent className="size-4" stroke={2} />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium text-foreground md:text-base">
          {activity.title}
        </p>
        <p className="text-sm text-muted-foreground">{activity.detail}</p>
      </div>
    </li>
  );
}

function getIconConfig(type: Activity["type"]) {
  switch (type) {
    case "completed":
      return {
        icon: IconCircleCheckFilled,
        background: "bg-emerald-500/10 dark:bg-emerald-500/20",
        color: "text-emerald-500 dark:text-emerald-400",
      };
    case "new-goal":
      return {
        icon: IconPlus,
        background: "bg-primary/10 dark:bg-primary/20",
        color: "text-primary",
      };
    case "deadline":
      return {
        icon: IconAlertTriangle,
        background: "bg-amber-500/10 dark:bg-amber-500/20",
        color: "text-amber-500 dark:text-amber-400",
      };
    default:
      return {
        icon: IconPlus,
        background: "bg-muted",
        color: "text-muted-foreground",
      };
  }
}

export default function RecentActivity() {
  return (
    <section className="flex flex-col gap-5 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          Recent Activity
        </h2>
        <Link
          href="#"
          className="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          View All
        </Link>
      </div>
      <Card>
        <CardContent className="px-6 py-4">
          <ul className="divide-y divide-border/60">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
