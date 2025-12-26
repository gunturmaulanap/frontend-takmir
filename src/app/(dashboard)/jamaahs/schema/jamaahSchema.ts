import { z } from "zod";

// Define the form values type explicitly to avoid schema inference issues
export interface JamaahFormValues {
  nama: string;
  no_handphone: string;
  umur: string; // Keep as string to handle input consistently
  aktivitas_jamaah: string[];
  alamat: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
}

// Create schema with string umur validation (no transformation)
export const jamaahSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  no_handphone: z
    .string()
    .min(10, "Nomor handphone minimal 10 digit")
    .max(15, "Nomor handphone maksimal 15 digit")
    .regex(
      /^(^08|\+62)[0-9]+$/,
      "Format nomor handphone tidak valid. Gunakan format 08xxx atau +62xxx"
    ),
  umur: z
    .string()
    .min(1, "Umur wajib diisi")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 17 && num <= 120;
    }, "Umur harus antara 17 dan 120 tahun"),
  aktivitas_jamaah: z
    .array(z.string())
    .min(1, "Pilih minimal 1 aktivitas jamaah"),
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(10, "Alamat minimal 10 karakter")
    .max(1000, "Alamat maksimal 100 karakter"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Jenis kelamin wajib dipilih",
  }),
});
