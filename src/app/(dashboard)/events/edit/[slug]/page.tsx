import EditEventForm from "@/app/(dashboard)/events/components/EditEventForm";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";
import { use } from "react";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <PermissionGuard
      permissions={["events.edit"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to edit events.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Only admin roles can edit events.
            </p>
            <Link
              href="/events"
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Back to Events
            </Link>
          </div>
        </div>
      }
    >
      {" "}
      <div className="max-w-8xl mx-auto p-8">
        <EditEventForm slug={slug} />
      </div>
    </PermissionGuard>
  );
}
