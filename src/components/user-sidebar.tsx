"use client";

import * as React from "react";
import { GalleryVerticalEnd, HomeIcon, PieChart, Settings } from "lucide-react";

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

const { MY_ACCOUNT, VIEW_PROFILE, EDIT_PROFILE, CHANGE_PASSWORD } = ROUTES;

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
      url: MY_ACCOUNT,
      icon: HomeIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "View profile",
          url: `${VIEW_PROFILE}`,
        },
        {
          title: "Edit profile",
          url: `${EDIT_PROFILE}`,
        },
        {
          title: "Change password",
          url: `${CHANGE_PASSWORD}`,
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

  const UserSidebarColors = {
    main: "bg-gray-50/20",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={` ${UserSidebarColors.main}`}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className={` ${UserSidebarColors.main}`}>
        <NavMainUser items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className={` ${UserSidebarColors.main}`}>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
