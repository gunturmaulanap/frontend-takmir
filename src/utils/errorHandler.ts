/**
 * ============================================
 * ERROR HANDLING UTILITY
 * ============================================
 * Utility untuk parsing API error responses secara konsisten
 * digunakan di semua form components
 */

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

/**
 * Parse API error response dan return error message yang user-friendly
 * @param error - Error object dari API response
 * @returns Error message yang sudah diformat
 */
export const parseApiError = (error: unknown): string => {
  const errorResponse = error as ApiErrorResponse;

  // Handle validation errors (422)
  if (errorResponse?.response?.data?.errors) {
    const errors = errorResponse.response.data.errors;
    const errorFields = Object.keys(errors).map(
      (key) => `${errors[key].join(", ")}`
    );
    return errorFields.join("\n");
  }

  // Handle single message errors
  if (errorResponse?.response?.data?.message) {
    return errorResponse.response.data.message;
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback untuk error yang tidak diketahui
  return "Terjadi kesalahan. Silakan coba lagi.";
};

