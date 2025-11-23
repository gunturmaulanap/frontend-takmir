import React from "react";
import { Navbar } from "@/components/web/layout/navbar";
import { FeatureCard } from "@/components/web/card";
import { FaDatabase, FaUsers, FaCogs } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Welcome Message */}
      <section className="relative bg-gradient-to-br from-primary/10 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Selamat Datang di
              <span className="text-primary block">Beranda Event</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Temukan dan ikuti berbagai kegiatan dan event menarik di masjid kami.
              Mari bersama-sama memperkuat silaturahmi dan kebaikan melalui kegiatan yang bermanfaat.
            </p>
            <a
              href="/events"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1 rounded-lg text-lg px-8 py-3 font-medium transition-all duration-300 ease-out"
            >
              <span>Lihat Semua Event</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Event Mendatang
            </h2>
            <p className="text-lg text-gray-600">
              Jangan lewatkan kegiatan bermanfaat yang akan datang
            </p>
          </div>

          {/* Event Cards Preview */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kajian Rutin</h3>
                  <p className="text-sm text-gray-500">Setiap Ahad</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Kajian Islam rutin setiap Ahad pagi bersama Ustadz terkemuka.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">08:00 - 10:00 WIB</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Rutin</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pengajian Anak</h3>
                  <p className="text-sm text-gray-500">Sabtu, 25 Nov 2024</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Pengajian khusus untuk anak-anak dengan metode pembelajaran yang menyenangkan.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">09:00 - 11:00 WIB</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Anak-anak</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Donasi Bangunan</h3>
                  <p className="text-sm text-gray-500">Program Berkelanjutan</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Mari bersama-sama membangun masjid yang lebih baik dan nyaman untuk ibadah.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Open Donasi</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Donasi</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/events"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-lg px-8 py-3 font-medium transition-colors"
            >
              <span>Lihat Semua Event</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              About The App
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our Mosque Management System is designed to simplify and modernize
              how mosques operate. Whether you're managing events, tracking
              congregants, scheduling staff, or handling finances, our platform
              provides the tools you need to run your mosque efficiently and
              effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our System is Important
            </h2>
            <p className="text-lg text-gray-600">
              Discover the key benefits that make our system essential for
              modern mosque management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaDatabase}
              title="Centralized Data"
              description="Keep all your mosque information organized in one secure, accessible location. No more scattered spreadsheets or lost records."
            />
            <FeatureCard
              icon={FaUsers}
              title="Community Engagement"
              description="Strengthen connections with your congregation through better communication tools and event management capabilities."
            />
            <FeatureCard
              icon={FaCogs}
              title="Efficient Operations"
              description="Automate routine tasks and streamline administrative processes to focus more on what matters most - serving your community."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Mosque Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
