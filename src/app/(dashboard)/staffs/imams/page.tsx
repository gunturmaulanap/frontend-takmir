"use client";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { toast } from "sonner";
import { ImamListPage } from "@/app/(dashboard)/staffs/imams/components/ListPage";
import { useDeleteImam } from "@/hooks/useImams";

export default function ImamPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imamToDelete, setImamToDelete] = useState<number | null>(null);
  const { mutate: deleteImam, isPending: isDeleting } = useDeleteImam();

  const handleDelete = (id: number) => {
    setImamToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!imamToDelete) return;

    toast.loading("Menghapus imam...", { id: "delete-imam" });

    deleteImam(imamToDelete, {
      onSuccess: () => {
        toast.success("Imam berhasil dihapus", { id: "delete-imam" });
        setDeleteDialogOpen(false);
        setImamToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus imam", { id: "delete-imam" });
        console.error("Delete error:", error);
      },
    });
  };
  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <ImamListPage onDelete={handleDelete} />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Jamaah?"
        description="Jamaah yang dihapus tidak dapat dikembalikan. Semua data terkait jamaah ini akan dihapus."
        isLoading={isDeleting}
      />
    </div>
  );
}
