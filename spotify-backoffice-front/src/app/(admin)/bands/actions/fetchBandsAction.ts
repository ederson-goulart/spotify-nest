"use server";

export async function fetchBandsAction(page: number = 1, take: number = 10) {
  console.log("Executado no contexto do servidor");

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://spotify-backoffice-nestjs:3000";
    const response = await fetch(`${backendUrl}/api/band?page=${page}&take=${take}`, {
      cache: "no-store",
    });

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
    return {
      pagination: { currentPage: page, totalItems: 0, totalPages: 0 },
      bands: [],
    };
  } catch (error) {
    console.error("Erro na Server Action fetchBandsAction:", error);
    return {
      pagination: { currentPage: page, totalItems: 0, totalPages: 0 },
      bands: [],
    };
  }
}
