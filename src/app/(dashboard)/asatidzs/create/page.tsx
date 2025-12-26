"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import Link from "next/link";
import CreateAsatidzForm from "../components/CreateAsatidzForm";

export default function CreateAsatidzPage() {
  return (
    <PermissionGuard
      permissions={["asatidzs.create"]}
      fallback={
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to create asatidz.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Only admin and takmir roles can create asatidz.
            </p>

            <Link
              href="/asatidzs/main"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Asatidz
            </Link>
          </div>
        </div>
      }
    >
      <div className="max-w-8xl mx-auto p-8">
        <CreateAsatidzForm />
      </div>
    </PermissionGuard>
  );
}
