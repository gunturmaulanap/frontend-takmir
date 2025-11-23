"use client";
import { TakmirListPage } from "@/app/(dashboard)/takmirs/components/ListPage";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useDeleteTakmir } from "@/hooks/useTakmirs";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function TakmirsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [takmirToDelete, setTakmirToDelete] = useState<number | null>(null);
  const { mutate: deleteTakmir, isPending: isDeleting } = useDeleteTakmir();

  const handleDelete = (id: number) => {
    setTakmirToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!takmirToDelete) return;

    toast.loading("Menghapus jamaah...", { id: "delete-jamaah" });

    deleteTakmir(takmirToDelete, {
      onSuccess: () => {
        toast.success("Jamaah berhasil dihapus", { id: "delete-jamaah" });
        setDeleteDialogOpen(false);
        setTakmirToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus jamaah", { id: "delete-jamaah" });
        console.error("Delete error:", error);
      },
    });
  };
  return (
    <div className="max-w-8xl mx-auto p-8 ">
      <PermissionGuard
        permissions={["takmirs.index"]}
        fallback={
          <div className="max-w-4xl mx-auto mt-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to create takmirs.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Only admin and superadmin roles can create takmirs.
              </p>

              <Link
                href="/takmirs"
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        }
      >
        <TakmirListPage onDelete={handleDelete} />
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Hapus Jamaah?"
          description="Jamaah yang dihapus tidak dapat dikembalikan. Semua data terkait jamaah ini akan dihapus."
          isLoading={isDeleting}
        />
      </PermissionGuard>
    </div>
  );
}
