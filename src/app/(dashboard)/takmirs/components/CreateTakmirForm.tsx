/**
 * ============================================
 * CREATE TAKMIR FORM COMPONENT
 * ============================================
 * Menggunakan:
 * - React Hook Form + Zod validation
 * - useCreateTakmir mutation dari Tanstack Query
 * - Form styling yang konsisten dengan CreateEventForm
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { takmirSchema, TakmirFormValues } from "../schema/takmirSchema";
import { useCreateTakmir } from "@/hooks/useTakmirs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  FaUser,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
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
import { parseApiError } from "@/utils/errorHandler";

export default function CreateTakmirForm() {
  const router = useRouter();

  // ✅ State untuk loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Global state - Create takmir mutation
  const createTakmirMutation = useCreateTakmir();
  const { isPending } = createTakmirMutation;

  // ✅ React Hook Form - Form state management
  const form = useForm<TakmirFormValues>({
    resolver: zodResolver(takmirSchema),
    defaultValues: {
      nama: "",
      username: "",
      password: "",
      confirm_password: "",
      no_handphone: "",
      umur: 0,
      jabatan: "",
      deskripsi_tugas: "",
      email: "",
    },
    mode: "onBlur", // Validasi saat blur event
  });

  // ✅ Form submit handler
  const onSubmit = async (data: TakmirFormValues) => {
    setIsSubmitting(true);
    toast.loading("Menyimpan data takmir...", { id: "create-takmir" });

    try {
      // Kirim data ke API
      await createTakmirMutation.mutateAsync(data);

      toast.success("Takmir berhasil dibuat!", { id: "create-takmir" });
      router.push("/takmirs/main");
    } catch (error) {
      toast.error(parseApiError(error), { id: "create-takmir" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Takmir Baru</h1>
          <p className="text-gray-600 mt-1">
            Tambahkan takmir baru untuk membantu mengelola masjid
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* User Information Section */}
            <div className="space-y-6">
              {/* Nama Lengkap */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nama lengkap takmir"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Username <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="username_takmir"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Password <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Minimal 8 karakter, kombinasi huruf, angka, & simbol"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Ketik ulang password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email (Optional) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com (opsional)"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Divider */}
            <div className="space-y-6 pt-6 ">
              {/* Nomor Handphone */}
              <FormField
                control={form.control}
                name="no_handphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      No Handphone <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="08123456789"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Umur */}
              <FormField
                control={form.control}
                name="umur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Umur <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukkan umur"
                        disabled={isSubmitting}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseInt(value, 10);
                            field.onChange(
                              isNaN(numValue) ? undefined : numValue
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jabatan */}
              <FormField
                control={form.control}
                name="jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Jabatan <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Contoh: Ketua Takmir, Bendahara, dll"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deskripsi Tugas */}
              <FormField
                control={form.control}
                name="deskripsi_tugas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Deskripsi Tugas <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Jelaskan tugas dan tanggung jawab takmir..."
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/categories/main")}
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
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Create Takmir
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
        </form>
      </Form>
    </div>
  );
}
