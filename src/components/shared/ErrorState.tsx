/**
 * ============================================
 * ERROR STATE - SHARED COMPONENT
 * ============================================
 * Komponen error state yang konsisten untuk semua page
 */

import { Button } from "@/components/ui/button";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto">
        <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Ada Masalah
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <FaRedo className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
}
