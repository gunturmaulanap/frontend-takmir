export interface Masjid {
  id: number;
  user_id: number;
  nama: string;
  slug: string;
  alamat: string;
  image: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  user?: MasjidUser;
  createdBy?: UserBasic;
}

export interface MasjidUser {
  id: number;
  name: string;
  username: string;
  email: string;
  is_active: boolean; // Status aktif user (backend updates this)
  role?: string;
  roles: string[];
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
}

export interface MasjidUpdateValues {
  user_id: number;
  nama: string;
  alamat: string;
  image?: string | null;
  is_active?: boolean;
}
