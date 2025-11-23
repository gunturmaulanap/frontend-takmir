import { z } from "zod";

// ✅ Validasi untuk password yang kuat
const passwordSchema = z.string().min(6, "Password minimal 6 karakter");
//   .regex(/[A-Z]/, "Password harus mengandung huruf besar")
//   .regex(/[a-z]/, "Password harus mengandung huruf kecil")
//   .regex(/[0-9]/, "Password harus mengandung angka")
//   .regex(/[@$!%*?&]/, "Password harus mengandung karakter spesial (@$!%*?&)");

// ✅ Validasi username (sesuai backend yang pakai username)
const usernameSchema = z
  .string()
  .min(3, "Username minimal 3 karakter")
  .max(50, "Username maksimal 50 karakter")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username hanya boleh mengandung huruf, angka, dan underscore"
  )
  .transform((val) => val.toLowerCase().trim());

// ✅ Validasi nomor telepon Indonesia
const phoneSchema = z
  .string()
  .min(10, "Nomor handphone minimal 10 digit")
  .max(15, "Nomor handphone maksimal 15 digit")
  .regex(
    /^(^08|\+62)[0-9]+$/,
    "Format nomor handphone tidak valid. Gunakan format 08xxx atau +62xxx"
  );

export const takmirSchema = z
  .object({
    // ✅ Data User yang akan dibuat otomatis oleh backend
    nama: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .max(100, "Nama lengkap maksimal 100 karakter"),

    username: usernameSchema,
    password: passwordSchema,
    confirm_password: z.string(),

    // ✅ Data Takmir
    no_handphone: phoneSchema,

    umur: z
      .number()
      .min(17, "Umur minimal 17 tahun")
      .max(100, "Umur maksimal 100 tahun"),

    jabatan: z
      .string()
      .min(2, "Jabatan minimal 2 karakter")
      .max(100, "Jabatan maksimal 100 karakter"),

    deskripsi_tugas: z
      .string()
      .min(10, "Deskripsi tugas minimal 10 karakter")
      .max(1000, "Deskripsi tugas maksimal 1000 karakter"),

    // ✅ Optional fields
    email: z
      .string()
      .email("Format email tidak valid")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirm_password, {
    message: "Password dan konfirmasi password harus sama",
    path: ["confirm_password"],
  });

// ✅ Export types untuk React Hook Form
export type TakmirFormValues = z.infer<typeof takmirSchema>;

// ✅ Schema untuk update (simplified untuk fix validation issues)
export const takmirUpdateSchema = z.object({
  // ✅ Data Takmir ONLY (sesuai backend UpdateTakmirRequest)
  nama: z
    .string()
    .min(1, "Nama takmir wajib diisi")
    .max(255, "Nama takmir maksimal 255 karakter"),

  no_handphone: z.string().optional(),

  umur: z
    .any()
    .refine((val) => {
      // Convert input value ke number untuk validasi
      let numValue;
      if (typeof val === 'string') {
        if (val.trim() === '') return false; // Required field
        numValue = parseInt(val, 10);
      } else if (typeof val === 'number') {
        numValue = val;
      } else {
        return false;
      }

      return !isNaN(numValue) && numValue >= 17 && numValue <= 120;
    }, {
      message: "Umur minimal 17 tahun",
    })
    .transform((val) => {
      // Convert ke number untuk output
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    }),

  jabatan: z
    .string()
    .min(1, "Jabatan wajib diisi")
    .max(255, "Jabatan maksimal 255 karakter"),

  deskripsi_tugas: z.string().optional(),

  is_active: z.boolean().optional(),
});

export type TakmirUpdateFormValues = z.infer<typeof takmirUpdateSchema>;

export const userAccountEditSchema = z
  .object({
    username: usernameSchema.optional(),
    email: z.string().email("Format email tidak valid").optional(),

    // Password fields optional - backend akan update hanya jika ada dan tidak kosong
    password: z.string().optional(),

    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validasi: jika password diisi, minimal 6 karakter dan password_confirmation harus sama
      if (data.password && data.password.trim() !== "") {
        if (data.password.length < 6) {
          return false; // Akan ditangkap oleh custom error
        }
        return data.password_confirmation === data.password;
      }
      // Jika password kosong, tidak perlu validasi password_confirmation
      return true;
    },
    {
      message: "Password confirmation does not match.",
      path: ["password_confirmation"],
    }
  )
  .refine(
    (data) => {
      // Custom error untuk minimal length
      if (
        data.password &&
        data.password.trim() !== "" &&
        data.password.length < 6
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Password minimal 6 karakter.",
      path: ["password"],
    }
  );

export type UserAccountEditFormValues = z.infer<typeof userAccountEditSchema>;
