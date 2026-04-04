"use client";

import * as React from "react";
import { HomeIcon, LayoutGrid, Users, MessageSquare, FileText } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/utils/routes";
import { useSession } from "@/lib/auth/context/auth.user.context";

const { DASHBOARD, COMMENTS, POSTS, USERS } = ROUTES;

const data = {
  teams: [
    {
      name: "Espace Admin",
      logo: LayoutGrid,
      plan: "Gestion de la boutique",
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: DASHBOARD,
      icon: HomeIcon,
    },
    {
      title: "Boutique",
      url: "#",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Utilisateurs",
          url: `${DASHBOARD}${USERS}`,
          icon: Users,
        },
        {
          title: "Posts",
          url: `${DASHBOARD}${POSTS}`,
          icon: FileText,
        },
        {
          title: "Commentaires",
          url: `${DASHBOARD}${COMMENTS}`,
          icon: MessageSquare,
        },
      ],
    },
  ],
};

const sidebarBg = "bg-slate-950 text-white";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession();
  if (!user) return null;

  return (
    <Sidebar collapsible="icon" {...props} className={sidebarBg}>
      <SidebarHeader className={sidebarBg}>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarSeparator className="bg-white/5 mx-3" />

      <SidebarContent className={sidebarBg}>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarSeparator className="bg-white/5 mx-3" />

      <SidebarFooter className={sidebarBg}>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
