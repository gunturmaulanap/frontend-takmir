import { LoginForm } from "./Form";
import { MosqueIcon } from "@/components/icons/MosqueIcon";

export default function LoginClient() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center justify-center space-x-2 mb-4"
          >
            <MosqueIcon width={60} height={60} className="text-emerald-600" />
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-600">
            Silakan login untuk melanjutkan ke dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Belum punya akun?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <a
              href="/auth/register"
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 Mosque Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}