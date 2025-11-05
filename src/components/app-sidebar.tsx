"use client"

import * as React from "react"
import {
  IconDashboard,
  IconListDetails,
  IconSettings,
  IconActivity,
  IconCode,
  IconSpiral,
  IconLogout,
  IconWriting,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Goal Planner",
      url: "#",
      icon: IconSpiral,
    },
    {
      title: "Plan Details",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "JSON Viewer",
      url: "#",
      icon: IconCode,
    },
    {
      title: "Activity & Logs",
      url: "#",
      icon: IconActivity,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      key: "settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Logout",
      key: "logout",
      url: "#",
      icon: IconLogout,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const navUser = {
    name: user?.fullName ?? 'N/A',
    email: user?.emailAddresses[0].emailAddress ?? 'N/A',
    avatar: user?.imageUrl ?? "/avatars/shadcn.jpg"
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconWriting className="!size-5" />
                <span className="text-base font-semibold">Task Crafter</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
