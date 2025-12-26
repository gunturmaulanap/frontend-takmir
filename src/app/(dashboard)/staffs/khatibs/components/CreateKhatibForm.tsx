"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KhatibFormValues,
  khatibSchema,
} from "@/app/(dashboard)/staffs/schema/khatibSchema";
import { useCreateKhatib } from "@/hooks/useKhatibs";
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
import { parseApiError } from "@/utils/errorHandler";

export default function CreateKhatibForm() {
  const router = useRouter();

  // ✅ Global state - Create khatib mutation
  const createKhatibMutation = useCreateKhatib();

  // ✅ React Hook Form - Form state management
  const form = useForm<KhatibFormValues>({
    resolver: zodResolver(khatibSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      alamat: "",
    },
  });

  /**
   * HANDLER: Form Submit
   */
  const onSubmit = async (data: KhatibFormValues) => {
    try {
      toast.loading("Menyimpan data khatib...", {
        id: "create-khatib",
      });

      // ✅ Create khatib - validation sudah ditangani oleh schema
      await createKhatibMutation.mutateAsync(data);

      toast.success("Data khatib berhasil ditambahkan!", {
        id: "create-khatib",
      });
      router.push("/staffs/khatibs");
    } catch (error) {
      console.error("❌ Error creating khatib:", error);

      toast.error(parseApiError(error), {
        id: "create-khatib",
        duration: 5000,
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Khatib
          </h1>
          <p className="text-gray-600 mt-2">
            Masukkan data khatib baru untuk masjid
          </p>
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
                disabled={createKhatibMutation.isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={createKhatibMutation.isPending}
              >
                {createKhatibMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Simpan Khatib
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