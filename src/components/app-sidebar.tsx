"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  HomeIcon,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { User } from "@/lib/users/models/user.model";
import { ROUTES } from "@/utils/routes";
import SidebarSkeleton from "./ui/sidebar-skeleton";
import { authClient } from "@/lib/auth/api/auth.client.service";

const { DASHBOARD, PRODUCTS, CATEGORIES, USERS } = ROUTES;

// This is sample data.
const data = {
  teams: [
    {
      name: "Nextjs Starter Kit",
      logo: GalleryVerticalEnd,
      plan: "Boilerplate",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: DASHBOARD,
      icon: HomeIcon,
    },
    {
      title: "Store",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Categories",
          url: `${DASHBOARD}${CATEGORIES}`,
        },
        {
          title: "Products",
          url: `${DASHBOARD}${PRODUCTS}`,
        },
        {
          title: "Users",
          url: `${DASHBOARD}${USERS}`,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [auth, setAuth] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAuthData = async () => {
      try {
        // Only fetch user if session is valid
        const response = await authClient.getCurrentUser();

        if (!response.ok) {
          redirect("/sign-in?callbackUrl=/account");
        }
        setAuth(response.data.user);
      } catch (error) {
        console.error("Auth error:", error);
        redirect("/sign-in?callbackUrl=/account");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthData();
  }, []);

  if (isLoading || !auth) {
    return <SidebarSkeleton {...props} />;
  }

  const AppSidebarColors = {
    main: "bg-black/90 text-white",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={` ${AppSidebarColors.main}`}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className={` ${AppSidebarColors.main}`}>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className={` ${AppSidebarColors.main}`}>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
