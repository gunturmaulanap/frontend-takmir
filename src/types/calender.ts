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

export interface Calender {
  id: string;
  staff_schedule: StaffSchedule;
  type: "staff_schedule" | "event";
  event: Event;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  nama: string;
  slug: string;
  warna: string;
  deskripsi?: string;
  profile_masjid_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  category_id: number;
  profile_masjid_id: number;
  nama: string;
  slug: string;
  tanggal_event: string; // Format: YYYY-MM-DD
  waktu_event: string; // Format: HH:MM
  tempat_event: string; // Match backend fillable
  deskripsi: string;
  image: string;
  created_by: number;
  updated_by: number;
  category?: Category; // Relasi dengan category
  created_at: string;
  updated_at: string;
}
