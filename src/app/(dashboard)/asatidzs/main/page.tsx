"use client";

import { useState } from "react";
import { AsatidzListPage } from "@/app/(dashboard)/asatidzs/components/ListPage";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useDeleteAsatidz } from "@/hooks/useAsatidzs";
import { toast } from "sonner";

const AsatidzMainPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [asatidzToDelete, setAsatidzToDelete] = useState<number | null>(null);
  const { mutate: deleteAsatidz, isPending: isDeleting } = useDeleteAsatidz();

  const handleDelete = (id: number) => {
    setAsatidzToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!asatidzToDelete) return;

    toast.loading("Menghapus asatidz...", { id: "delete-asatidz" });

    deleteAsatidz(asatidzToDelete, {
      onSuccess: () => {
        toast.success("Asatidz berhasil dihapus", { id: "delete-asatidz" });
        setDeleteDialogOpen(false);
        setAsatidzToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus asatidz", { id: "delete-asatidz" });
        console.error("Delete error:", error);
      },
    });
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <AsatidzListPage onDelete={handleDelete} />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Asatidz?"
        description="Asatidz yang dihapus tidak dapat dikembalikan. Semua data terkait asatidz ini akan dihapus."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AsatidzMainPage;
