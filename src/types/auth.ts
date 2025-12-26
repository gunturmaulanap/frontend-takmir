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
  slug?: string;
  alamat: string;
  provinsi?: string;
  kota_kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  kode_pos?: string;
  telepon?: string;
  email?: string;
  website?: string;
  kapasitas_jamaah?: number;
  luas_tanah?: number;
  luas_bangunan?: number;
  tahun_berdiri?: number;
  nama_ketua?: string;
  telepon_ketua?: string;
  nama_bendahara?: string;
  telepon_bendahara?: string;
  nama_amar?: string;
  telepon_amar?: string;
  fax?: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
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
