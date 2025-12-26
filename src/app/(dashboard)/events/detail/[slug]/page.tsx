/**
 * ============================================
 * EVENT DETAIL PAGE (READ-ONLY) - SLUG-BASED
 * ============================================
 * URL: /events/kajian-rutin-jumat/detail
 *
 * Menggunakan:
 * - Global state dari Tanstack Query (useEventBySlug)
 * - Shared LoadingSpinner & ErrorState components
 * - SEO-friendly slug URLs
 */

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaEdit,
} from "react-icons/fa";
import Image from "next/image";
import { use } from "react";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // Get all events dan find by slug - SIMPLE (seperti categories)
  const { data: eventData, isLoading, isError, error, refetch } = useEvents();

  // Handle both array and paginated response
  const events = Array.isArray(eventData) ? eventData : eventData?.data || [];
  const event = events.find((event: any) => event.slug === slug);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Memuat detail event..." />;
  }

  // Error state
  if (isError || !event) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ErrorState
          message={
            error?.message?.includes("not found") ||
            error?.message?.includes("404")
              ? `Event dengan slug "${slug}" tidak ditemukan. Mungkin slug telah berubah atau event sudah dihapus.`
              : "Terjadi kesalahan saat memuat event."
          }
          onRetry={refetch}
        />
        <div className="text-center mt-4">
          <Link href="/events">
            <Button variant="outline" className="flex items-center mx-auto">
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/events/main">
          <Button variant="outline" className="flex items-center">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <Link href={`/events/edit/${slug}`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center">
            <FaEdit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </Link>
      </div>

      {/* Event Detail Card */}
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden  ">
          {/* Event Image */}
          {event.image && (
            <div className="w-full  bg-gray-100 flex items-center justify-center relative h-[32rem] md:h-[48rem] aspect-[3/4]">
              <Image
                src={event.image}
                alt={event.nama}
                className="object-cover mx-auto"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          )}

          {/* Event Content */}
          <div className="p-6 md:p-8 w-full max-w-lg mx-auto flex flex-col items-center">
            {/* Category Badge */}
            {event.category && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  <FaTag className="mr-2 h-3 w-3" />
                  {event.category.nama}
                </span>
              </div>
            )}

            {/* Event Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              {event.nama}
            </h1>

            {/* Event Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg w-full">
              {/* Tanggal */}
              <div className="flex items-start justify-center">
                <FaCalendarAlt className="h-5 w-5 text-emerald-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tanggal</p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(event.tanggal_event).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Waktu */}
              <div className="flex items-start justify-center">
                <FaClock className="h-5 w-5 text-emerald-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Waktu</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.waktu_event} WIB
                  </p>
                </div>
              </div>

              {/* Lokasi */}
              <div className="flex items-start justify-center">
                <FaMapMarkerAlt className="h-5 w-5 text-emerald-600 mr-3 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lokasi</p>
                  <p className="text-base font-semibold text-gray-900">
                    {event.tempat_event || "Lokasi belum ditentukan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="w-full text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Deskripsi Event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.deskripsi}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
