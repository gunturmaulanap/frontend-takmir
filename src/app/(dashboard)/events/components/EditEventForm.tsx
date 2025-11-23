/**
 * ============================================
 * EDIT EVENT PAGE - CLEAN VERSION (SLUG-BASED)
 * ============================================
 * URL: /events/kajian-rutin-jumat
 *
 * Menggunakan:
 * - Global state dari Tanstack Query (useEventBySlug, useCategories, useUpdateEvent)
 * - Shared LoadingSpinner & ErrorState components
 * - React Hook Form + Zod validation
 * - SEO-friendly slug URLs
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventEditFormValues, eventEditSchema } from "../schema/eventSchema";
import { Event } from "@/types/event";
import { useEvents, useUpdateEvent } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

// React Icons
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaImage,
  FaSave,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

// Shadcn UI Components
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

export default function EditEventForm({ slug }: { slug: string }) {
  const router = useRouter();

  // ✅ Local state - Image preview (UI only)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ Get all events dan find by slug - SIMPLE (seperti categories)
  const { data: paginatedEvents, isLoading, isError, error } = useEvents();
  const events = paginatedEvents?.data || [];

  const event = events.find((event) => event.slug === slug);

  // Store initial event data to prevent error state when slug changes
  const [initialEvent, setInitialEvent] = useState(event);

  // ✅ Global state - Fetch categories
  const { data: paginatedCategories } = useCategories();
  const categories = paginatedCategories?.data || [];

  // ✅ Global state - Update event mutation
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  // ✅ React Hook Form - Form state management
  const form = useForm<EventEditFormValues>({
    resolver: zodResolver(eventEditSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      category_id: 1,
      tanggal_event: "",
      waktu_event: "",
      tempat_event: "",
      image: undefined,
    },
  });

  /**
   * EFFECT: Store initial data and populate form with event data
   */
  useEffect(() => {
    if (event && !initialEvent) {
      setInitialEvent(event);
    }

    if (event) {
      // Format tanggal untuk input date
      let formattedDate = event.tanggal_event;
      if (formattedDate) {
        if (formattedDate.includes("T")) {
          formattedDate = formattedDate.split("T")[0];
        } else if (formattedDate.includes(" ")) {
          formattedDate = formattedDate.split(" ")[0];
        } else if (formattedDate.includes("/")) {
          const [day, month, year] = formattedDate.split("/");
          formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        }
      }

      // Set form values
      const tempatEvent =
        event.tempat_event ||
        (event as Event & { lokasi?: string }).lokasi ||
        "";

      form.reset({
        nama: event.nama || "",
        deskripsi: event.deskripsi || "",
        category_id: event.category_id || 1,
        tanggal_event: formattedDate || "",
        waktu_event: event.waktu_event || "",
        tempat_event: tempatEvent,
        image: undefined,
        _hasOldImage: !!event.image,
      });

      // Set image preview
      if (event.image) {
        let imageUrl = event.image;
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          // Already full URL
        } else if (imageUrl.startsWith("/storage")) {
          imageUrl = `http://localhost:8000${imageUrl}`;
        } else if (!imageUrl.startsWith("/")) {
          imageUrl = `http://localhost:8000/storage/${imageUrl}`;
        } else {
          imageUrl = `http://localhost:8000${imageUrl}`;
        }
        setImagePreview(imageUrl);
      }
    }
  }, [event, initialEvent, form]);

  /**
   * HANDLER: Image Upload & Preview
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file, { shouldValidate: true });
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
    // ✅ Update _hasOldImage ke false untuk trigger validasi
    form.setValue("_hasOldImage", false, { shouldValidate: true });
    const fileInput = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  /**
   * HANDLER: Form Submit
   */

  /**
   * Handle Submit
   */
  const onSubmit = async (data: EventEditFormValues) => {
    const currentEvent = event || initialEvent;
    if (!currentEvent) {
      toast.error("Event tidak ditemukan", { id: "update-event" });
      return;
    }

    // Validasi category_id
    if (!data.category_id || data.category_id === 0) {
      toast.error("Silakan pilih kategori event!");
      return;
    }

    toast.loading("Memperbarui event...", { id: "update-event" });

    // Use the actual event ID
    updateEvent(
      { id: currentEvent.id, data: { ...data, _hasOldImage: !!imagePreview } },
      {
        onSuccess: () => {
          console.log("✅ Event updated successfully");

          toast.success("Event berhasil diperbarui!", {
            id: "update-event",
          });

          // Redirect immediately (cache already updated by hook)
          router.push("/events/main");
        },
        onError: (error) => {
          console.error("❌ Error updating event:", error);

          let errorMessage = "Gagal memperbarui event.";

          // Type assertion untuk error response
          const errorResponse = error as {
            response?: {
              data?: { message?: string; errors?: Record<string, string[]> };
            };
          };

          if (errorResponse?.response?.data?.errors) {
            const errors = errorResponse.response.data.errors;
            const errorFields = Object.keys(errors).map(
              (key) => `${errors[key].join(", ")}`
            );
            errorMessage = errorFields.join("\n");
          } else if (errorResponse?.response?.data?.message) {
            errorMessage = errorResponse.response.data.message;
          }

          toast.error(errorMessage, {
            id: "update-event",
          });
        },
      }
    );
  };

  // ✅ Loading state - Only show if no initial data and still loading
  if (isLoading && !initialEvent) {
    return <LoadingSpinner message="Memuat data event..." />;
  }

  // ✅ Error state - Show if data is loaded but event not found OR if there's an error
  if (isError || (!isLoading && !event && !initialEvent)) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={
            error?.message?.includes("not found") ||
            error?.message?.includes("404")
              ? `Event dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau event sudah dihapus.`
              : "Event tidak ditemukan atau terjadi kesalahan."
          }
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/events/main")}
            className="flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Event
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-2">
            Update informasi event:{" "}
            <span className="font-semibold">
              {event?.nama || initialEvent?.nama}
            </span>
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
                    <div className="relative w-auto h-80 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                      <Image
                        fill
                        src={imagePreview}
                        alt="Preview"
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
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
                    Update Event
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
