import Link from "next/link";

export default function ReportPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Selamat Datang di Laporan Keuangan
      </h1>
      <p className="text-gray-600 mb-8">
        Pilih menu di sebelah kiri untuk mengelola laporan keuangan masjid.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/reports/dashboard">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
              Dashboard Keuangan
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat statistik dan grafik keuangan masjid
            </p>
            <p className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium group-hover:text-purple-700 transition-colors">
              Lihat Dashboard
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

        <Link href="/reports/main">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer group">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
              Kelola Transaksi
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Lihat dan kelola semua transaksi keuangan
            </p>
            <p className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium group-hover:text-emerald-700 transition-colors">
              Lihat Transaksi
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
