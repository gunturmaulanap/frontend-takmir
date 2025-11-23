import DynamicSidebarLayout from "@/components/layouts/DynamicSidebarLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Dashboard - Sistem Manajemen Masjid",
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DynamicSidebarLayout>{children}</DynamicSidebarLayout>;
}
