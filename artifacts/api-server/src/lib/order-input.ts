export interface OrderItemInput { productId: number; quantity: number }

export function parseOrderItems(value: unknown): OrderItemInput[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) return null;
  const result: OrderItemInput[] = [];
  const seen = new Set<number>();
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const { productId, quantity } = item;
    if (!Number.isSafeInteger(productId) || productId <= 0 || seen.has(productId) ||
        !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) return null;
    seen.add(productId);
    result.push({ productId, quantity });
  }
  return result;
}

export function boundedText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}
