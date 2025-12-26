import DynamicSidebarLayout from "@/components/layouts/DynamicSidebarLayout";
import { DashboardGuard } from "@/components/auth/DashboardGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Dashboard - Sistem Manajemen Masjid",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardGuard>
      <DynamicSidebarLayout>{children}</DynamicSidebarLayout>
    </DashboardGuard>
  );
}
