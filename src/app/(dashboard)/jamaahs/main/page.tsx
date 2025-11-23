"use client";

import { useState } from "react";
import { JamaahListPage } from "@/app/(dashboard)/jamaahs/components/ListPage";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useDeleteJamaah } from "@/hooks/useJamaahs";
import { toast } from "sonner";

const JamaahPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jamaahToDelete, setJamaahToDelete] = useState<number | null>(null);
  const { mutate: deleteJamaah, isPending: isDeleting } = useDeleteJamaah();

  const handleDelete = (id: number) => {
    setJamaahToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!jamaahToDelete) return;

    toast.loading("Menghapus jamaah...", { id: "delete-jamaah" });

    deleteJamaah(jamaahToDelete, {
      onSuccess: () => {
        toast.success("Jamaah berhasil dihapus", { id: "delete-jamaah" });
        setDeleteDialogOpen(false);
        setJamaahToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus jamaah", { id: "delete-jamaah" });
        console.error("Delete error:", error);
      },
    });
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <JamaahListPage onDelete={handleDelete} />
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
};

export default JamaahPage;
