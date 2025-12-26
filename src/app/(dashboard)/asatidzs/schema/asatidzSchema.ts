import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the form values type explicitly
export type AsatidzFormValues = {
  nama: string;
  no_handphone: string;
  umur: string;
  jenis_kelamin: "Laki-laki" | "Perempuan" | "";
  keahlian: string;
  keterangan: string;
  alamat: string;
  murid_ids?: number[];
};

// Create schema with string umur validation
export const asatidzSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama asatidz wajib diisi")
    .max(255, "Nama asatidz maksimal 255 karakter"),
  no_handphone: z.string().max(15, "Nomor handphone maksimal 15 karakter"),
  alamat: z.string().max(1000, "Alamat maksimal 1000 karakter"),
  umur: z.string().refine((val) => {
    if (val === '' || val === undefined) return true;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1 && num <= 150;
  }, "Umur harus antara 1 dan 150 tahun"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan", ""], {
    message: "Jenis kelamin wajib dipilih",
  }),
  keahlian: z.string().max(255, "Keahlian maksimal 255 karakter"),
  keterangan: z.string().max(1000, "Keterangan maksimal 1000 karakter"),
  murid_ids: z.array(z.number()).optional(),
});

// Infer type from schema to ensure consistency
export type AsatidzFormValuesInferred = z.infer<typeof asatidzSchema>;

