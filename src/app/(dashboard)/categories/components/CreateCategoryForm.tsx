/**
 * ============================================
 * CREATE CATEGORY PAGE
 * ============================================
 * Form untuk create new category dengan:
 * - React Hook Form + Zod validation
 * - Color picker (hex input)
 * - Tanstack Query mutation
 * - Real-time validation errors
 */

"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { parseApiError } from "@/utils/errorHandler";
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
import { useCreateCategory } from "@/hooks/useCategories";
import {
  categorySchema,
  CategoryFormValues,
  warnaOptions,
} from "../schema/categorySchema";
import { FaSave, FaSpinner, FaTimes } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";

export default function CreateCategoryForm() {
  const router = useRouter();

  // Tanstack Query mutation
  const { mutate: createCategory, isPending } = useCreateCategory();

  // React Hook Form dengan Zod validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nama: "",
      warna: "Blue", // Default to Green
    },
  });

  /**
   * Handle Submit
   */
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      toast.loading("Membuat kategori...", { id: "create-category" });

      // ✅ Create category dengan Tanstack Query mutation
      await new Promise((resolve, reject) => {
        createCategory(data, {
          onSuccess: () => {
            resolve(undefined);
          },
          onError: (error) => {
            reject(error);
          },
        });
      });

      toast.success("Kategori berhasil dibuat!", { id: "create-category" });
      router.push("/categories/main");
    } catch (error) {
      console.error("❌ Error creating category:", error);

      toast.error(parseApiError(error), { id: "create-category" });
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori</h1>
        <p className="text-gray-600 mt-1">
          Buat kategori baru untuk mengelompokkan acara masjid
        </p>
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
                    <div className="grid grid-cols-5 gap-3">
                      {warnaOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          disabled={isPending}
                          className={`
                            relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                            ${
                              field.value === option.value
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
                          {field.value === option.value && (
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
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Pilih warna untuk kategori ini
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t cursor-pointer">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/categories/main")}
                className="flex-1 h-12"
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
                    Create Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
