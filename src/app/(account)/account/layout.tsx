// TODO: delete src/app/account/layout.tsx (route group migration)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import { ROUTES } from "@/utils/routes";
import { Bell, HomeIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthUserProvider } from "@/lib/auth/context/auth.user.context";
import { auth } from "@/lib/auth/api/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await auth.api.getCurrentUser();

  if (!response.ok || !response.data) {
    redirect("/sign-in?callbackUrl=/account");
  }

  return (
    <AuthUserProvider user={response.data.user}>
      <SidebarProvider>
        <UserSidebar />
        <SidebarInset className="bg-[#faf7f0] bg-[linear-gradient(rgba(139,115,85,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(139,115,85,0.08)_1px,transparent_1px)] bg-size-[32px_32px]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-amber-100/60 bg-white/70 backdrop-blur-sm shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex flex-1 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <Link
                      href={ROUTES.MY_ACCOUNT}
                      className="text-amber-700/70 hover:text-amber-900 transition-colors"
                    >
                      <HomeIcon size={15} />
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-amber-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-gray-700">
                      Account
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 px-4">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-50 to-orange-50 border border-amber-100 text-amber-700 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Pro</span>
              </div>
              <button className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
              </button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-16 pt-0 mt-5">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthUserProvider>
  );
}
