export interface Imam {
  id: number;
  nama: string;
  no_handphone: string;
  alamat: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface Khatib {
  id: number;
  nama: string;
  no_handphone: string;
  alamat: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface Muadzin {
  id: number;
  nama: string;
  no_handphone: string;
  alamat: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface StaffSchedule {
  id: number;
  tanggal: string; // API returns as string
  imam: Imam;
  khatib: Khatib;
  muadzin: Muadzin;
  tema_khutbah: string;
  profile_masjid_id: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  slug: string;
}

