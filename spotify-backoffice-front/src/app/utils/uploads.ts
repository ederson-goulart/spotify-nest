export function getPublicUploadUrl(objectKey: string | null | undefined) {
  if (!objectKey) return "";
  const key = objectKey.replace(/^uploads\//, "");
  const baseUrl = process.env.NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL;
  if (!baseUrl) return `/uploads/${key}`;
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  if (cleanBaseUrl.endsWith("/uploads")) {
    return `${cleanBaseUrl}/${objectKey}`;
  }
  return `${cleanBaseUrl}/uploads/${objectKey}`;
}
