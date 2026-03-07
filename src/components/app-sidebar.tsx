"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
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

const { DASHBOARD, PRODUCTS, CATEGORIES, USERS} = ROUTES;

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
      title: "Store",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Categories",
          url: CATEGORIES,
        },
        {
          title: "Products",
          url: PRODUCTS,
        },
        {
          title: "Users",
          url: USERS,
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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
        const authData = await getUserVerifiedSession();

        if ("error" in authData) {
          redirect("/sign-in?callbackUrl=/dashboard");
        }
        setAuth(authData);
      } catch (error) {
        console.error("Auth error:", error);
        redirect("/sign-in?callbackUrl=/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
