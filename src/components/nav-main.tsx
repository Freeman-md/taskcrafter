"use client";

import Link from "next/link";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/hooks/use-navigation";

export function NavMain() {
  const { items, isActive } = useNavigation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New Goal"
              className="min-w-8 bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              <IconCirclePlusFilled />
              <span>New Goal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map(({ title, url, icon: Icon }) => (
            <SidebarMenuItem key={url}>
              <SidebarMenuButton isActive={isActive(url)} asChild tooltip={title}>
                <Link href={url}>
                  {Icon && <Icon />}
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
