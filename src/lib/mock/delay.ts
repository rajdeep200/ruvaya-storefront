/** Small artificial latency so mock mode still exercises loading states realistically. */
export function mockDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
