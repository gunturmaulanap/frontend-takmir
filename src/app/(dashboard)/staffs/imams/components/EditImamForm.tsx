"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImamFormValues,
  imamSchema,
} from "@/app/(dashboard)/staffs/schema/imamSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaUser, FaPhone, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";
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
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  useUpdateImam,
  useImams,
} from "@/hooks/useImams";
import { parseApiError } from "@/utils/errorHandler";

export default function EditImamForm() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: paginatedImamaahs, isLoading, isError } = useImams();
  const imams = paginatedImamaahs?.data || [];
  const imam = imams.find((imam) => imam.slug === slug);

  const [initialImam, setInitialImam] = useState(imam);
  const updateImamMutation = useUpdateImam();

  const form = useForm<ImamFormValues>({
    resolver: zodResolver(imamSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      alamat: "",
    },
  });

  const onSubmit = async (data: ImamFormValues) => {
    if (!imam?.id) return;

    try {
      toast.loading("Menyimpan perubahan data imam...", {
        id: "update-imam",
      });

      // ✅ Update imam
      await updateImamMutation.mutateAsync({
        id: imam.id,
        data: data,
      });

      toast.success("Data imam berhasil diperbarui!", {
        id: "update-imam",
      });
      router.push("/staffs/imams");
    } catch (error: any) {
      console.error("❌ Error updating imam:", error);

      toast.error(parseApiError(error), {
        id: "update-imam",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (imam) {
      form.reset({
        nama: imam.nama || "",
        no_handphone: imam.no_handphone || "",
        alamat: imam.alamat || "",
      });
    }
  }, [imam, form]);

  if (!imam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Imam Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Data imam yang Anda cari tidak ditemukan.
          </p>
          <Button
            onClick={() => router.push("/staffs/imams")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Kembali ke Daftar Imam
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Imam
          </h1>
          <p className="text-gray-600 mt-2">Perbarui data imam masjid</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama */}
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaUser className="mr-2 text-emerald-600" />
                    Nama Lengkap <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama lengkap imam..."
                      {...field}
                      className="focus:ring-2 focus:ring-emerald-500"
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
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaPhone className="mr-2 text-emerald-600" />
                    Nomor Handphone <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: 08123456789"
                      {...field}
                      className="focus:ring-2 focus:ring-emerald-500"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 08xxx atau +62xxx
                  </p>
                </FormItem>
              )}
            />

            {/* Alamat */}
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-emerald-600" />
                    Alamat <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alamat lengkap imam..."
                      className="min-h-[100px] focus:ring-2 focus:ring-emerald-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimal 10 karakter, maksimal 100 karakter
                  </p>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/staffs/imams")}
                className="flex-1 h-12"
                disabled={updateImamMutation.isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={updateImamMutation.isPending}
              >
                {updateImamMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Perbarui Imam
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