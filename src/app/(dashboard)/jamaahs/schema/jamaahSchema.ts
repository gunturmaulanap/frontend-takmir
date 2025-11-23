import { z } from "zod";

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
    .any()
    .refine(
      (val) => {
        // Convert input value ke number untuk validasi
        let numValue;
        if (typeof val === "string") {
          if (val.trim() === "") return false; // Required field
          numValue = parseInt(val, 10);
        } else if (typeof val === "number") {
          numValue = val;
        } else {
          return false;
        }

        return !isNaN(numValue) && numValue >= 17 && numValue <= 120;
      },
      {
        message: "Umur minimal 17 tahun",
      }
    )
    .transform((val) => {
      // Convert ke number untuk output
      if (typeof val === "string") {
        return parseInt(val, 10);
      }
      return val;
    }),
  aktivitas_jamaah: z
    .string()
    .min(1, "Aktivitas jamaah wajib diisi")
    .min(3, "Aktivitas minimal 3 karakter")
    .max(100, "Aktivitas jamaah maksimal 100 karakter"),
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(10, "Alamat minimal 10 karakter")
    .max(1000, "Alamat maksimal 100 karakter"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Jenis kelamin wajib dipilih",
  }),
});

export type JamaahFormValues = z.infer<typeof jamaahSchema>;
