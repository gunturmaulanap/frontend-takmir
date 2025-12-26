"use client";

import { useState } from "react";
import ReportList from "@/app/(dashboard)/reports/components/ListPage";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useDeleteTransaction } from "@/hooks/useReports";
import { toast } from "sonner";

const ReportMainPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();

  const handleDelete = (id: number) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!transactionToDelete) return;

    toast.loading("Menghapus transaksi...", { id: "delete-transaction" });

    deleteTransaction(transactionToDelete, {
      onSuccess: () => {
        toast.success("Transaksi berhasil dihapus", {
          id: "delete-transaction",
        });
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus transaksi", { id: "delete-transaction" });
        console.error("Delete error:", error);
      },
    });
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <ReportList onDelete={handleDelete} />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Transaksi?"
        description="Transaksi yang dihapus tidak dapat dikembalikan. Semua data terkait transaksi ini akan dihapus."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ReportMainPage;
