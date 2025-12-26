"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StaffScheduleFormValues,
  staffScheduleSchema,
} from "../schema/staffScheduleSchema";
import { useCreateStaffSchedule } from "@/hooks/useStaffSchedules";
import { useImams } from "@/hooks/useImams";
import { useKhatibs } from "@/hooks/useKhatibs";
import { useMuadzins } from "@/hooks/useMuadzins";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaCalendarAlt, FaBook, FaSave, FaTimes } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineSpeakerphone } from "react-icons/hi";
import { MdOutlineMenuBook } from "react-icons/md";
import { useStaffSchedules } from "@/hooks/useStaffSchedules";
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

// Helper function untuk konversi tanggal
const formatTanggalForForm = (tanggal: string): string => {
  if (!tanggal) return "";

  // Handle berbagai format tanggal yang mungkin dari API
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return "";

  return date.toISOString().split('T')[0];
};

export default function CreateStaffScheduleForm() {
  const router = useRouter();

  // ✅ Global state - Staff data dari Tanstack Query
  const { data: paginatedImamsData, isLoading: isLoadingImams } = useImams(
    1,
    100
  );
  const { data: paginatedKhatibsData, isLoading: isLoadingKhatibs } =
    useKhatibs(1, 100);
  const { data: paginatedMuadzinsData, isLoading: isLoadingMuadzins } =
    useMuadzins(1, 100);

  // ✅ Get existing schedules for date validation
  const { data: existingSchedulesData } = useStaffSchedules(1, 1000); // Get all schedules
  const existingSchedules = existingSchedulesData?.data || [];

  // Extract staff dari paginated response
  const imams = paginatedImamsData?.data || [];
  const khatibs = paginatedKhatibsData?.data || [];
  const muadzins = paginatedMuadzinsData?.data || [];

  // Function to check if a date is already taken
  const isDateTaken = (date: string): boolean => {
    return existingSchedules.some(schedule => {
      const scheduleDate = schedule.tanggal.split('T')[0]; // Extract date part from ISO string
      return scheduleDate === date;
    });
  };

  // Function to set minimum date to today
  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // ✅ Global state - Create staff schedule mutation
  const createStaffScheduleMutation = useCreateStaffSchedule();

  // ✅ React Hook Form - Form state management
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

  /**
   * HANDLER: Form Submit
   */
  const onSubmit = async (data: StaffScheduleFormValues) => {
    try {
      toast.loading("Menyimpan jadwal petugas...", {
        id: "create-staff-schedule",
      });

      // ✅ Create staff schedule - validation sudah ditangani oleh schema
      await createStaffScheduleMutation.mutateAsync(data);

      toast.success("Jadwal petugas berhasil dibuat!", {
        id: "create-staff-schedule",
      });
      router.push("/staff-schedules/main");
    } catch (error: any) {
      console.error("❌ Error creating staff schedule:", error);

      // Extract error message untuk user feedback
      const errorMessage =
        error?.message || "Gagal membuat jadwal petugas. Silakan coba lagi.";

      // Check if it's a backend validation error
      if (error?.response?.status === 500) {
        toast.error("Terjadi kesalahan pada server. Silakan periksa log backend atau hubungi administrator.", {
          id: "create-staff-schedule",
          duration: 8000,
        });
      } else {
        toast.error(errorMessage, {
          id: "create-staff-schedule",
          duration: 5000, // 5 detik untuk network error
        });
      }
    }
  };

  // ✅ Loading state
  if (isLoadingImams || isLoadingKhatibs || isLoadingMuadzins) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Buat Jadwal Petugas
          </h1>
          <p className="text-gray-600 mt-2">
            Tambahkan jadwal baru untuk petugas masjid
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tanggal */}
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
                            message: "Tanggal ini sudah digunakan untuk jadwal lain",
                          });
                        } else {
                          form.clearErrors("tanggal");
                          field.onChange(selectedDate);
                        }
                      }}
                      className={`${
                        field.value ? "bg-emerald-50" : ""
                      } focus:ring-2 focus:ring-emerald-500`}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih tanggal yang belum digunakan untuk jadwal lain
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

            {/* Validation Error for duplicate staff */}
            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/staff-schedules/main")}
                className="flex-1 h-12"
                disabled={createStaffScheduleMutation.isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={createStaffScheduleMutation.isPending}
              >
                {createStaffScheduleMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Simpan Jadwal
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
