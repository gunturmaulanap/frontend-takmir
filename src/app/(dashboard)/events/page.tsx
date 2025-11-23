"use client";

import { hasAnyPermission } from "@/lib/permissions";
import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Selamat Datang di Event Management
      </h1>
      <p className="text-gray-600 mb-8">
        Pilih menu di sebelah kiri untuk mengelola events masjid.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/events/main">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              Kelola Event
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat dan kelola semua event masjid
            </p>
            <p className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group-hover:text-blue-700 transition-colors">
              Lihat Events
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </p>
          </div>
        </Link>
        {hasAnyPermission(["events.create", "events.store"]) && (
          <Link href="/events/create">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                Buat Event Baru
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Tambahkan event baru untuk masjid
              </p>
              <p className="inline-flex items-center text-green-600 hover:text-green-800 font-medium group-hover:text-green-700 transition-colors">
                Buat Event
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
