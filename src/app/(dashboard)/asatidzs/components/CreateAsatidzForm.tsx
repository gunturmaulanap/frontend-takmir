"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { asatidzSchema, AsatidzFormValues } from "../schema/asatidzSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateAsatidz } from "@/hooks/useAsatidzs";
import { getAvailableMuridTPQ } from "../api/getAvailableMuridTPQ";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseApiError } from "@/utils/errorHandler";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { MuridTPQ } from "@/types/asatidz";

export default function CreateAsatidzForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [muridTPQList, setMuridTPQList] = useState<MuridTPQ[]>([]);
  const [loadingMurid, setLoadingMurid] = useState(true);

  const createAsatidzMutation = useCreateAsatidz();
  const { isPending } = createAsatidzMutation;

  const form = useForm<AsatidzFormValues>({
    resolver: zodResolver(asatidzSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      umur: "",
      jenis_kelamin: "",
      keahlian: "",
      keterangan: "",
      alamat: "",
      murid_ids: [],
    },
    mode: "onBlur",
  });

  // Fetch available murid TPQ
  useEffect(() => {
    const fetchMuridTPQ = async () => {
      try {
        const data = await getAvailableMuridTPQ();
        setMuridTPQList(data);
      } catch (error) {
        console.error("Error fetching murid TPQ:", error);
      } finally {
        setLoadingMurid(false);
      }
    };

    fetchMuridTPQ();
  }, []);

  const onSubmit = async (data: AsatidzFormValues) => {
    setIsSubmitting(true);
    toast.loading("Menyimpan data asatidz...", { id: "create-asatidz" });

    try {
      await createAsatidzMutation.mutateAsync(data);
      toast.success("Asatidz berhasil dibuat!", { id: "create-asatidz" });
      router.push("/asatidzs/main");
    } catch (error) {
      console.error("❌ Error creating asatidz:", error);
      toast.error(parseApiError(error), { id: "create-asatidz" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Buat Asatidz Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Tambahkan asatidz baru untuk masjid
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Pribadi
              </h3>

              {/* Nama Lengkap */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nama lengkap asatidz"
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
                      No Handphone
                    </FormLabel>
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
                      Umur
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukkan umur"
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
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
                    </FormLabel>
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

              {/* Alamat */}
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Alamat
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Masukkan alamat lengkap"
                        disabled={isSubmitting}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Keahlian
              </h3>

              {/* Keahlian */}
              <FormField
                control={form.control}
                name="keahlian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Keahlian
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Contoh: Tahfidz Al-Quran, Fiqih Ibadah, dll"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keterangan */}
              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Keterangan
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Keterangan tambahan mengenai asatidz"
                        disabled={isSubmitting}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Murid TPQ
              </h3>

              {/* Murid TPQ Checkbox */}
              <FormField
                control={form.control}
                name="murid_ids"
                render={() => (
                  <FormItem>
                    <div className="space-y-3">
                      <FormLabel className="text-base font-semibold">
                        Pilih Murid TPQ
                      </FormLabel>
                      {loadingMurid ? (
                        <p className="text-sm text-gray-500">
                          Memuat daftar murid TPQ...
                        </p>
                      ) : muridTPQList.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Tidak ada murid TPQ tersedia. Silakan tambahkan jamaah
                          dengan aktivitas TPQ terlebih dahulu.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                          {muridTPQList.map((murid) => (
                            <FormField
                              key={murid.id}
                              control={form.control}
                              name="murid_ids"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-gray-50 rounded">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          murid.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                murid.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== murid.id
                                                )
                                              );
                                        }}
                                        disabled={isSubmitting}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex-1">
                                      <div>
                                        <p className="font-medium text-sm">
                                          {murid.nama}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {murid.jenis_kelamin} • {murid.umur}{" "}
                                          tahun
                                        </p>
                                        {murid.no_handphone && (
                                          <p className="text-xs text-gray-500">
                                            {murid.no_handphone}
                                          </p>
                                        )}
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/asatidzs/main")}
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
                    Simpan Asatidz
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
