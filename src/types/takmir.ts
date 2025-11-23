export interface Takmir {
  id: number;
  profile_masjid_id?: MosqueProfile;
  user?: User;
  nama: string;
  slug: string;
  username?: string;
  no_handphone: string;
  jabatan: string;
  deskripsi_tugas: string;
  umur: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
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

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_active?: boolean; // Status aktif user (backend updates this)
  role?: string; // Single role from backend
  roles: string[]; // ['admin', 'staff', 'jamaah']
  permissions: string[]; // ['view-calenders', 'create-events', ...]
  profile_masjid?: MosqueProfile; // Profile masjid jika user adalah takmir/admin
}

// ✅ Types untuk backend UpdateTakmirRequest
export interface TakmirUpdateValues {
  nama: string;
  no_handphone?: string;
  umur?: number;
  jabatan: string;
  deskripsi_tugas?: string;
  is_active?: boolean;
}

// ✅ Types untuk complete takmir + user update
export interface TakmirUpdateWithUserData {
  // Takmir data
  nama: string;
  no_handphone?: string;
  umur?: number;
  jabatan: string;
  deskripsi_tugas?: string;
  is_active?: boolean;
  // User data
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
// Extended type untuk update takmir + user data
export interface TakmirUpdateWithUserData {
  // Takmir data
  nama: string;
  no_handphone?: string;
  umur?: number;
  jabatan: string;
  deskripsi_tugas?: string;
  is_active?: boolean;
  // User data (optional - backend will process these)
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
