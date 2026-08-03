/** Pastel palette matching the approved homepage's collection-card imagery. */
export const MOCK_PALETTE = {
  blush: "f3e3d8",
  sage: "dbe4d3",
  sky: "d9e6ef",
  lavender: "e3dcec",
  mustard: "ede0bd",
  peach: "f0d9c8",
  rose: "e9cfd0",
  ivory: "f5efe2",
} as const;

export type MockPaletteKey = keyof typeof MOCK_PALETTE;

export function mockImageUrl(
  label: string,
  opts: { w?: number; h?: number; tone?: MockPaletteKey } = {},
): string {
  const { w = 900, h = 1125, tone = "blush" } = opts;
  const params = new URLSearchParams({
    w: String(w),
    h: String(h),
    bg: MOCK_PALETTE[tone],
    label,
  });
  return `/mock-image?${params.toString()}`;
}
