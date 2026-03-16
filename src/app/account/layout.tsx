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
import { getUserVerifiedSession } from "@/lib/auth/session/dal.service";
import { ROUTES } from "@/utils/routes";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getUserVerifiedSession();

  if (!auth.ok) {
    redirect("/sign-in?callbackUrl=/account");
  }

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset className="bg-[#faf7f0] bg-[linear-gradient(rgba(139,115,85,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(139,115,85,0.08)_1px,transparent_1px)] bg-size-[32px_32px]">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link href={ROUTES.USER_ACCOUNT}>
                    <HomeIcon href={ROUTES.HOME} size={18} />
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-16 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
