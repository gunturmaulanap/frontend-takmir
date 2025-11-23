/**
 * ============================================
 * EDIT CATEGORY PAGE
 * ============================================
 * Form untuk update existing category dengan:
 * - Fetch data existing dengan useCategory hook
 * - Populate form dengan data
 * - React Hook Form + Zod validation
 * - Color picker with preview
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useUpdateCategory,
  categoryKeys,
} from "@/hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import {
  categorySchema,
  CategoryFormValues,
  warnaOptions,
} from "@/app/(dashboard)/categories/schema/categorySchema";
import { FaArrowLeft, FaSave, FaSpinner, FaTimes } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { parseApiError } from "@/utils/errorHandler";

export default function EditCategoryForm({ slug }: { slug: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Next.js 15: params is a Promise, must unwrap with use()

  // Get all categories dan find by slug - SIMPLE!
  const { data: paginatedCategories, isLoading, isError } = useCategories();

  const categories = paginatedCategories?.data || [];

  // Find category by slug
  const category = categories.find((cat) => cat.slug === slug);

  // Store initial category data to prevent error state when slug changes
  const [initialCategory, setInitialCategory] = useState(category);

  // Memoize status untuk mencegah timing issues

  // Update mutation
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  // React Hook Form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nama: "",
      warna: "Green", // Fallback default
    },
  });

  // Watch form values for real-time updates
  const watchedValues = form.watch();

  /**
   * Store initial data and populate form when data loaded
   */
  useEffect(() => {
    if (category && !initialCategory) {
      setInitialCategory(category);
    }

    if (category) {
      // Ensure the color value is valid enum value
      const validWarna = category.warna as CategoryFormValues["warna"];

      form.reset({
        nama: category.nama || "",
        warna: validWarna || "Green", // Fallback to Green if invalid
      });
    }
  }, [category, initialCategory, form, slug]);

  // Debug: Log form value changes
  useEffect(() => {
    if (watchedValues.warna) {
      console.log("🔄 Form color value changed:", watchedValues.warna);
    }
  }, [watchedValues.warna]);

  /**
   * Handle Submit
   */
  const onSubmit = async (data: CategoryFormValues) => {
    const currentCategory = category || initialCategory;
    if (!currentCategory) {
      toast.error("Kategori tidak ditemukan", { id: "update-category" });
      return;
    }

    toast.loading("Memperbarui kategori...", { id: "update-category" });

    updateCategory(
      { id: currentCategory.id, data },
      {
        onSuccess: () => {
          toast.success("Kategori berhasil diperbarui!", {
            id: "update-category",
          });
          router.push("/categories/main");
        },
        onError: (error) => {
          toast.error(parseApiError(error), { id: "update-category" });
        },
      }
    );
  };

  // Debug: Tambahkan logging untuk troubleshooting

  // Early return untuk error state dengan kondisi yang lebih robust
  if (isError || (!isLoading && !category && !initialCategory)) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={`Category dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau category sudah dihapus.`}
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/categories/main")}
            className="flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Category
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Memuat data categories..." />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore error nemo sit pariatur assumenda eaque, non magni sequi eos quibusdam.</h1>
        <p className="text-gray-600 mt-1">Perbarui informasi kategori</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nama Field */}
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Nama Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Kajian Rutin"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Nama kategori max 100 karakter
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Warna Field */}
            <FormField
              control={form.control}
              name="warna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center">
                    {" "}
                    <IoIosColorPalette className="mr-2 text-emerald-600" />
                    Warna *
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Current Color Preview */}
                      {/* <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Warna Dipilih:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{
                              backgroundColor:
                                warnaOptions.find(
                                  (opt) => opt.value === watchedValues.warna
                                )?.hex || "#10B981",
                            }}
                          />
                          <span className="text-sm font-semibold text-gray-900">
                            {warnaOptions.find(
                              (opt) => opt.value === watchedValues.warna
                            )?.label || "Hijau"}
                          </span>
                        </div>
                      </div> */}

                      {/* Color Options Grid */}
                      <div className="grid grid-cols-5 gap-3">
                        {warnaOptions.map((option) => {
                          const isSelected =
                            watchedValues.warna === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                console.log("🎨 Color selected:", option.value);
                                field.onChange(option.value);
                              }}
                              disabled={isPending}
                              className={`
                                relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                                ${
                                  isSelected
                                    ? "border-gray-900 shadow-md scale-105"
                                    : "border-gray-200 hover:border-gray-400"
                                }
                                ${
                                  isPending
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }
                              `}
                            >
                              <div
                                className="w-10 h-10 rounded-full mb-2"
                                style={{ backgroundColor: option.hex }}
                              />
                              <span className="text-xs font-medium text-gray-700">
                                {option.label}
                              </span>
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Pilih warna untuk kategori ini
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t ">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/categories/main")}
                className="flex-1 h-12 cursor-pointer"
                disabled={isPending}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>

              <Button
                type="submit"
                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
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
                    Update Category
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
