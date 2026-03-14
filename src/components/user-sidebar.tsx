"use client";

import * as React from "react";
import { GalleryVerticalEnd, HomeIcon, PieChart, Settings } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getUserVerifiedSession } from "@/lib/auth/session/dal.client.service";
import { redirect } from "next/navigation";
import { User } from "@/lib/user/models/user.model";
import { ROUTES } from "@/utils/routes";
import SidebarSkeleton from "./ui/sidebar-skeleton";
import { NavMainUser } from "./nav-main-user";

const { USER_ACCOUNT, PRODUCTS, CATEGORIES } = ROUTES;

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
      url: USER_ACCOUNT,
      icon: HomeIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "update profile",
          url: `${USER_ACCOUNT}${CATEGORIES}`,
        },
        {
          title: "change password",
          url: `${USER_ACCOUNT}${PRODUCTS}`,
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

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [auth, setAuth] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAuthData = async () => {
      try {
        // Only fetch user if session is valid
        const response = await getUserVerifiedSession();

        if (!response.ok) {
          redirect("/sign-in?callbackUrl=/account");
        }
        setAuth(response.data);
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMainUser items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
