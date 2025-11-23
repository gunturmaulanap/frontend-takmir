import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    email: z
      .string()
      .email("Email tidak valid")
      .max(100, "Email maksimal 100 karakter"),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Username maksimal 30 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh mengandung huruf, angka, dan underscore"
      ),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
    masjid_name: z
      .string()
      .min(1, "Nama masjid wajib diisi")
      .max(100, "Nama masjid maksimal 100 karakter"),
    masjid_address: z
      .string()
      .min(1, "Alamat masjid wajib diisi")
      .max(255, "Alamat masjid maksimal 255 karakter"),
    phone: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .max(15, "Nomor telepon maksimal 15 digit")
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh mengandung angka"),
    profile_picture: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: `Ukuran file maksimal 500KB. Periksa ukuran file Anda.`,
          })
          .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message:
              "Format gambar tidak valid. Hanya .jpg, .jpeg, .png, atau .webp yang diperbolehkan.",
          }),
        z.undefined(),
      ])
      .refine((file) => file !== undefined, {
        message: "Gambar wajib diunggah.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirmPassword"], // Menampilkan error pada field confirmPassword
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
