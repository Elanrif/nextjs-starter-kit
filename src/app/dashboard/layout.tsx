import DashboardHeader from "@/components/kickstart/dashboard/dashboard-header";
import Sidebar from "@/components/kickstart/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />
        <main className="min-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
