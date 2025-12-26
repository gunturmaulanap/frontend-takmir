"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { asatidzSchema, AsatidzFormValues } from "../schema/asatidzSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAsatidzs, useUpdateAsatidz } from "@/hooks/useAsatidzs";
import { getAsatidzBySlug } from "../api/getAsatidzs";
import { getAvailableMuridTPQ } from "../api/getAvailableMuridTPQ";
import { parseApiError } from "@/utils/errorHandler";
import { MuridTPQ } from "@/types/asatidz";

export default function EditAsatidzForm() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [asatidz, setAsatidz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [muridTPQList, setMuridTPQList] = useState<MuridTPQ[]>([]);
  const [loadingMurid, setLoadingMurid] = useState(true);

  const updateAsatidzMutation = useUpdateAsatidz();

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
    mode: "onChange",
  });

  // Fetch asatidz by slug
  useEffect(() => {
    const fetchAsatidz = async () => {
      try {
        setIsLoading(true);
        const data = await getAsatidzBySlug(slug);
        setAsatidz(data);

        // Set form values
        const formData: AsatidzFormValues = {
          nama: data.nama || "",
          no_handphone: data.no_handphone || "",
          umur: data.umur?.toString() || "",
          jenis_kelamin:
            (data.jenis_kelamin as "Laki-laki" | "Perempuan" | "") || "",
          keahlian: data.keahlian || "",
          keterangan: data.keterangan || "",
          alamat: data.alamat || "",
          murid_ids: data.murid?.map((m: any) => m.id) || [],
        };
        form.reset(formData);
      } catch (error) {
        console.error("Error fetching asatidz:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchAsatidz();
    }
  }, [slug, form]);

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
    if (!asatidz) {
      toast.error("Asatidz tidak ditemukan", { id: "update-asatidz" });
      return;
    }

    toast.loading("Memperbarui asatidz...", { id: "update-asatidz" });

    updateAsatidzMutation.mutate(
      { id: asatidz.id, data },
      {
        onSuccess: () => {
          toast.success("Asatidz berhasil diperbarui!", {
            id: "update-asatidz",
          });
          router.push("/asatidzs/main");
        },
        onError: (error) => {
          toast.error(parseApiError(error), {
            id: "update-asatidz",
          });
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Memuat data asatidz..." />;
  }

  if (isError || (!isLoading && !asatidz)) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={`Asatidz dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau data sudah dihapus.`}
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/asatidzs/main")}
            className="flex items-center mx-auto"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Kembali ke Daftar Asatidz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Asatidz</h1>
          <p className="text-gray-600 mt-1">
            Update informasi asatidz:{" "}
            <span className="font-semibold">{asatidz?.nama}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      Nama Asatidz <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nama lengkap asatidz"
                        disabled={updateAsatidzMutation.isPending}
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
                        disabled={updateAsatidzMutation.isPending}
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
                        disabled={updateAsatidzMutation.isPending}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
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
                        disabled={updateAsatidzMutation.isPending}
                        rows={3}
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
                        <SelectTrigger
                          disabled={updateAsatidzMutation.isPending}
                        >
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

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
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
                          disabled={updateAsatidzMutation.isPending}
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
                          disabled={updateAsatidzMutation.isPending}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Murid TPQ */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Murid TPQ
                </h3>

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
                            Tidak ada murid TPQ tersedia.
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
                                                    (value) =>
                                                      value !== murid.id
                                                  )
                                                );
                                          }}
                                          disabled={
                                            updateAsatidzMutation.isPending
                                          }
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

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/asatidzs/main")}
                  className="flex-1 h-12"
                  disabled={updateAsatidzMutation.isPending}
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Batal
                </Button>

                <Button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                  disabled={updateAsatidzMutation.isPending}
                >
                  {updateAsatidzMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Update Asatidz
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
