/**
 * ============================================
 * EDIT TAKMIR FORM COMPONENT
 * ============================================
 * Menggunakan:
 * - React Hook Form + Zod validation
 * - useUpdateTakmir mutation dari Tanstack Query
 * - useTakmirBySlug untuk fetch data takmir
 * - Form styling yang konsisten dengan CreateTakmirForm
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TakmirUpdateFormValues,
  takmirUpdateSchema,
  UserAccountEditFormValues,
  userAccountEditSchema,
} from "../schema/takmirSchema";
import { useUpdateTakmir, useTakmirs } from "@/hooks/useTakmirs";
import { TakmirUpdateWithUserData } from "@/types/takmir";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
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
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { parseApiError } from "@/utils/errorHandler";

export default function EditTakmirForm() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const { data: paginatedTakmirs, isLoading, isError } = useTakmirs();
  const takmirs = paginatedTakmirs?.data || [];
  const takmir = takmirs.find((takmir) => takmir.slug === slug);

  // ✅ Store initial takmir data to prevent error state when slug changes
  const [initialTakmir, setInitialTakmir] = useState(takmir);

  // ✅ Global state - Update takmir mutation
  const updateTakmirMutation = useUpdateTakmir();

  // ✅ State untuk loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ State untuk active tab
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

  // ✅ React Hook Form - Profile form (data takmir)
  const profileForm = useForm<TakmirUpdateFormValues>({
    resolver: zodResolver(takmirUpdateSchema),
    defaultValues: {
      nama: "",
      no_handphone: "",
      jabatan: "",
      deskripsi_tugas: "",
      is_active: true,
    },
    mode: "onChange",
  });

  // ✅ React Hook Form - Account form (tidak digunakan, tapi tetap dibuat untuk consistency)
  const accountForm = useForm<UserAccountEditFormValues>({
    resolver: zodResolver(userAccountEditSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  /**
   * EFFECT: Store initial takmir data and populate forms
   */
  useEffect(() => {
    if (takmir && !initialTakmir) {
      // Store the initial takmir data when first loaded
      setInitialTakmir(takmir);
    }

    if (takmir) {
      // ✅ Populate profile form (data takmir)
      const profileData = {
        nama: takmir.nama || "",
        no_handphone: takmir.no_handphone || "",
        umur: takmir.umur ? Number(takmir.umur) : undefined,
        jabatan: takmir.jabatan || "",
        deskripsi_tugas: takmir.deskripsi_tugas || "",
        is_active: Boolean(takmir.user?.is_active),
      };

      profileForm.reset(profileData);

      // ✅ Populate account form (data user)
      const accountData = {
        username: takmir.user?.username || takmir.username || "",
        email: takmir.user?.email || "",
        password: "", // Kosongkan password saat edit
        password_confirmation: "", // Kosongkan password confirmation saat edit
      };

      accountForm.reset(accountData);
    }
  }, [takmir, initialTakmir, profileForm, accountForm]);

  /**
   * HANDLER: Update Profile Takmir
   */
  const onProfileSubmit = async (profileData: TakmirUpdateFormValues) => {
    const currentTakmir = takmir || initialTakmir;
    if (!currentTakmir)
      return toast.error("Data takmir tidak ditemukan", {
        id: "update-profile",
      });

    setIsSubmitting(true);
    toast.loading("Mengupdate data profile takmir...", {
      id: "update-profile",
    });

    try {
      const accountData = accountForm.getValues();
      const submitData: TakmirUpdateWithUserData = {
        ...profileData,
        is_active: currentTakmir.user?.is_active,
        username: accountData.username,
        email: accountData.email,
      };

      await updateTakmirMutation.mutateAsync({
        id: currentTakmir.id,
        data: submitData,
      });

      toast.success("Profile takmir berhasil diupdate!", {
        id: "update-profile",
      });
      router.push("/takmirs/main");
    } catch (error) {
      toast.error(parseApiError(error), { id: "update-profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * HANDLER: Update Profile dengan Data dari Account Tab
   * Note: Username, Email, Password dihandle oleh backend secara internal
   */
  const onAccountSubmit = async (accountData: UserAccountEditFormValues) => {
    const currentTakmir = takmir || initialTakmir;
    if (!currentTakmir)
      return toast.error("Data takmir tidak ditemukan", {
        id: "update-account",
      });

    setIsSubmitting(true);
    toast.loading("Mengupdate data account takmir...", {
      id: "update-account",
    });

    try {
      const profileData = profileForm.getValues();
      const submitData: TakmirUpdateWithUserData = {
        ...profileData,
        is_active: currentTakmir.user?.is_active ?? true,
        ...accountData,
      };

      await updateTakmirMutation.mutateAsync({
        id: currentTakmir.id,
        data: submitData,
      });

      toast.success("Profile takmir berhasil diupdate!", {
        id: "update-account",
      });
      router.push("/takmirs/main");
    } catch (error) {
      toast.error(parseApiError(error), { id: "update-account" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Show loading state only if we have no initial data and still loading
  if (isLoading && !initialTakmir) {
    return <LoadingSpinner message="Memuat data takmirs..." />;
  }

  // ✅ Error state - Show if data is loaded but takmir not found OR if there's an error
  if (isError || (!isLoading && !takmir && !initialTakmir)) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={`Takmir dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau data sudah dihapus.`}
        />
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => router.push("/takmirs/main")}
            className="flex items-center mx-auto"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Kembali ke Daftar Takmir
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Takmir</h1>
          <p className="text-gray-600 mt-1">
            Update informasi takmir:{" "}
            <span className="font-semibold">
              {takmir?.nama || initialTakmir?.nama}
            </span>
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile Takmir
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "account"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Account User
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Profile Takmir
                </h3>
                {/* Nama Lengkap */}
                <FormField
                  control={profileForm.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan nama lengkap takmir"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Nomor Handphone */}
                <FormField
                  control={profileForm.control}
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
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Umur */}
                <FormField
                  control={profileForm.control}
                  name="umur"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Umur <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan umur"
                          disabled={isSubmitting}
                          value={value ?? ""}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            onChange(newValue ? Number(newValue) : null);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Jabatan */}
                <FormField
                  control={profileForm.control}
                  name="jabatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Jabatan <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Contoh: Ketua Takmir, Bendahara, dll"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Deskripsi Tugas */}
                <FormField
                  control={profileForm.control}
                  name="deskripsi_tugas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Deskripsi Tugas <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Jelaskan tugas dan tanggung jawab takmir..."
                          rows={4}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/takmirs/main")}
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
                    {isSubmitting || updateTakmirMutation.isPending ? (
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
          )}

          {activeTab === "account" && (
            <Form {...accountForm}>
              <form
                onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informasi Account User
                </h3>

                {/* Note: Password can be updated here */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Informasi:</strong> Username dan email dapat
                    diperbarui melalui form ini. Password akan diperbarui hanya
                    jika diisi. Kosongkan password jika tidak ingin mengubahnya.
                  </p>
                </div>

                {/* Username */}
                <FormField
                  control={accountForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="username_takmir"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@example.com"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={accountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Password{" "}
                        <span className="text-sm text-gray-500">
                          (Kosongkan jika tidak diubah)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Minimal 6 karakter"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={accountForm.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Confirm Password{" "}
                        <span className="text-sm text-gray-500">
                          (Kosongkan jika tidak diubah)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Ketik ulang password baru"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/takmirs/main")}
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
                    {isSubmitting || updateTakmirMutation.isPending ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                        Menyimpan Account...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Update Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
