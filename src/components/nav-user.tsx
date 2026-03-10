"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, UserRole } from "@/lib/user/models/user.model";
import { SignOutButton } from "./kickstart/auth/SignOutButton";
import { useSession } from "@/hooks/use.session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";

function renderAccountMenuItem(user: User, pathname?: string | null) {
  // If user is missing, don't render
  if (!user) return null;

  // If user is non-admin and currently on /account, hide the dashboard link
  if (pathname?.startsWith("/account") && user.role !== UserRole.ADMIN) {
    return null;
  }

  // Default target based on role
  let target =
    user.role === UserRole.ADMIN ? ROUTES.DASHBOARD : ROUTES.USER_ACCOUNT;
  let label =
    user.role === UserRole.ADMIN ? "Admin dashboard" : "User dashboard";

  // If current pathname is under /dashboard, switch to account
  if (pathname?.startsWith("/dashboard")) {
    target = ROUTES.USER_ACCOUNT;
    label = "Profile";
  } else if (pathname?.startsWith("/account") && user.role === UserRole.ADMIN) {
    // If current pathname is under /account and user is admin, link to dashboard
    target = ROUTES.DASHBOARD;
    label = "Dashboard";
  }

  // Render the menu item. Use a single appropriate icon (UserIcon) instead of two icons.
  return (
    <DropdownMenuItem className="bg-blue-50">
      <Link href={target} className="flex items-center gap-2 w-full">
        {target === ROUTES.DASHBOARD ? <LayoutDashboard /> : <UserIcon />}
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

export function NavUser({ user }: { user: User }) {
  const { session, error, invalidate } = useSession();
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  if (!user || !session) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-linear-to-r from-slate-100 via-slate-200 to-slate-300 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.firstName} />
                <AvatarFallback className="rounded-lg">
                  {user.firstName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.firstName} />
                  <AvatarFallback className="rounded-lg">
                    {user.firstName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {renderAccountMenuItem(user, pathname)}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {session && !error && (
                <SignOutButton
                  variant="destructive"
                  className="w-full flex justify-center items-center"
                  onSignOut={invalidate}
                />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
