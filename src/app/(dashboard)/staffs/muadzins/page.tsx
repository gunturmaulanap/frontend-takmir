"use client";
import { useState } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { toast } from "sonner";
import { MuadzinListPage } from "@/app/(dashboard)/staffs/muadzins/components/ListPage";
import { useDeleteImam } from "@/hooks/useImams";

export default function MuadzinPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [muadzinToDelete, setMuadzinToDelete] = useState<number | null>(null);
  const { mutate: deleteMuadzin, isPending: isDeleting } = useDeleteImam();

  const handleDelete = (id: number) => {
    setMuadzinToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!muadzinToDelete) return;

    toast.loading("Menghapus muadzin...", { id: "delete-muadzin" });

    deleteMuadzin(muadzinToDelete, {
      onSuccess: () => {
        toast.success("Muadzin berhasil dihapus", { id: "delete-muadzin" });
        setDeleteDialogOpen(false);
        setMuadzinToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus muadzin", { id: "delete-muadzin" });
        console.error("Delete error:", error);
      },
    });
  };
  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <MuadzinListPage onDelete={handleDelete} />
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
