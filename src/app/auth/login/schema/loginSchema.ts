import { z } from "zod";

export const loginSchema = z.object({
  id: z
    .string()
    .min(1, "Email atau username wajib diisi")
    .refine((val) => {
      // Allow either email or username
      const isEmail = z.string().email().safeParse(val).success;
      const isUsername = val.length >= 3;
      return isEmail || isUsername;
    }, "Email atau username tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
