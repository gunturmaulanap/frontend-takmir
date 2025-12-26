import { z } from "zod";

export const staffScheduleSchema = z.object({
  tanggal: z.string().min(1, "Tanggal harus dipilih"),
  imam_id: z.number().min(1, "Imam harus dipilih"),
  khatib_id: z.number().min(1, "Khatib harus dipilih"),
  muadzin_id: z.number().min(1, "Muadzin harus dipilih"),
  tema_khutbah: z.string().min(1, "Tema khutbah harus diisi"),
  //   profile_masjid_id: z.number().optional(),
});

export type StaffScheduleFormValues = z.infer<typeof staffScheduleSchema>;
