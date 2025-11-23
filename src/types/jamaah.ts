export interface ProfileMasjid {
  id: number;
  nama: string;
  slug: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Jamaah {
  id: number;
  profile_masjid_id: number;
  nama: string;
  no_handphone: string;
  umur: string;
  slug: string;
  alamat: string;
  jenis_kelamin: string;
  aktivitas_jamaah: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;

  profileMasjid?: ProfileMasjid;
  createdBy?: User;
  updatedBy?: User;
}
