/**
 * ============================================
 * CATEGORY TYPE DEFINITIONS
 * ============================================
 * Interface untuk Category data structure
 * Sesuai dengan model Laravel backend
 */

export interface Category {
  id: number;
  nama: string;
  slug: string;
  warna: string;
  deskripsi?: string; // Optional karena bisa kosong
  profile_masjid_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  // Computed field dari backend
  count?: number; // Jumlah event menggunakan kategori ini
}

export interface CategoryStats {
  total: number;
  active: number;
  totalUsage: number;
}
