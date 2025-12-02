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
  imam: Imam;
  tema_khutbah: string;
  khatib: Khatib;
  muadzin: Muadzin;
  created_at: string;
  updated_at: string;
  slug: string;
  tanggal: string;
  id: number;
}
