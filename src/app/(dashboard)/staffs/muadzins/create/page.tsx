import CreateMuadzinForm from "@/app/(dashboard)/staffs/muadzins/components/CreateMuadzinForm";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";

export default function MuadzinCreatePage() {
  return (
    <PermissionGuard
      permissions={["muadzins.create"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to create muadzin.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Only admin roles can create muadzin.
            </p>
            <Link
              href="/staffs/muadzins"
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Muadzin
            </Link>
          </div>
        </div>
      }
    >
      {" "}
      <div className="max-w-8xl mx-auto p-8">
        <CreateMuadzinForm />
      </div>
    </PermissionGuard>
  );
}
