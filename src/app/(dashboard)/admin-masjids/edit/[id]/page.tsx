"use client";

import { useParams } from "next/navigation";
import { EditAdminForm } from "../../components/EditAdminForm";

export default function EditAdminPage() {
  const params = useParams();
  const adminId = parseInt(params.id as string);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <EditAdminForm adminId={adminId} />
    </div>
  );
}
