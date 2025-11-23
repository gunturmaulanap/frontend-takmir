/**
 * ============================================
 * CREATE JAMAAH FORM COMPONENT
 * ============================================
 * Menggunakan:
 * - React Hook Form + Zod validation
 * - useCreateJamaah mutation dari Tanstack Query
 * -  untuk role-based access
 * - Form styling yang konsisten dengan CreateEventForm
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jamaahSchema, JamaahFormValues } from "../schema/jamaahSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateJamaah } from "@/hooks/useJamaahs";
import {
  FaArrowLeft,
  FaUser,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaPhone,
  FaHome,
  FaSpinner,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { parseApiError } from "@/utils/errorHandler";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CreateJamaahForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createJamaahMutation = useCreateJamaah();
  const { isPending } = createJamaahMutation;

  const form = useForm<JamaahFormValues>({
    resolver: zodResolver(jamaahSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      umur: undefined,
      aktivitas_jamaah: "",
      alamat: "",
      jenis_kelamin: undefined,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: JamaahFormValues) => {
    setIsSubmitting(true);
    toast.loading("Menyimpan data jamaah...", { id: "create-jamaah" });

    try {
      await createJamaahMutation.mutateAsync(data);
      toast.success("Jamaah berhasil dibuat!", { id: "create-jamaah" });
      router.push("/jamaahs");
    } catch (error) {
      console.error("❌ Error creating jamaah:", error);

      toast.error(parseApiError(error), { id: "create-jamaah" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Jamaah Baru</h1>
          <p className="text-gray-600 mt-1">
            Tambahkan jamaah baru untuk masjid
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Personal Information Section */}
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
                        placeholder="Masukkan nama lengkap jamaah"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>
                      {" "}
                      <FormLabel className="text-base font-semibold">
                        Umur <span className="text-red-500">*</span>
                      </FormLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukkan umur"
                        disabled={isSubmitting}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jenis Kelamin */}
              <FormField
                control={form.control}
                name="jenis_kelamin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isSubmitting}>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Divider */}
            <div className="space-y-6 pt-6">
              {" "}
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Alamat <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan alamat lengkap"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Aktivitas Jamaah */}
              <FormField
                control={form.control}
                name="aktivitas_jamaah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Aktivitas Jamaah <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Contoh: Pengurus, Remaja Masjid, dll"
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
                      Create Jamaah
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
