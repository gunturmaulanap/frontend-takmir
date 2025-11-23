/**
 * ============================================
 * CREATE EVENT PAGE - PERMISSION PROTECTED
 * ============================================
 * Menggunakan:
 * - Permission Guard untuk role-based access control
 * - CreateEventForm component
 * - Spatie Laravel permissions integration
 */

"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import CreateEventForm from "@/app/(dashboard)/events/components/CreateEventForm";
import Link from "next/link";

export default function CreateEventPage() {
  return (
    <PermissionGuard
      permissions={["events.create"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to create events.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Only admin and superadmin roles can create events.
            </p>

            <Link
              href="/events"
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Events
            </Link>
          </div>
        </div>
      }
    >
      <div className="max-w-8xl mx-auto p-8">
        <CreateEventForm />
      </div>
    </PermissionGuard>
  );
}
