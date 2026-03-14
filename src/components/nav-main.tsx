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
                      item.isActive ? "bg-purple-100/60 text-purple-900" : ""
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
                              ? "bg-blue-100/60 text-blue-900"
                              : ""
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
                      item.isActive ? "bg-purple-100/60 text-purple-900" : ""
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
