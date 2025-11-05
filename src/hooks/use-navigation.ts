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
    title: "Plan Details",
    url: "/plan-details",
    icon: IconListDetails,
  },
  {
    title: "JSON Viewer",
    url: "/json-viewer",
    icon: IconCode,
  },
  {
    title: "Activity & Logs",
    url: "/activity",
    icon: IconActivity,
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
  "/goal-planner": {
    title: "Goal Planner",
    subtitle: "Create structured plans with AI assistance",
  },
  "/plan-details": {
    title: "Plan Details",
    subtitle: "Review AI-generated plans at a glance",
  },
  "/json-viewer": {
    title: "JSON Viewer",
    subtitle: "Inspect the raw plan responses and debug fast",
  },
  "/activity": {
    title: "Activity & Logs",
    subtitle: "Review the latest progress and updates",
  },
}

function getActiveSegment(path: string | null) {
  if (!path) return "/"
  const [cleanPath] = path.split("?")
  const segments = cleanPath.split("/").filter(Boolean)
  const last = segments.at(-1)?.toLowerCase()
  return last ? `/${last}` : "/"
}

export function useNavigation() {
  const pathname = usePathname()

  const activeSegment = useMemo(() => getActiveSegment(pathname), [pathname])

  const { title, subtitle } = useMemo(() => {
    const entry = pageInfo[activeSegment] ?? pageInfo[pathname ?? ""] ?? pageInfo["/"] ?? {}
    return {
      title: entry?.title ?? "",
      subtitle: entry?.subtitle ?? "",
    }
  }, [activeSegment, pathname])

  const isActive = useCallback(
    (url: string) => getActiveSegment(url) === activeSegment,
    [activeSegment],
  )

  return {
    items: navigationItems,
    activeSegment,
    pageTitle: title,
    pageSubtitle: subtitle,
    isActive,
  }
}
