import { AuthGuard } from "@/components/auth/AuthGuard";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Auth - Sistem Manajemen Masjid",
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
