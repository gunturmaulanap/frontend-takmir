/**
 * ============================================
 * EVENT VALIDATION SCHEMA
 * ============================================
 * Schema Zod untuk validasi form Event
 *
 * Ada 2 schema:
 * 1. eventSchema - untuk CREATE (image WAJIB)
 * 2. eventEditSchema - untuk EDIT (image OPTIONAL)
 */

import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * ============================================
 * SCHEMA CREATE EVENT (Image WAJIB)
 * ============================================
 * Digunakan di: /events/create/page.tsx
 */
export const eventSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama event wajib diisi")
    .max(200, "Nama event maksimal 200 karakter"),
  deskripsi: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  category_id: z.number().min(1, "Kategori wajib dipilih"),
  tanggal_event: z
    .string()
    .min(1, "Tanggal event wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
  waktu_event: z
    .string()
    .min(1, "Waktu event wajib diisi")
    .regex(/^\d{2}:\d{2}$/, "Format waktu tidak valid (HH:MM)"),
  tempat_event: z
    .string()
    .min(1, "Tempat event wajib diisi")
    .max(255, "Tempat event maksimal 255 karakter"),
  image: z
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
});

/**
 * ============================================
 * SCHEMA EDIT EVENT (Image CONDITIONAL)
 * ============================================
 * Digunakan di: /events/edit/[slug]/page.tsx
 *
 * Image WAJIB jika tidak ada existing image
 * Image OPTIONAL jika existing image masih ada
 */
export const eventEditSchema = z
  .object({
    nama: z
      .string()
      .min(1, "Nama event wajib diisi")
      .max(200, "Nama event maksimal 200 karakter"),
    deskripsi: z
      .string()
      .min(1, "Deskripsi wajib diisi")
      .max(1000, "Deskripsi maksimal 1000 karakter"),
    category_id: z.number().min(1, "Kategori wajib dipilih"),
    tanggal_event: z
      .string()
      .min(1, "Tanggal event wajib diisi")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
    waktu_event: z
      .string()
      .min(1, "Waktu event wajib diisi")
      .regex(/^\d{2}:\d{2}$/, "Format waktu tidak valid (HH:MM)"),
    tempat_event: z
      .string()
      .min(1, "Tempat event wajib diisi")
      .max(255, "Tempat event maksimal 255 karakter"),
    image: z
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
      .optional(), // Image optional by default
    // Flag untuk tracking apakah ada gambar lama
    _hasOldImage: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // ✅ Perbaikan logic validasi:
      // - Jika ada gambar lama DAN tidak ada gambar baru yang diupload: valid (keep existing)
      // - Jika ada gambar lama DAN upload gambar baru: valid (replace)
      // - Jika tidak ada gambar lama DAN tidak upload gambar baru: INVALID (harus upload)
      // - Jika tidak ada gambar lama DAN upload gambar baru: valid (new image)

      const hasOldImage = data._hasOldImage === true;
      const hasNewImage = data.image !== undefined;

      console.log("🔍 Schema Validation DEBUG:", {
        hasOldImage,
        hasNewImage,
        _hasOldImage: data._hasOldImage,
        image: data.image,
        isValid: hasOldImage || hasNewImage,
      });

      // Valid jika ada gambar lama ATAU upload gambar baru
      return hasOldImage || hasNewImage;
    },
    {
      message: "Gambar event wajib diunggah.",
      path: ["image"],
    }
  );

export type EventFormValues = z.infer<typeof eventSchema>;
export type EventEditFormValues = z.infer<typeof eventEditSchema>;
