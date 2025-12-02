"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  addDays,
  subDays,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  FaCalendarAlt,
  FaPlus,
  FaMapMarkerAlt,
  FaRegClock,
  FaUserGraduate,
  FaUsers,
  FaHandsHelping,
  FaBullhorn,
  FaBookOpen,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useCalendarEvents, CalendarEvent } from "../../../hooks/useCalenders";

// PENTING: Import file CSS kustom kita
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer untuk date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { id },
});

// Helper untuk mendapatkan ikon berdasarkan kategori
const getCategoryIcon = (category?: string) => {
  switch (category) {
    case "Jadwal Khatib":
      return <FaUserGraduate className="text-emerald-500" />;
    case "Kajian Rutin":
      return <FaBookOpen className="text-sky-500" />;
    case "Pelatihan":
      return <FaUsers className="text-teal-500" />;
    case "Sosial":
      return <FaHandsHelping className="text-violet-500" />;
    case "Umum":
      return <FaBullhorn className="text-amber-500" />;
    default:
      return <FaInfoCircle className="text-slate-500" />;
  }
};

// Toolbar Kustom untuk react-big-calendar
const CustomToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = (
  toolbar
) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToCurrent = () => toolbar.onNavigate("TODAY");

  const viewNames: { [key: string]: string } = {
    month: "Bulan",
    week: "Minggu",
    day: "Hari",
    agenda: "Agenda",
  };

  return (
    <div className="rbc-toolbar p-4 bg-slate-50 rounded-t-2xl border-b border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={goToCurrent}
            className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition-all"
          >
            Hari Ini
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToBack}
              className="p-2 bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 transition-all"
            >
              <FaChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 bg-white border border-slate-300 rounded-full shadow-sm hover:bg-slate-100 transition-all"
            >
              <FaChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
        <span className="text-xl font-bold text-slate-700 order-first sm:order-none w-full sm:w-auto text-center">
          {toolbar.label}
        </span>
        <div className="flex items-center rounded-lg border bg-white shadow-sm p-1 border-slate-300">
          {(toolbar.views as string[]).map((view) => (
            <button
              key={view}
              onClick={() => toolbar.onView(view as View)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
                toolbar.view === view
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {viewNames[view]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalenderPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mobileDate, setMobileDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const dateStripRef = useRef<HTMLDivElement>(null);

  // Static detection for mobile/desktop based on screen width at mount time
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  // Always use selectedDate for consistency across desktop and mobile
  const currentFetchDate = selectedDate;

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useCalendarEvents(
    currentFetchDate.getMonth() + 1,
    currentFetchDate.getFullYear()
  );

  // Handler untuk navigation calendar (prev/next month) - desktop
  const handleNavigate = (newDate: Date) => {
    setSelectedDate(newDate);
    setMobileDate(newDate); // Keep mobile date in sync
  };

  // Handler untuk mobile date change
  const handleMobileDateChange = (newDate: Date) => {
    setMobileDate(newDate);
    setSelectedDate(newDate); // Keep selected date in sync
  };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const eventsForSelectedDate = useMemo(() => {
    const dateToFilter = isMobile ? mobileDate : selectedDate;
    return events
      .filter((event) => isSameDay(event.start, dateToFilter))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [selectedDate, mobileDate, events, isMobile]);

  const mobileDateRange = useMemo(() => {
    const startOfMonth = new Date(
      mobileDate.getFullYear(),
      mobileDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      mobileDate.getFullYear(),
      mobileDate.getMonth() + 1,
      0
    );
    const dates = [];

    // Add some days from previous month for better UX
    const prevMonthDays = 3;
    for (let i = prevMonthDays; i > 0; i--) {
      dates.push(subDays(startOfMonth, i));
    }

    // Add all days of current month
    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      dates.push(
        new Date(mobileDate.getFullYear(), mobileDate.getMonth(), day)
      );
    }

    // Add some days from next month for better UX
    const nextMonthDays = 3;
    for (let i = 1; i <= nextMonthDays; i++) {
      dates.push(addDays(endOfMonth, i));
    }

    return dates;
  }, [mobileDate]);

  useEffect(() => {
    if (isMobile && dateStripRef.current) {
      const activeDateElement =
        dateStripRef.current.querySelector(".active-date");
      if (activeDateElement) {
        activeDateElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [isMobile, mobileDate]); // Remove events to prevent unnecessary re-renders

  return (
    <div className=" min-h-screen">
      <div className="hidden lg:block space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Kalender Kegiatan</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-slate-200 relative">
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Memuat kalender...</p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center p-6">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <p className="text-red-600 text-lg font-semibold mb-2">
                    Gagal memuat kalender
                  </p>
                  <p className="text-gray-600 mb-4">{error.message}</p>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            )}

            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "800px" }}
              selectable
              popup
              date={selectedDate}
              view={currentView}
              onView={setCurrentView}
              onSelectEvent={(event: CalendarEvent) =>
                setSelectedDate(event.start)
              }
              onSelectSlot={(slotInfo: any) => setSelectedDate(slotInfo.start)}
              onNavigate={handleNavigate}
              components={{ toolbar: CustomToolbar }}
              className="calendar-container"
            />
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <p className="font-semibold text-slate-500">Agenda untuk</p>
                <p className="text-3xl font-bold mt-1 text-slate-800">
                  {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                </p>
                <p className="text-lg font-medium text-slate-400">
                  {format(selectedDate, "EEEE", { locale: id })}
                </p>
              </div>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-md border p-4 transition-all hover:shadow-lg hover:border-indigo-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 text-2xl">
                          {getCategoryIcon(event.resource.category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {event.title}
                          </p>
                          <div className="mt-2 text-sm space-y-1.5 text-slate-600">
                            <p className="flex items-center gap-2">
                              <FaRegClock />
                              <span>{format(event.start, "HH:mm")} WIB</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <FaMapMarkerAlt />
                              <span>
                                {event.resource?.location || "Masjid"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl shadow-md border">
                    <FaCalendarAlt className="mx-auto text-4xl text-slate-300" />
                    <p className="mt-4 font-semibold text-slate-600">
                      Tidak ada agenda
                    </p>
                    <p className="text-sm text-slate-400">
                      Pilih tanggal lain untuk melihat.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================== MOBILE VIEW ========================= */}
      <div className="block lg:hidden pb-20">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-slate-800">Kalender</h1>
          <p className="text-md text-slate-500">
            Lihat dan kelola agenda kegiatan
          </p>
        </div>

        {/* Month/Year Navigation for Mobile */}
        <div className="bg-white mx-4 mb-4 rounded-2xl shadow-lg">
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={() => {
                const prevMonth = new Date(
                  mobileDate.getFullYear(),
                  mobileDate.getMonth() - 1,
                  1
                );
                handleMobileDateChange(prevMonth);
              }}
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <FaChevronLeft className="h-4 w-4 text-slate-600" />
            </button>

            <div className="text-center">
              <h2 className="font-bold text-lg text-slate-800">
                {format(mobileDate, "MMMM yyyy", { locale: id })}
              </h2>
              <p className="text-sm text-slate-500">
                Pilih bulan untuk melihat agenda
              </p>
            </div>

            <button
              onClick={() => {
                const nextMonth = new Date(
                  mobileDate.getFullYear(),
                  mobileDate.getMonth() + 1,
                  1
                );
                handleMobileDateChange(nextMonth);
              }}
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <FaChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Month Summary */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Events</span>
                <span className="font-bold text-indigo-600">
                  {events.length}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  const today = new Date();
                  handleMobileDateChange(today);
                }}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
              >
                Hari Ini
              </button>
              <button
                onClick={() => {
                  const nextWeek = addDays(new Date(), 7);
                  handleMobileDateChange(nextWeek);
                }}
                className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
              >
                Minggu Depan
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mx-4">
          <div className="p-4 flex items-center justify-between border-b border-slate-200">
            <h2 className="font-bold text-slate-700">Pilih Tanggal</h2>
            <p className="font-semibold text-indigo-600">
              {format(mobileDate, "dd MMM", { locale: id })}
            </p>
          </div>
          <div
            ref={dateStripRef}
            className="flex space-x-2 overflow-x-auto p-4 scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {mobileDateRange.map((date) => {
              const isActive = isSameDay(date, mobileDate);
              const isCurrentMonth = date.getMonth() === mobileDate.getMonth();
              const hasEvents = events.some((event: CalendarEvent) =>
                isSameDay(event.start, date)
              );
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={date.toString()}
                  onClick={() => handleMobileDateChange(date)}
                  className={`relative flex-shrink-0 text-center py-2 px-3 rounded-lg cursor-pointer transition-all w-16 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg active-date"
                      : isToday
                      ? "bg-blue-100 border-2 border-blue-400 hover:bg-blue-200"
                      : isCurrentMonth
                      ? "bg-white border border-slate-200 hover:bg-slate-100"
                      : "bg-slate-50 border border-slate-100 opacity-60"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isActive
                        ? "text-indigo-200"
                        : isToday
                        ? "text-blue-600"
                        : isCurrentMonth
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {format(date, "E", { locale: id })}
                  </p>
                  <p
                    className={`text-xl font-bold mt-1 ${
                      isActive
                        ? "text-white"
                        : isToday
                        ? "text-blue-700"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {format(date, "d")}
                  </p>

                  {/* Event indicator */}
                  {hasEvents && !isActive && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isToday ? "bg-blue-500" : "bg-indigo-500"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <h2 className="font-bold text-slate-700">
            {format(mobileDate, "EEEE, dd MMMM yyyy", { locale: id })}
          </h2>

          {/* Loading state */}
          {isLoading && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat events...</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 text-center">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <p className="text-red-600 font-semibold mb-2">
                Gagal memuat events
              </p>
              <p className="text-gray-600 text-sm mb-4">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Events for selected date */}
          {!isLoading && !error && (
            <>
              {eventsForSelectedDate.length > 0 ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-700 font-medium">
                      📅 {eventsForSelectedDate.length} agenda untuk hari ini
                    </p>
                  </div>

                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-md border border-slate-200 p-4 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 text-2xl">
                          {getCategoryIcon(event.resource.category)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">
                            {event.title}
                          </p>
                          <div className="mt-2 text-sm space-y-1.5 text-slate-600">
                            <p className="flex items-center gap-2">
                              <FaRegClock />
                              <span>{format(event.start, "HH:mm")} WIB</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <FaMapMarkerAlt />
                              <span>
                                {event.resource?.location || "Masjid"}
                              </span>
                            </p>
                            {event.resource?.description && (
                              <p className="text-slate-600 mt-2 text-sm">
                                {event.resource.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Show all events for the month if no events for selected date */}
                  {events.length > 0 ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-700 font-medium">
                          📅 Tidak ada agenda untuk hari ini
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Menampilkan semua agenda bulan{" "}
                          {format(mobileDate, "MMMM", { locale: id })}
                        </p>
                      </div>

                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white rounded-xl shadow-md border border-slate-200 p-4 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1 text-2xl">
                              {getCategoryIcon(event.resource.category)}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800">
                                {event.title}
                              </p>
                              <div className="mt-2 text-sm space-y-1.5 text-slate-600">
                                <p className="flex items-center gap-2">
                                  <FaCalendarAlt />
                                  <span>
                                    {format(event.start, "dd MMM yyyy", {
                                      locale: id,
                                    })}
                                  </span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaRegClock />
                                  <span>
                                    {format(event.start, "HH:mm")} WIB
                                  </span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <FaMapMarkerAlt />
                                  <span>
                                    {event.resource?.location || "Masjid"}
                                  </span>
                                </p>
                                {event.resource?.description && (
                                  <p className="text-slate-600 mt-2 text-sm">
                                    {event.resource.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
                      <FaCalendarAlt className="mx-auto text-5xl text-slate-300" />
                      <p className="mt-4 font-semibold text-slate-600">
                        Tidak ada agenda
                      </p>
                      <p className="text-sm text-slate-400">
                        Belum ada agenda untuk bulan{" "}
                        {format(mobileDate, "MMMM yyyy", { locale: id })}.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <button className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 transition-transform hover:scale-110 z-20">
          <FaPlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalenderPage;
