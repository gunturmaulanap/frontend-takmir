"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "../schema/eventSchema";
import { useCreateEvent } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaImage,
  FaSave,
  FaTimes,
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
import Image from "next/image";
import { parseApiError } from "@/utils/errorHandler";

export default function CreateEventForm() {
  const router = useRouter();

  // ✅ Global state - Categories dari Tanstack Query
  const { data: paginatedCategoriesData, isLoading: isLoadingCategories } =
    useCategories();

  // Extract categories dari paginated response
  const categories = paginatedCategoriesData?.data || [];

  // ✅ Global state - Create event mutation
  const createEventMutation = useCreateEvent();

  // ✅ Local state - Image preview (UI only)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ React Hook Form - Form state management
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      category_id: 0,
      tanggal_event: "",
      waktu_event: "",
      tempat_event: "",
      image: undefined,
    },
  });

  /**
   * HANDLER: Image Upload & Preview
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set value ke React Hook Form
      form.setValue("image", file, { shouldValidate: true });

      // Buat preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * HANDLER: Remove Image
   */
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", undefined, { shouldValidate: true });
    const fileInput = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  /**
   * HANDLER: Form Submit
   */
  const onSubmit = async (data: EventFormValues) => {
    try {
      // Validasi category_id
      if (!data.category_id || data.category_id === 0) {
        toast.error("Silakan pilih kategori event!");
        return;
      }

      toast.loading("Menyimpan event...", { id: "create-event" });

      // ✅ Create event
      await createEventMutation.mutateAsync(data);

      toast.success("Event berhasil dibuat!", { id: "create-event" });
      router.push("/events/main");
    } catch (error) {
      console.error("❌ Error creating event:", error);
      toast.error(parseApiError(error), { id: "create-event" });
    }
  };

  // ✅ Loading state
  if (isLoadingCategories) {
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
          <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
          <p className="text-gray-600 mt-2">
            Buat event baru untuk jadwal masjid
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Event */}
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Nama Event <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Kajian Rutin Jumat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Kategori <span className="text-red-500">*</span>
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
                      <option value="0">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nama}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal & Waktu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tanggal_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-emerald-600" />
                      Tanggal Event <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waktu_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center">
                      <FaClock className="mr-2 text-emerald-600" />
                      Waktu Event <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tempat Event */}
            <FormField
              control={form.control}
              name="tempat_event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-emerald-600" />
                    Tempat Event <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Masjid Nurul Ashri"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Deskripsi <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan detail tentang event..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Image */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold flex items-center">
                    <FaImage className="mr-2 text-emerald-600" />
                    Gambar Event <span className="text-red-500 ml-1">*</span>
                  </FormLabel>

                  {/* Preview */}
                  {imagePreview && (
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                      <Image
                        fill
                        src={imagePreview}
                        alt="Preview"
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      {/* Button Remove Preview */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-input"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">
                            Klik untuk upload
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP (MAX. 500KB)
                        </p>
                      </div>
                      <input
                        id="image-input"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/events/main")}
                className="flex-1 h-12"
                disabled={createEventMutation.isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Simpan Event
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
