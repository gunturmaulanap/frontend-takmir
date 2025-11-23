import EditTakmirForm from "@/app/(dashboard)/takmirs/components/EditTakmirForm";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";

export default function EditTakmirPage() {
  return (
    <PermissionGuard
      permissions={["takmirs.edit"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to edit takmirs.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Required permissions: takmirs.edit or takmirs.update
            </p>
            <Link
              href="/takmirs"
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Takmir
            </Link>
          </div>
        </div>
      }
    >
      {" "}
      <div className="max-w-8xl mx-auto p-8">
        <EditTakmirForm />
      </div>
    </PermissionGuard>
  );
}
