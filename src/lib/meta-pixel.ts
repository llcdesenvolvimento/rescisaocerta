/**
 * Helpers tipados para o Meta Pixel (Facebook).
 *
 * O snippet do pixel é injetado em `index.html` e expõe `window.fbq`.
 * Aqui só centralizamos chamadas e adicionamos tipagem.
 */

declare global {
  interface Window {
    fbq?: (
      command: "init" | "track" | "trackCustom" | "consent",
      eventOrPixelId: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
  }
}

export function trackPageView(): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

interface PurchaseParams {
  /** Valor em reais (ex.: 16.90). */
  value: number;
  /** Moeda no padrão ISO 4217 (default: BRL). */
  currency?: string;
  /** Nome do conteúdo comprado (ex.: "Análise Completa"). */
  contentName?: string;
  /**
   * ID único da transação. Usado pelo Meta pra deduplicar eventos quando
   * for adicionada a Conversions API no futuro. Passa o calculoId.
   */
  transactionId?: string;
}

/**
 * Dispara o evento Purchase com o valor da venda.
 * Inclui `eventID` quando há `transactionId` pra permitir dedup futuro
 * caso a Conversions API seja adicionada.
 */
export function trackPurchase({
  value,
  currency = "BRL",
  contentName,
  transactionId,
}: PurchaseParams): void {
  if (typeof window === "undefined" || !window.fbq) return;
  const params: Record<string, unknown> = { value, currency };
  if (contentName) params.content_name = contentName;
  if (transactionId) params.transaction_id = transactionId;
  if (transactionId) {
    window.fbq("track", "Purchase", params, { eventID: transactionId });
  } else {
    window.fbq("track", "Purchase", params);
  }
}
