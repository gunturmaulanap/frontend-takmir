import { z } from "zod";

// Backend Laravel expects these enum values
export const warnaOptions = [
  { value: "Blue" as const, label: "Biru", hex: "#3B82F6" },
  { value: "Green" as const, label: "Hijau", hex: "#10B981" },
  { value: "Purple" as const, label: "Ungu", hex: "#8B5CF6" },
  { value: "Orange" as const, label: "Oranye", hex: "#F97316" },
  { value: "Indigo" as const, label: "Indigo", hex: "#6366F1" },
];

export type WarnaValue = "Blue" | "Green" | "Purple" | "Orange" | "Indigo";

export const categorySchema = z.object({
  nama: z
    .string()
    .min(1, "Nama kategori wajib diisi")

    .max(100, "Nama kategori maksimal 100 karakter"),
  warna: z.enum(["Blue", "Green", "Purple", "Orange", "Indigo"], {
    message: "Pilih salah satu warna yang tersedia",
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
