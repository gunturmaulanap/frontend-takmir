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
import { jamaahSchema, JamaahFormValues } from "../schema/jamaahSchema";
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
import { useJamaahs, useUpdateJamaah } from "@/hooks/useJamaahs";
import { parseApiError } from "@/utils/errorHandler";

export default function EditJamaahForm() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: paginatedJamaahs, isLoading, isError } = useJamaahs();
  const jamaahs = paginatedJamaahs?.data || [];
  const jamaah = jamaahs.find((jamaah) => jamaah.slug === slug);

  const [initialJamaah, setInitialJamaah] = useState(jamaah);

  const updateJamaahMutation = useUpdateJamaah();

  const form = useForm<JamaahFormValues>({
    resolver: zodResolver(jamaahSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      aktivitas_jamaah: [],
      umur: "",
      alamat: "",
      jenis_kelamin: "Laki-laki",
    } as JamaahFormValues,
    mode: "onChange",
  });

  // Update form values when jamaah data is loaded
  useEffect(() => {
    if (jamaah) {
      const formData: JamaahFormValues = {
        nama: jamaah.nama || "",
        no_handphone: jamaah.no_handphone || "",
        umur: jamaah.umur?.toString() || "",
        aktivitas_jamaah: Array.isArray(jamaah.aktivitas_jamaah)
          ? jamaah.aktivitas_jamaah
          : (jamaah.aktivitas_jamaah
              ? jamaah.aktivitas_jamaah.split(', ').map(a => a.trim()).filter(a => a !== '')
              : []),
        alamat: jamaah.alamat || "",
        jenis_kelamin:
          (jamaah.jenis_kelamin as "Laki-laki" | "Perempuan") || "Laki-laki",
      };
      form.reset(formData);
      setInitialJamaah(jamaah);
    }
  }, [jamaah, form]);

  const onSubmit = async (data: JamaahFormValues) => {
    const currentJamaah = jamaah || initialJamaah;
    if (!currentJamaah) {
      toast.error("Jamaah tidak ditemukan", { id: "update-jamaah" });
      return;
    }

    toast.loading("Memperbarui jamaah...", { id: "update-jamaah" });

    updateJamaahMutation.mutate(
      { id: currentJamaah.id, data },
      {
        onSuccess: () => {
          toast.success("Jamaah berhasil diperbarui!", {
            id: "update-jamaah",
          });
          router.push("/jamaahs/main");
        },
        onError: (error) => {
          toast.error(parseApiError(error), {
            id: "update-jamaah",
          });
        },
      }
    );
  };
  if (isLoading && !initialJamaah) {
    return <LoadingSpinner message="Memuat data jamaah..." />;
  }
  if (isError || (!isLoading && !jamaah && !initialJamaah)) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={`Jamaah dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau data sudah dihapus.`}
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/jamaahs/main")}
            className="flex items-center mx-auto"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Kembali ke Daftar Jamaah
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Jamaah</h1>
          <p className="text-gray-600 mt-1">
            Update informasi jamaah:{" "}
            <span className="font-semibold">
              {jamaah?.nama || initialJamaah?.nama}
            </span>
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Profile Jamaah
              </h3>

              {/* Nama Lengkap */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Nama Jamaah <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan nama lengkap jamaah"
                        disabled={updateJamaahMutation.isPending}
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
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="08123456789"
                        disabled={updateJamaahMutation.isPending}
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
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukkan umur"
                        disabled={updateJamaahMutation.isPending}
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
                        onBlur={(e) => {
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

              {/* Alamat */}
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Alamat <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Masukkan alamat lengkap"
                        disabled={updateJamaahMutation.isPending}
                        rows={3}
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
                render={() => (
                  <FormItem>
                    <div className="space-y-3">
                      <FormLabel className="text-base font-semibold">
                        Aktivitas Jamaah <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          "Kajian Rutin",
                          "TPA",
                          "TPQ",
                          "Shalat Jamaah",
                          "Sukarelawan"
                        ].map((aktivitas) => (
                          <FormField
                            key={aktivitas}
                            control={form.control}
                            name="aktivitas_jamaah"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(aktivitas)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, aktivitas])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== aktivitas
                                              )
                                            )
                                      }}
                                      disabled={updateJamaahMutation.isPending}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {aktivitas}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </div>
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
                          disabled={updateJamaahMutation.isPending}
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

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/jamaahs/main")}
                  className="flex-1 h-12"
                  disabled={updateJamaahMutation.isPending}
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Batal
                </Button>

                <Button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                  disabled={updateJamaahMutation.isPending}
                >
                  {updateJamaahMutation.isPending ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      Menyimpan Profile...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Update Profile
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
