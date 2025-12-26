"use client";

import { useState } from "react";
import { StaffScheduleListPage } from "@/app/(dashboard)/staff-schedules/components/ListPage";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { useDeleteStaffSchedule } from "@/hooks/useStaffSchedules";
import { toast } from "sonner";

const StaffSchedulePage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffScheduleToDelete, setStaffScheduleToDelete] = useState<
    number | null
  >(null);
  const { mutate: deleteStaffSchedule, isPending: isDeleting } =
    useDeleteStaffSchedule();

  const handleDelete = (id: number) => {
    setStaffScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!staffScheduleToDelete) return;

    toast.loading("Menghapus jadwal petugas...", {
      id: "delete-staff-schedule",
    });

    deleteStaffSchedule(staffScheduleToDelete, {
      onSuccess: () => {
        toast.success("Jadwal petugas berhasil dihapus", {
          id: "delete-staff-schedule",
        });
        setDeleteDialogOpen(false);
        setStaffScheduleToDelete(null);
      },
      onError: (error) => {
        toast.error("Gagal menghapus jadwal petugas", {
          id: "delete-staff-schedule",
        });
        console.error("Delete error:", error);
      },
    });
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto p-6">
        <StaffScheduleListPage onDelete={handleDelete} />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Hapus Jadwal Petugas?"
        description="Jadwal petugas yang dihapus tidak dapat dikembalikan. Semua data terkait jadwal ini akan dihapus."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StaffSchedulePage;
