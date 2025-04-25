import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/nav-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AxiosProvider } from "@/providers/axiosProvider";
import Providers from "@/providers/providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AxiosProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Navbar />
            <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </AxiosProvider>
    </Providers>
  );
}
