"use client";

import Link from "next/link";
import { Event } from "@/types/event";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaImage,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import React, { useState } from "react";
import Image from "next/image";
import hasAnyPermission from "@/lib/permissions";

// ✅ Interface Props - Define tipe data yang diterima component
interface EventItemCardProps {
  event: Event;
  onDelete: (id: number) => void; // Delete handler dari parent
}

export function EventItemCard({ event, onDelete }: EventItemCardProps) {
  // ✅ Detect mobile device
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Check screen size on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Handler untuk delete event - Use parent handler
  const handleDelete = (e: React.MouseEvent) => {
    // Prevent navigation ke detail page
    e.preventDefault();
    e.stopPropagation();

    // Use parent handler
    onDelete(event.id);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* ✅ Action Buttons - Selalu terlihat di mobile, hover di desktop */}
      <div
        className={`absolute top-3 right-3 z-10 flex gap-2 transition-opacity duration-200 ${
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {/* Button Edit */}
        {hasAnyPermission(["events.edit"]) && (
          <Link
            href={`/events/edit/${event.slug}`}
            className={`p-2 text-white rounded-lg shadow-md transition-colors duration-200 ${
              isMobile
                ? "bg-blue-500 active:bg-blue-600" // mobile: active state
                : "bg-blue-500 hover:bg-blue-600" // desktop: hover state
            }`}
            title="Edit Event"
          >
            <FaEdit className="h-4 w-4" />
          </Link>
        )}
        {/* Button Delete */}
        {hasAnyPermission(["events.delete"]) && (
          <button
            onClick={handleDelete}
            className={`p-2 text-white rounded-lg shadow-md transition-colors duration-200 ${
              isMobile
                ? "bg-red-500 active:bg-red-600" // mobile: active state
                : "bg-red-500 hover:bg-red-600" // desktop: hover state
            }`}
            title="Hapus Event"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ✅ Card Content - Clickable untuk navigate ke detail dengan SLUG */}
      <Link href={`/events/detail/${event.slug}`} className="block">
        {/* Image Section */}
        {event.image ? (
          <div className="relative w-full h-[32rem] bg-gray-200 overflow-hidden aspect-[3/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              src={event.image}
              alt={event.nama || "Event image"}
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className=" bg-gradient-to-br from-purple-100 w-full h-[32rem] to-blue-100 flex items-center justify-center">
            <FaImage className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {event.nama}
            </h3>
          </div>

          {/* Category Badge */}
          {event.category && (
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                {event.category.nama}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.deskripsi}
          </p>

          {/* Event Info */}
          <div className="space-y-2 text-sm text-gray-600">
            {/* Tanggal */}
            <div className="flex items-center">
              <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatDate(event.tanggal_event)}</span>
            </div>

            {/* Waktu */}
            <div className="flex items-center">
              <FaClock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.waktu_event} WIB</span>
            </div>

            {/* Tempat */}
            <div className="flex items-center">
              <FaMapMarkerAlt className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">{event.tempat_event}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
