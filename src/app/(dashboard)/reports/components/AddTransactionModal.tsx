"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FaImage, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { reportSchema, ReportFormValues } from "../schema/reportSchema";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useReports";
import { Report } from "@/types/report";
import Image from "next/image";
import {
  isImagePath,
  resolveTransactionImageUrl,
} from "../utils/transactionImage";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction?: Report | null;
  onSuccess?: () => void;
}

export default function AddTransactionModal({
  open,
  onOpenChange,
  editingTransaction,
  onSuccess,
}: AddTransactionModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "income",
      kategori: "",
      jumlah: "",
      tanggal: new Date().toISOString().split("T")[0],
      keterangan: "",
      bukti_transaksi: null,
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        type: editingTransaction.type,
        kategori: editingTransaction.kategori,
        jumlah: editingTransaction.jumlah.toString(),
        tanggal: editingTransaction.tanggal.split("T")[0],
        keterangan: editingTransaction.keterangan || "",
        bukti_transaksi: null,
      });
    } else {
      form.reset({
        type: "income",
        kategori: "",
        jumlah: "",
        tanggal: new Date().toISOString().split("T")[0],
        keterangan: "",
        bukti_transaksi: null,
      });
    }
  }, [editingTransaction, form, open]);

  useEffect(() => {
    if (editingTransaction?.bukti_transaksi && isImagePath(editingTransaction.bukti_transaksi)) {
      const imageUrl = resolveTransactionImageUrl(
        editingTransaction.bukti_transaksi
      );
      setExistingImageUrl(imageUrl);
      setImagePreview(imageUrl);
      setHasNewImage(false);
      return;
    }

    setExistingImageUrl(null);
    setImagePreview(null);
    setHasNewImage(false);
  }, [editingTransaction, open]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    form.setValue("bukti_transaksi", file, { shouldValidate: true });

    if (!file.type.startsWith("image/")) {
      setImagePreview(null);
      setHasNewImage(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setHasNewImage(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const nextPreview = existingImageUrl || null;
    setImagePreview(nextPreview);
    setHasNewImage(false);
    form.setValue("bukti_transaksi", null, { shouldValidate: true });

    const fileInput = document.getElementById(
      "bukti-transaksi-input"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("kategori", data.kategori);
    formData.append("jumlah", data.jumlah);
    formData.append("tanggal", data.tanggal);

    if (data.keterangan) {
      formData.append("keterangan", data.keterangan);
    }

    if (data.bukti_transaksi instanceof File) {
      formData.append("bukti_transaksi", data.bukti_transaksi);
    }

    if (editingTransaction) {
      toast.loading("Memperbarui transaksi...", { id: "update-transaction" });

      updateMutation.mutate(
        { id: editingTransaction.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Transaksi berhasil diperbarui!", {
              id: "update-transaction",
            });
            onSuccess?.();
            form.reset();
          },
          onError: (error) => {
            toast.error(error.message || "Gagal memperbarui transaksi", {
              id: "update-transaction",
            });
          },
        }
      );
    } else {
      toast.loading("Menyimpan transaksi...", { id: "create-transaction" });

      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Transaksi berhasil dibuat!", {
            id: "create-transaction",
          });
          onSuccess?.();
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Gagal membuat transaksi", {
            id: "create-transaction",
          });
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
          </DialogTitle>
          <DialogDescription>
            {editingTransaction
              ? "Perbarui informasi transaksi keuangan"
              : "Isi formulir untuk menambahkan transaksi keuangan baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipe Transaksi */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Tipe Transaksi <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Pemasukan</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Kategori <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Infak">Infak</SelectItem>
                      <SelectItem value="Sedekah">Sedekah</SelectItem>
                      <SelectItem value="Zakat">Zakat</SelectItem>
                      <SelectItem value="Operasional">Operasional</SelectItem>
                      <SelectItem value="Pemeliharaan">Pemeliharaan</SelectItem>
                      <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="Donasi">Donasi</SelectItem>
                      <SelectItem value="Renovasi">Renovasi</SelectItem>
                      <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                      <SelectItem value="Sound System">Sound System</SelectItem>
                      <SelectItem value="Sumbangan Jamaah">
                        Sumbangan Jamaah
                      </SelectItem>
                      <SelectItem value="Listrik dan Air">
                        Listrik dan Air
                      </SelectItem>
                      <SelectItem value="Zakat Fitrah">Zakat Fitrah</SelectItem>
                      <SelectItem value="Gaji">Gaji</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Jumlah */}
            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Jumlah <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Masukkan jumlah"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal */}
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Tanggal <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
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
                      placeholder="Masukkan keterangan (opsional)"
                      disabled={isPending}
                      rows={3}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bukti Transaksi */}
            <FormField
              control={form.control}
              name="bukti_transaksi"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaImage className="mr-2 text-emerald-600" />
                    Bukti Transaksi
                  </FormLabel>
                  {imagePreview && (
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                      <Image
                        fill
                        src={imagePreview}
                        alt="Preview bukti transaksi"
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority
                      />
                      {hasNewImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        id="bukti-transaksi-input"
                        type="file"
                        accept="image/*,.pdf"
                        disabled={isPending}
                        onChange={(e) => {
                          handleImageChange(e);
                          field.onChange(e.target.files?.[0] || null);
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        Upload bukti transaksi (gambar atau PDF, maksimal 2MB)
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                    {editingTransaction ? "Memperbarui..." : "Menyimpan..."}
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    {editingTransaction
                      ? "Perbarui Transaksi"
                      : "Simpan Transaksi"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
