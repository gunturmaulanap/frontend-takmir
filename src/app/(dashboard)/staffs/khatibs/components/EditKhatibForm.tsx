"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KhatibFormValues,
  khatibSchema,
} from "@/app/(dashboard)/staffs/schema/khatibSchema";
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
  useUpdateKhatib,
  useKhatibs,
} from "@/hooks/useKhatibs";
import { parseApiError } from "@/utils/errorHandler";

export default function EditKhatibForm() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: paginatedKhatibs, isLoading, isError } = useKhatibs();
  const khatibs = paginatedKhatibs?.data || [];
  const khatib = khatibs.find((khatib) => khatib.slug === slug);

  const [initialKhatib, setInitialKhatib] = useState(khatib);
  const updateKhatibMutation = useUpdateKhatib();

  const form = useForm<KhatibFormValues>({
    resolver: zodResolver(khatibSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      alamat: "",
    },
  });

  const onSubmit = async (data: KhatibFormValues) => {
    if (!khatib?.id) return;

    try {
      toast.loading("Menyimpan perubahan data khatib...", {
        id: "update-khatib",
      });

      // ✅ Update khatib
      await updateKhatibMutation.mutateAsync({
        id: khatib.id,
        data: data,
      });

      toast.success("Data khatib berhasil diperbarui!", {
        id: "update-khatib",
      });
      router.push("/staffs/khatibs");
    } catch (error: any) {
      console.error("❌ Error updating khatib:", error);

      toast.error(parseApiError(error), {
        id: "update-khatib",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (khatib) {
      form.reset({
        nama: khatib.nama || "",
        no_handphone: khatib.no_handphone || "",
        alamat: khatib.alamat || "",
      });
    }
  }, [khatib, form]);

  if (!khatib) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Khatib Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Data khatib yang Anda cari tidak ditemukan.
          </p>
          <Button
            onClick={() => router.push("/staffs/khatibs")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Kembali ke Daftar Khatib
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
            Edit Khatib
          </h1>
          <p className="text-gray-600 mt-2">Perbarui data khatib masjid</p>
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
                      placeholder="Masukkan nama lengkap khatib..."
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
                      placeholder="Masukkan alamat lengkap khatib..."
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
                onClick={() => router.push("/staffs/khatibs")}
                className="flex-1 h-12"
                disabled={updateKhatibMutation.isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={updateKhatibMutation.isPending}
              >
                {updateKhatibMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Perbarui Khatib
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