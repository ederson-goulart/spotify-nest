"use server";

export async function fetchBandsForSelectAction() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://spotify-backoffice-nestjs:3000";
    const response = await fetch(`${backendUrl}/api/band?take=1000`, {
      cache: "no-store",
    });
    const result = await response.json();
    if (result.success && result.data?.bands) {
      return result.data.bands.map((b: any) => ({ id: b.id, name: b.name }));
    }
    return [];
  } catch (error) {
    console.error("Erro na Server Action fetchBandsForSelectAction:", error);
    return [];
  }
}
