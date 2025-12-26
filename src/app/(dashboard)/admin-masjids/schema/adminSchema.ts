import * as z from "zod";

/**
 * Schema untuk validasi form Edit Admin
 * - Password bersifat opsional (hanya diisi jika ingin mengubah)
 * - Password konfirmasi harus cocok jika password diisi
 * - Minimal password 8 karakter
 */
export const adminSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .max(255, "Nama maksimal 255 karakter"),

    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),

    username: z
      .string()
      .min(1, "Username wajib diisi")
      .max(50, "Username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh mengandung huruf, angka, dan underscore"
      ),

    password: z
      .string()
      .min(8, "Password minimal 6 karakter")
      .max(255, "Password maksimal 255 karakter")
      .optional()
      .or(z.literal("")),

    password_confirmation: z.string().optional().or(z.literal("")),

    profile_masjid_id: z
      .number()
      .int("ID masjid harus berupa angka bulat")
      .positive("ID masjid harus berupa angka positif")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // Jika password diisi, password_confirmation harus juga diisi dan cocok
      if (data.password && data.password.trim() !== "") {
        return (
          data.password_confirmation === data.password.trim() &&
          data.password_confirmation.trim() !== ""
        );
      }
      return true;
    },
    {
      message: "Password konfirmasi harus cocok dengan password",
      path: ["password_confirmation"],
    }
  )
  .refine(
    (data) => {
      // Jika password_confirmation diisi, password harus juga diisi
      if (
        data.password_confirmation &&
        data.password_confirmation.trim() !== ""
      ) {
        return data.password && data.password.trim() !== "";
      }
      return true;
    },
    {
      message: "Password harus diisi jika konfirmasi password diisi",
      path: ["password"],
    }
  );

export type AdminFormData = z.infer<typeof adminSchema>;

/**
 * Schema untuk form Create Admin (password wajib)
 */
export const createAdminSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .max(255, "Nama maksimal 255 karakter"),

    email: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),

    username: z
      .string()
      .min(1, "Username wajib diisi")
      .max(50, "Username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh mengandung huruf, angka, dan underscore"
      ),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(255, "Password maksimal 255 karakter"),

    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),

    profile_masjid_id: z
      .number()
      .int("ID masjid harus berupa angka bulat")
      .positive("ID masjid harus berupa angka positif")
      .nullable()
      .optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password konfirmasi harus cocok dengan password",
    path: ["password_confirmation"],
  });

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
