"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // Determine active items based on current pathname
  const activeItems = items.map((item) => {
    const dashboardBase = ROUTES.DASHBOARD;

    // Exact Dashboard match
    if (item.url === dashboardBase && pathname === dashboardBase) {
      return { ...item, isActive: true };
    }

    // Store group match - active for any /dashboard/* except exact /dashboard
    if (
      item.url === "#" &&
      pathname.startsWith(dashboardBase) &&
      pathname !== dashboardBase
    ) {
      return { ...item, isActive: true };
    }

    return { ...item, isActive: false };
  });

  const navMainColors = {
    active: "bg-white/20 text-white/90 hover:bg-white/30 hover:text-white",
    inactive: "text-white/80 hover:bg-white/40 hover:text-white/90",
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {activeItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            {item.items && item.items?.length > 0 ? (
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      item.isActive
                        ? navMainColors.active
                        : navMainColors.inactive
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className="ml-auto transition-transform duration-200
                       group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            pathname.startsWith(subItem.url)
                              ? navMainColors.active
                              : navMainColors.inactive
                          }
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      item.isActive
                        ? navMainColors.active
                        : navMainColors.inactive
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
