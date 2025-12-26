"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdmin, useUpdateAdmin } from "@/hooks/useAdmins";
import { UpdateAdminData } from "@/app/(dashboard)/admin-masjids/api/updateAdmin";
import { adminSchema, AdminFormData } from "../schema/adminSchema";

interface EditAdminFormProps {
  adminId: number;
}

export function EditAdminForm({ adminId }: EditAdminFormProps) {
  const router = useRouter();
  const { data: admin, isLoading, isError } = useAdmin(adminId);
  const updateAdminMutation = useUpdateAdmin();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
      profile_masjid_id: null,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name || "",
        email: admin.email || "",
        username: admin.username || "",
        password: "",
        password_confirmation: "",
        profile_masjid_id: admin.profileMasjid?.id || null,
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare base update data
      const updateData: UpdateAdminData = {
        name: data.name,
        email: data.email,
        username: data.username,
      };

      // Only add password if it's provided (not empty)
      if (data.password && data.password.trim() !== "") {
        // Check if passwords match
        if (data.password !== data.password_confirmation) {
          form.setError("password_confirmation", {
            type: "manual",
            message: "Password konfirmasi tidak cocok",
          });
          toast.error("Validasi Gagal", {
            description: "Password konfirmasi tidak cocok",
          });
          setIsSubmitting(false);
          return;
        }

        // Check password length
        if (data.password.length < 8) {
          form.setError("password", {
            type: "manual",
            message: "Password minimal 8 karakter",
          });
          toast.error("Validasi Gagal", {
            description: "Password minimal 8 karakter",
          });
          setIsSubmitting(false);
          return;
        }

        // Add password to update data
        updateData.password = data.password;
        updateData.password_confirmation = data.password_confirmation;
      }

      updateData.profile_masjid_id = data.profile_masjid_id || null;

      // Call update API
      await updateAdminMutation.mutateAsync({
        id: adminId,
        data: updateData,
      });

      // Show success toast
      toast.success("Berhasil", {
        description: "Data admin berhasil diperbarui",
      });

      // Redirect back to list
      setTimeout(() => {
        router.push("/admin-masjids");
      }, 500);
    } catch (error: any) {
      console.error("Error updating admin:", error);

      // Show error toast with details
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengupdate admin. Silakan coba lagi.";

      toast.error("Gagal", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-emerald-600" />
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Gagal memuat data admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Admin</h1>
          <p className="text-gray-600 mt-1">
            Update informasi admin:{" "}
            <span className="font-semibold">{admin?.name}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Informasi:</strong> Nama, email, dan username dapat
              diperbarui melalui form ini. Password akan diperbarui hanya jika
              diisi. Kosongkan password jika tidak ingin mengubahnya.
            </p>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register("name")}
              placeholder="Masukkan nama lengkap admin"
              disabled={isSubmitting}
              className={
                form.formState.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="email@example.com"
              disabled={isSubmitting}
              className={
                form.formState.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register("username")}
              placeholder="username_admin"
              disabled={isSubmitting}
              className={
                form.formState.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              }
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru{" "}
              <span className="text-gray-500 font-normal">
                (Kosongkan jika tidak diubah)
              </span>
            </label>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Minimal 8 karakter"
              disabled={isSubmitting}
              className={
                form.formState.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru{" "}
              <span className="text-gray-500 font-normal">
                (Kosongkan jika tidak diubah)
              </span>
            </label>
            <Input
              {...form.register("password_confirmation")}
              type="password"
              placeholder="Ketik ulang password baru"
              disabled={isSubmitting}
              className={
                form.formState.errors.password_confirmation
                  ? "border-red-500"
                  : "border-gray-300"
              }
            />
            {form.formState.errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Profile Masjid Info (Read-only) */}
          {admin?.profileMasjid && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700">
                Masjid Terkait:
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {admin.profileMasjid.nama} ({admin.profileMasjid.slug})
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin-masjids")}
              className="flex-1 h-12"
              disabled={isSubmitting}
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Batal
            </Button>

            <Button
              type="submit"
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting || updateAdminMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
