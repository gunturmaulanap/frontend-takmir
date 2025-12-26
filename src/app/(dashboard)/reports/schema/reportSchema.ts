import { z } from "zod";

export const reportSchema = z.object({
  type: z.enum(["income", "expense"], {
    message: "Tipe transaksi wajib dipilih",
  }),
  kategori: z
    .string()
    .min(1, "Kategori wajib diisi")
    .max(100, "Kategori maksimal 100 karakter"),
  jumlah: z
    .string()
    .min(1, "Jumlah wajib diisi")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Jumlah harus berupa angka yang valid"),
  tanggal: z
    .string()
    .min(1, "Tanggal wajib dipilih")
    .refine((val) => !isNaN(Date.parse(val)), "Format tanggal tidak valid"),
  keterangan: z
    .string()
    .max(500, "Keterangan maksimal 500 karakter")
    .optional()
    .nullable(),
  bukti_transaksi: z
    .instanceof(File)
    .optional()
    .nullable()
    .or(z.literal(null)),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
