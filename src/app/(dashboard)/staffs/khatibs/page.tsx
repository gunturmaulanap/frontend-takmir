"use client";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { toast } from "sonner";
import { KhatibListPage } from "@/app/(dashboard)/staffs/khatibs/components/ListPage";
import { useDeleteKhatib } from "@/hooks/useKhatibs";

export default function KhatibPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [khatibToDelete, setKhatibToDelete] = useState<number | null>(null);
  const { mutate: deleteKhatib, isPending: isDeleting } = useDeleteKhatib();

  const handleDelete = (id: number) => {
    setKhatibToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!khatibToDelete) return;

    toast.loading("Menghapus khatib...", { id: "delete-khatib" });

    deleteKhatib(khatibToDelete, {
      onSuccess: () => {
        toast.success("Khatib berhasil dihapus", { id: "delete-khatib" });
        setDeleteDialogOpen(false);
        setKhatibToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus khatib", { id: "delete-khatib" });
        console.error("Delete error:", error);
      },
    });
  };
  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <KhatibListPage onDelete={handleDelete} />
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
