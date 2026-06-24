"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "../utils/analytics";

/**
 * Componente que rastreia automaticamente visualizações de página
 * Deve ser incluído no layout raiz
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Rastreia quando a rota muda
    trackPageView(pathname, {
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  }, [pathname]);

  return null; // Este componente não renderiza nada
}
