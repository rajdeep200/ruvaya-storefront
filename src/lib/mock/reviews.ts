import type { Review, ReviewTokenContext } from "@/lib/validation/review";
import { mockImageUrl } from "./image";
import { mockProducts } from "./products";

function review(
  productSlug: string,
  overrides: Partial<Review> & Pick<Review, "id" | "rating" | "title" | "text" | "customerName" | "createdAt">,
): Review {
  const product = mockProducts.find((p) => p.slug === productSlug)!;
  return {
    productId: product.id,
    productName: product.name,
    fitFeedback: "true_to_size",
    purchasedSize: "M",
    recommend: true,
    images: [],
    isVerifiedPurchase: true,
    adminReply: null,
    helpfulCount: 0,
    ...overrides,
  };
}

export const mockReviews: Review[] = [
  review("ivory-floral-a-line-kurti", {
    id: "rev-1",
    rating: 5,
    title: "Soft, breathable, exactly as pictured",
    text: "The cotton is genuinely soft and the fit is true to size. Wore it to work all day and it stayed comfortable.",
    customerName: "Divya R.",
    createdAt: "2026-06-12T10:00:00.000Z",
    helpfulCount: 14,
    images: [
      { id: "rev-1-img-1", url: mockImageUrl("Customer photo", { tone: "ivory", w: 500, h: 620 }), alt: "Customer wearing the Ivory Floral A-Line Kurti" },
    ],
  }),
  review("ivory-floral-a-line-kurti", {
    id: "rev-2",
    rating: 4,
    title: "Lovely print, runs slightly large",
    text: "Beautiful kurti, though I'd size down if you prefer a fitted look. Fabric quality is excellent.",
    customerName: "Sneha K.",
    createdAt: "2026-05-28T10:00:00.000Z",
    fitFeedback: "runs_large",
    helpfulCount: 6,
    adminReply: "Thank you, Sneha! We've noted your feedback on the fit for this style.",
  }),
  review("pastel-pink-embroidered-kurti", {
    id: "rev-3",
    rating: 5,
    title: "Perfect for a festive lunch",
    text: "Wore this for a family function and got so many compliments. The embroidery looks even better in person.",
    customerName: "Neha S.",
    createdAt: "2026-07-02T10:00:00.000Z",
    helpfulCount: 21,
    images: [
      { id: "rev-3-img-1", url: mockImageUrl("Customer photo", { tone: "rose", w: 500, h: 620 }), alt: "Customer wearing the Pastel Pink Embroidered Kurti" },
      { id: "rev-3-img-2", url: mockImageUrl("Customer photo", { tone: "rose", w: 500, h: 620 }), alt: "Close-up of the embroidery detail" },
    ],
  }),
  review("pastel-pink-embroidered-kurti", {
    id: "rev-4",
    rating: 5,
    title: "Worth every rupee",
    text: "The cotton silk feels premium and the tailoring is neat. Ordering another colour already.",
    customerName: "Priyanka M.",
    createdAt: "2026-06-20T10:00:00.000Z",
    helpfulCount: 9,
  }),
  review("sage-green-straight-kurti", {
    id: "rev-5",
    rating: 4,
    title: "Great everyday colour",
    text: "Sage green is such a nice change from the usual prints. Fabric is light and doesn't crease easily.",
    customerName: "Aarti K.",
    createdAt: "2026-06-05T10:00:00.000Z",
    isVerifiedPurchase: false,
    helpfulCount: 3,
  }),
  review("lavender-printed-kurti", {
    id: "rev-6",
    rating: 5,
    title: "My new office staple",
    text: "Light enough for long days, smart enough for meetings. The lavender print is subtle and elegant.",
    customerName: "Ritu J.",
    createdAt: "2026-07-10T10:00:00.000Z",
    helpfulCount: 5,
  }),
  review("blue-floral-cotton-kurti", {
    id: "rev-7",
    rating: 4,
    title: "Comfortable summer wear",
    text: "Good quality cotton, breathable, and the blue floral print is very pretty. Slightly loose at the shoulders on me.",
    customerName: "Meera P.",
    createdAt: "2026-05-15T10:00:00.000Z",
    fitFeedback: "runs_large",
    helpfulCount: 2,
  }),
];

/**
 * Demo secure tokens for exercising every /review/[secureToken] state without
 * a real backend: a fresh token, an already-submitted one, and an expired one.
 */
export const mockReviewTokens: Record<string, ReviewTokenContext> = {
  "demo-review-token-valid": {
    isValid: true,
    productName: "Pastel Pink Embroidered Kurti",
    productImage: { id: "token-valid-img", url: mockImageUrl("Pastel Pink Embroidered Kurti", { tone: "rose" }), alt: "Pastel Pink Embroidered Kurti" },
    orderNumber: "RUV10234",
    purchasedSize: "M",
    alreadySubmitted: false,
  },
  "demo-review-token-used": {
    isValid: true,
    productName: "Ivory Floral A-Line Kurti",
    productImage: { id: "token-used-img", url: mockImageUrl("Ivory Floral A-Line Kurti", { tone: "ivory" }), alt: "Ivory Floral A-Line Kurti" },
    orderNumber: "RUV10198",
    purchasedSize: "S",
    alreadySubmitted: true,
  },
  "demo-review-token-expired": {
    isValid: false,
    alreadySubmitted: false,
  },
};
