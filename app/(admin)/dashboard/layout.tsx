import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 pt-16">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <DashboardNav />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}