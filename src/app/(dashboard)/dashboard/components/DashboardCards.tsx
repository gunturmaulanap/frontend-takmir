"use client";

import React from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaMosque,
  FaUserTie,
  FaCog,
} from "react-icons/fa";

interface DashboardCardsProps {
  userRole: "admin" | "superadmin" | "takmir";
}

export function DashboardCards({ userRole }: DashboardCardsProps) {
  const isSuperAdmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";
  const isTakmir = userRole === "takmir";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Events Card */}
      {(isAdmin || isTakmir) && (
        <Link href="/events" className="group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-purple-500 to-purple-700">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-center mb-4">
                <div className="p-2">
                  <FaClipboardList className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Manajemen Event</h3>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Calendar Card */}
      {(isAdmin || isTakmir) && (
        <Link href="/calenders" className="group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-cyan-500 to-cyan-700">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-center mb-4">
                <div className="p-2">
                  <FaCalendarAlt className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Kalender</h3>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Jamaah Card */}
      {(isAdmin || isTakmir) && (
        <Link href="/jamaahs" className="group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-sky-400 to-sky-600">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-center mb-4">
                <FaUsers className="h-12 w-12" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Manajemen Jamaah</h3>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Takmir Card */}
      {isAdmin && (
        <Link href="/takmirs" className="group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-orange-500 to-red-500">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-center mb-4">
                <div className="p-2">
                  <FaMosque className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Manajemen Takmir</h3>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Staff Card */}
      <Link href="/staff-schedule" className="group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-teal-500 to-emerald-600">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            <div className="flex justify-center mb-4">
              <div className="p-2">
                <FaClipboardList className="h-12 w-12" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Jadwal Petugas</h3>
            </div>
          </div>
        </div>
      </Link>

      {/* Staff Management Card */}
      <Link href="/staffs" className="group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-indigo-500 to-blue-600">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            <div className="flex justify-center mb-4">
              <div className="p-2">
                <FaUserTie className="h-12 w-12" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Manajemen Petugas</h3>
            </div>
          </div>
        </div>
      </Link>

      {/* Finances Card */}
      {isAdmin && (
        <Link href="/finances" className="group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-green-500 to-green-700">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-center mb-4">
                <div className="p-2">
                  <FaMoneyBillWave className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Keuangan Masjid</h3>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Categories Card */}
      <Link href="/categories" className="group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-48 bg-gradient-to-br from-slate-700 to-slate-900">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
          <div className="relative h-full p-8 flex flex-col justify-between text-white">
            <div className="flex justify-center mb-4">
              <div className="p-2">
                <FaCog className="h-12 w-12" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Kategori</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
