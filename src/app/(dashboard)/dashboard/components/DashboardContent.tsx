"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardCards } from "./DashboardCards";
import { FaMosque, FaMapMarkerAlt } from "react-icons/fa";

export function DashboardContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  // Get mosque info from profile_masjid
  const mosqueName = user.profile_masjid?.nama || "Sistem Manajemen Masjid";
  const mosqueAddress = user.profile_masjid?.alamat || "Belum ada data masjid";

  // Extract role from roles array or fallback to role property
  const roleValue = Array.isArray(user.roles)
    ? user.roles[0]
    : user.role;

  const userRole = (roleValue?.toLowerCase() || "admin") as
    | "admin"
    | "superadmin"
    | "takmir";

  return (
    <>
      {/* Mosque Info Header */}
      <div className="bg-white rounded-lg shadow-sm border p-2 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <FaMosque className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mosqueName}
              </h1>
              {userRole !== "superadmin" && (
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                  <p className="text-sm">{mosqueAddress}</p>
                </div>
              )}
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  {userRole === "superadmin"
                    ? "Super Administrator"
                    : userRole === "takmir"
                    ? "Pengurus Takmir"
                    : "Pengurus Masjid"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Role: {userRole} • {user.email}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards userRole={userRole} />
    </>
  );
}
