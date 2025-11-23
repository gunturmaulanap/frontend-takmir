import EditTakmirForm from "@/app/(dashboard)/takmirs/components/EditTakmirForm";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";
import EditJamaahForm from "../../components/EditJamaahForm";

export default function EditJamaahPage() {
  return (
    <PermissionGuard
      permissions={["jamaahs.edit"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to edit jamaah.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Only admin roles can edit jamaah.
            </p>
            <Link
              href="/jamaahs"
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Jamaah
            </Link>
          </div>
        </div>
      }
    >
      {" "}
      <div className="max-w-8xl mx-auto p-8">
        <EditJamaahForm />
      </div>
    </PermissionGuard>
  );
}
