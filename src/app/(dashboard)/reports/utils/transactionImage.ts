const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export const isImagePath = (path: string) => {
  const lower = path.toLowerCase();
  return imageExtensions.some((ext) => lower.includes(ext));
};

export const resolveTransactionImageUrl = (path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/storage")) {
    return `${baseUrl}${path}`;
  }

  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }

  return `${baseUrl}/storage/${path}`;
};
