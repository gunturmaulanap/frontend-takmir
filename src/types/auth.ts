export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: string; // Single role from backend
  roles: string[]; // ['admin', 'staff', 'jamaah']
  permissions: string[]; // ['view-calenders', 'create-events', ...]
  profile_masjid?: MosqueProfile; // Profile masjid jika user adalah takmir/admin
}

export interface MosqueProfile {
  id: number;
  user_id: number;
  nama: string; // Nama masjid (sesuai database)
  slug: string;
  alamat: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  laravel_through_key?: number;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export type UserRole = "superadmin" | "admin" | "takmir";

// Dashboard routes untuk setiap role
export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  superadmin: "/dashboard/superadmin",
  admin: "/dashboard/admin",
  takmir: "/dashboard/takmir",
};
