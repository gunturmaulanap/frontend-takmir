import { z } from "zod";

export const imamSchema = z.object({
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
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .min(10, "Alamat minimal 10 karakter")
    .max(1000, "Alamat maksimal 100 karakter"),
});

export type ImamFormValues = z.infer<typeof imamSchema>;
