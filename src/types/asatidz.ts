export interface Asatidz {
  id: number;
  nama: string;
  slug: string;
  no_handphone: string | null;
  alamat: string | null;
  umur: number | null;
  jenis_kelamin: "Laki-laki" | "Perempuan" | null;
  keahlian: string | null;
  keterangan: string | null;
  jumlah_murid_tpq: number;
  murid?: MuridTPQ[];
  profile_masjid_id: number;
  created_at: string;
  updated_at: string;
}

export interface MuridTPQ {
  id: number;
  nama: string;
  no_handphone: string | null;
  umur: number | null;
  jenis_kelamin: "Laki-laki" | "Perempuan" | null;
  aktivitas_jamaah: string;
}
