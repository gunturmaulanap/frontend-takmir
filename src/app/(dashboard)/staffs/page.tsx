import Link from "next/link";

export default function StaffPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Selamat Datang di Petugas Masjid Management
      </h1>
      <p className="text-gray-600 mb-8">
        Pilih menu di sebelah kiri untuk mengelola data petugas masjid masjid.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/staffs/imams">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg
                  className="h-6 w-6  transition-transform text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
              Kelola Imam
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat dan kelola semua imam masjid
            </p>
            <p className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium group-hover:text-orange-700 transition-colors">
              Lihat Imam
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
        <Link href="/staffs/khatibs">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <svg
                  className="h-6 w-6  transition-transform text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
              Kelola Khatib
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat dan kelola semua khatib masjid
            </p>
            <p className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium group-hover:text-emerald-700 transition-colors">
              Lihat Khatib
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

        <Link href="/staffs/muadzins">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg
                  className="h-6 w-6  transition-transform text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
              Kelola Muadzin
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat dan kelola semua muadzin masjid
            </p>
            <p className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group-hover:text-indigo-700 transition-colors">
              Lihat Muadzin
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
      </div>
    </div>
  );
}
