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
import CreateCategoryForm from "../components/CreateCategoryForm";
import Link from "next/link";

export default function CreateCategoryPage() {
  return (
    <PermissionGuard
      permissions={["categories.create"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to create categories.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Only admin and superadmin roles can create categories.
            </p>

            <Link
              href="/categories/main"
              className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Back to Category
            </Link>
          </div>
        </div>
      }
    >
      <div className="max-w-8xl mx-auto p-8">
        <CreateCategoryForm />
      </div>
    </PermissionGuard>
  );
}
