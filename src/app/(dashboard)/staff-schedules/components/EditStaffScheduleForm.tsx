"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StaffScheduleFormValues,
  staffScheduleSchema,
} from "../schema/staffScheduleSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaCalendarAlt, FaBook, FaSave, FaTimes } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineSpeakerphone } from "react-icons/hi";
import { MdOutlineMenuBook } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

import {
  useUpdateStaffSchedule,
  useGetStaffScheduleById,
  useStaffSchedules,
} from "@/hooks/useStaffSchedules";

// Helper function untuk konversi tanggal
const formatTanggalForForm = (tanggal: string): string => {
  if (!tanggal) return "";

  // Handle berbagai format tanggal yang mungkin dari API
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
};
import { useImams } from "@/hooks/useImams";
import { useKhatibs } from "@/hooks/useKhatibs";
import { useMuadzins } from "@/hooks/useMuadzins";

interface EditStaffScheduleFormProps {
  id: number;
}

export default function EditStaffScheduleForm({
  id,
}: EditStaffScheduleFormProps) {
  const router = useRouter();

  const {
    data: staffSchedule,
    isLoading: isLoadingSchedule,
    isError,
  } = useGetStaffScheduleById(id);

  const { data: paginatedImams } = useImams();

  const imams = paginatedImams?.data || [];

  const { data: paginatedKhatibs } = useKhatibs();

  const khatibs = paginatedKhatibs?.data || [];

  const { data: paginatedMuadzins } = useMuadzins();

  const muadzins = paginatedMuadzins?.data || [];

  // ✅ Get existing schedules for date validation (excluding current schedule)
  const { data: existingSchedulesData } = useStaffSchedules(1, 1000);
  const existingSchedules =
    existingSchedulesData?.data?.filter((schedule) => schedule.id !== id) || [];

  const { mutate: updateStaffSchedule, isPending } = useUpdateStaffSchedule();

  // Function to check if a date is already taken (excluding current schedule)
  const isDateTaken = (date: string): boolean => {
    return existingSchedules.some((schedule) => {
      const scheduleDate = schedule.tanggal.split("T")[0];
      return scheduleDate === date;
    });
  };

  // Function to set minimum date to today
  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const form = useForm<StaffScheduleFormValues>({
    resolver: zodResolver(staffScheduleSchema),
    defaultValues: {
      tanggal: "",
      imam_id: 0,
      khatib_id: 0,
      muadzin_id: 0,
      tema_khutbah: "",
    },
  });

  const onSubmit = async (data: StaffScheduleFormValues) => {
    try {
      // Format tanggal untuk API (jika perlu)
      const submitData = {
        ...data,
        tanggal: data.tanggal, // HTML date input sudah dalam format yyyy-MM-dd
      };

      toast.loading("Menyimpan perubahan jadwal petugas...", {
        id: "update-staff-schedule",
      });

      // ✅ Update staff schedule
      updateStaffSchedule({
        id: id,
        data: submitData,
      });

      toast.success("Jadwal petugas berhasil diperbarui!", {
        id: "update-staff-schedule",
      });
      router.push("/staff-schedules/main");
    } catch (error: any) {
      console.error("❌ Error updating staff schedule:", error);

      // Extract error message untuk user feedback
      const errorMessage =
        error?.message ||
        "Gagal memperbarui jadwal petugas. Silakan coba lagi.";

      toast.error(errorMessage, {
        id: "update-staff-schedule",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (staffSchedule) {
      form.reset({
        tanggal: formatTanggalForForm(staffSchedule.tanggal),
        imam_id: staffSchedule.imam?.id || 0,
        khatib_id: staffSchedule.khatib?.id || 0,
        muadzin_id: staffSchedule.muadzin?.id || 0,
        tema_khutbah: staffSchedule.tema_khutbah || "",
      });
    }
  }, [staffSchedule, form]);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Jadwal Petugas
          </h1>
          <p className="text-gray-600 mt-2">Perbarui jadwal petugas masjid</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tanggal - Enabled untuk edit dengan validasi */}
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaCalendarAlt className="mr-2 text-emerald-600" />
                    Tanggal Jadwal <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={getMinDate()}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        if (isDateTaken(selectedDate)) {
                          form.setError("tanggal", {
                            message:
                              "Tanggal ini sudah digunakan untuk jadwal lain",
                          });
                        } else {
                          form.clearErrors("tanggal");
                          field.onChange(selectedDate);
                        }
                      }}
                      className="focus:ring-2 focus:ring-emerald-500"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih tanggal yang tidak bentrok dengan jadwal lain
                  </p>
                </FormItem>
              )}
            />

            {/* Staff Selection - Imam, Khatib, Muadzin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Imam */}
              <FormField
                control={form.control}
                name="imam_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center">
                      <MdOutlineMenuBook className="mr-2 text-emerald-600" />
                      Imam <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="0">Pilih Imam</option>
                        {imams.map((imam) => (
                          <option key={imam.id} value={imam.id}>
                            {imam.nama}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Khatib */}
              <FormField
                control={form.control}
                name="khatib_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center">
                      <HiOutlineShieldCheck className="mr-2 text-emerald-600" />
                      Khatib <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="0">Pilih Khatib</option>
                        {khatibs.map((khatib) => (
                          <option key={khatib.id} value={khatib.id}>
                            {khatib.nama}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Muadzin */}
              <FormField
                control={form.control}
                name="muadzin_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center">
                      <HiOutlineSpeakerphone className="mr-2 text-emerald-600" />
                      Muadzin <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="0">Pilih Muadzin</option>
                        {muadzins.map((muadzin) => (
                          <option key={muadzin.id} value={muadzin.id}>
                            {muadzin.nama}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tema Khutbah */}
            <FormField
              control={form.control}
              name="tema_khutbah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaBook className="mr-2 text-emerald-600" />
                    Tema Khutbah <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan tema khutbah untuk jadwal ini..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/staff-schedules/main")}
                className="flex-1 h-12"
                disabled={isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Perbarui Jadwal
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
