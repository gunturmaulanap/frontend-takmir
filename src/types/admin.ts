export interface Admin {
  id: number;
  name: string;
  username: string;
  email: string;
  is_active: boolean; // Status aktif admin
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  profileMasjid?: AdminProfileMasjid;
  roles?: AdminRole[];
}

export interface AdminProfileMasjid {
  id: number;
  user_id: number;
  nama: string;
  slug: string;
  alamat: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  laravel_through_key?: number;
}

export interface AdminRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUpdateValues {
  name: string;
  email: string;
  username: string;
  password?: string;
  password_confirmation?: string;
  profile_masjid_id?: number | null;
  is_active?: boolean;
}
