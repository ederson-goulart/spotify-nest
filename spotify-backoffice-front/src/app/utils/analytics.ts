import { AnalyticsEventType } from "../../../generated/prisma";

export interface AnalyticsEventPayload {
  type: AnalyticsEventType;
  page: string;
  action?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Envia um evento de analytics para o servidor
 */
export async function trackEvent(payload: AnalyticsEventPayload) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Silenciosamente falha - não queremos quebrar a UX por um erro de analytics
    console.debug("Analytics error:", error);
  }
}

/**
 * Rastreia uma visualização de página
 */
export async function trackPageView(
  page: string,
  metadata?: Record<string, string | number | boolean | null>,
) {
  return trackEvent({
    type: "PAGE_VIEW",
    page,
    metadata,
  });
}

/**
 * Rastreia criação de recurso
 */
export async function trackCreate(
  resourceType: "band" | "track",
  page: string,
) {
  return trackEvent({
    type: resourceType === "band" ? "CREATE_BAND" : "CREATE_TRACK",
    page,
    action: "create",
  });
}

/**
 * Rastreia atualização de recurso
 */
export async function trackUpdate(
  resourceType: "band" | "track",
  page: string,
) {
  return trackEvent({
    type: resourceType === "band" ? "UPDATE_BAND" : "UPDATE_TRACK",
    page,
    action: "update",
  });
}

/**
 * Rastreia exclusão de recurso
 */
export async function trackDelete(
  resourceType: "band" | "track",
  page: string,
) {
  return trackEvent({
    type: resourceType === "band" ? "DELETE_BAND" : "DELETE_TRACK",
    page,
    action: "delete",
  });
}

/**
 * Rastreia um erro
 */
export async function trackError(page: string, error: Error | string) {
  const errorData: Record<string, string | number | boolean | null> = {
    message: error instanceof Error ? error.message : error,
  };

  if (error instanceof Error && error.stack) {
    errorData.stack = error.stack;
  }

  return trackEvent({
    type: "ERROR",
    page,
    metadata: errorData,
  });
}
