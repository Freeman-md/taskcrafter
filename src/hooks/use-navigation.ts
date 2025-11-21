import {
  IconActivity,
  IconCode,
  IconDashboard,
  IconListDetails,
  IconTargetArrow,
  type Icon,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"

interface NavigationItem {
  title: string
  url: string
  icon?: Icon
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
  {
    title: "Goal Planner",
    url: "/goal-planner",
    icon: IconTargetArrow,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: IconListDetails,
  },
]

const pageInfo: Record<
  string,
  {
    title: string
    subtitle?: string
  }
> = {
  "/": {
    title: "Dashboard",
    subtitle: "Track goals, progress, and the latest activity",
  },
  "/goals": {
    title: "Goals",
    subtitle: "Review all your goals",
  },
  "/goals/[id]": {
    title: "Goal Details",
    subtitle: "View the full plan for this goal",
  },
}

function getActiveKey(path: string | null) {
  if (!path) return "/";

  if (path.startsWith("/goals/") && path !== "/goals") {
    return "/goals/[id]";
  }

  return path;
}


export function useNavigation() {
  const pathname = usePathname()

  const activeKey = useMemo(() => getActiveKey(pathname), [pathname]);

  const { title, subtitle } = pageInfo[activeKey] ?? pageInfo["/"];

  const isActive = useCallback(
    (url: string) => {
      const key = getActiveKey(url);
      return key === activeKey;
    },
    [activeKey]
  );

  return {
    items: navigationItems,
    activeKey,
    pageTitle: title,
    pageSubtitle: subtitle,
    isActive,
  }
}
