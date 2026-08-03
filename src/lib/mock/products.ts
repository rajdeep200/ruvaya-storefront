import { productDetailToListItem, type ProductBadge, type ProductDetail } from "@/lib/validation/product";
import { mockImageUrl, type MockPaletteKey } from "./image";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof SIZES)[number];

const BASE_MEASUREMENTS: Record<
  Size,
  { bustIn: number; waistIn: number; hipIn: number; lengthIn: number; sleeveLengthIn: number }
> = {
  S: { bustIn: 36, waistIn: 34, hipIn: 38, lengthIn: 44, sleeveLengthIn: 17 },
  M: { bustIn: 38, waistIn: 36, hipIn: 40, lengthIn: 44.5, sleeveLengthIn: 17.5 },
  L: { bustIn: 40, waistIn: 38, hipIn: 42, lengthIn: 45, sleeveLengthIn: 18 },
  XL: { bustIn: 42, waistIn: 40, hipIn: 44, lengthIn: 45.5, sleeveLengthIn: 18 },
  XXL: { bustIn: 44, waistIn: 42, hipIn: 46, lengthIn: 46, sleeveLengthIn: 18.5 },
};

const WASH_CARE_DEFAULT = [
  "Gentle machine or hand wash in cold water with similar colours",
  "Do not bleach",
  "Iron on low heat, inside out",
  "Dry in shade to preserve colour and print",
];

const SHIPPING_INFO_DEFAULT =
  "Dispatched within 24-48 hours. Delivered in 3-7 business days across India. Cash on delivery available.";

type ColorInput = {
  name: string;
  hex: string;
  tone: MockPaletteKey;
  outOfStockSizes?: Size[];
};

type ProductInput = {
  slug: string;
  name: string;
  category: string;
  collectionSlugs: string[];
  fabric: string;
  occasion: string[];
  priceAmount: number;
  salePriceAmount?: number;
  badges?: ProductBadge[];
  colors: ColorInput[];
  description: string;
  fabricDetails: string;
  fitDetails: string;
  neckType: string;
  sleeveType: string;
  kurtiLength: string;
  sideSlit?: string;
  modelHeightCm: number;
  modelSizeWorn: string;
  ratingAverage: number;
  ratingCount: number;
  similarProductSlugs?: string[];
};

let idCounter = 1;

function buildProduct(input: ProductInput): ProductDetail {
  const id = String(idCounter++);

  const colorVariants = input.colors.map((color, colorIndex) => ({
    id: `${input.slug}-${color.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: color.name,
    hex: color.hex,
    images: [0, 1, 2].map((viewIndex) => ({
      id: `${input.slug}-${colorIndex}-${viewIndex}`,
      url: mockImageUrl(`${input.name}\n${color.name}`, { tone: color.tone, w: 900, h: 1125 }),
      alt: `${input.name} in ${color.name}, view ${viewIndex + 1}`,
    })),
    sizes: SIZES.map((size) => ({
      size,
      sku: `${input.slug}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
      inStock: !(color.outOfStockSizes ?? []).includes(size),
    })),
  }));

  return {
    id,
    slug: input.slug,
    name: input.name,
    category: input.category,
    collectionSlugs: input.collectionSlugs,
    fabric: input.fabric,
    occasion: input.occasion,
    price: { amount: input.priceAmount, currency: "INR" },
    salePrice: input.salePriceAmount ? { amount: input.salePriceAmount, currency: "INR" } : null,
    badges: input.badges ?? [],
    colors: input.colors.map((c) => ({ name: c.name, hex: c.hex })),
    rating: { average: input.ratingAverage, count: input.ratingCount },
    isAvailable: true,
    description: input.description,
    images: colorVariants[0].images,
    colorVariants,
    fabricDetails: input.fabricDetails,
    fitDetails: input.fitDetails,
    neckType: input.neckType,
    sleeveType: input.sleeveType,
    kurtiLength: input.kurtiLength,
    sideSlit: input.sideSlit,
    washCare: WASH_CARE_DEFAULT,
    measurements: SIZES.map((size) => ({ size, ...BASE_MEASUREMENTS[size] })),
    modelInfo: { heightCm: input.modelHeightCm, sizeWorn: input.modelSizeWorn },
    shippingInfo: SHIPPING_INFO_DEFAULT,
    returnEligible: true,
    returnWindowDays: 7,
    inclusiveOfTaxes: true,
    similarProductSlugs: input.similarProductSlugs ?? [],
  };
}

export const mockProducts: ProductDetail[] = [
  buildProduct({
    slug: "ivory-floral-a-line-kurti",
    name: "Ivory Floral A-Line Kurti",
    category: "Everyday Kurtis",
    collectionSlugs: ["everyday-kurtis", "cotton-kurtis", "best-sellers"],
    fabric: "Pure Cotton",
    occasion: ["Everyday", "Casual"],
    priceAmount: 1299,
    badges: ["bestseller"],
    colors: [{ name: "Ivory", hex: "#F3E9DC", tone: "ivory" }],
    description:
      "A gentle floral print on soft cotton, cut in an easy A-line silhouette — the kurti we reach for on ordinary days that deserve a little grace.",
    fabricDetails: "100% pure cotton, mid-weight, breathable weave.",
    fitDetails: "Relaxed A-line fit through the body, true to size.",
    neckType: "Round neck with box pleat",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Calf-length (44 in, size M)",
    sideSlit: "Side slits up to the knee",
    modelHeightCm: 168,
    modelSizeWorn: "M",
    ratingAverage: 4.6,
    ratingCount: 128,
    similarProductSlugs: ["sage-green-straight-kurti", "blue-floral-cotton-kurti"],
  }),
  buildProduct({
    slug: "pastel-pink-embroidered-kurti",
    name: "Pastel Pink Embroidered Kurti",
    category: "Festive Kurtis",
    collectionSlugs: ["festive-kurtis", "best-sellers"],
    fabric: "Cotton Silk",
    occasion: ["Festive", "Celebration"],
    priceAmount: 1599,
    salePriceAmount: 1299,
    badges: ["bestseller", "sale"],
    colors: [{ name: "Pastel Pink", hex: "#EFD2CE", tone: "rose" }],
    description:
      "Delicate thread embroidery on cotton silk in the softest pink — for the festive mornings and the evenings that follow.",
    fabricDetails: "Cotton silk blend with subtle sheen, lightly lined yoke.",
    fitDetails: "Semi-fitted through the bust, flares gently at the hem.",
    neckType: "Notched round neck with tassel ties",
    sleeveType: "Elbow-length sleeves",
    kurtiLength: "Ankle-length (46 in, size M)",
    modelHeightCm: 166,
    modelSizeWorn: "M",
    ratingAverage: 4.8,
    ratingCount: 96,
    similarProductSlugs: ["peach-chikankari-kurti", "teal-blue-anarkali-kurti"],
  }),
  buildProduct({
    slug: "sage-green-straight-kurti",
    name: "Sage Green Straight Kurti",
    category: "Everyday Kurtis",
    collectionSlugs: ["everyday-kurtis", "cotton-kurtis", "best-sellers"],
    fabric: "Pure Cotton",
    occasion: ["Everyday", "Office"],
    priceAmount: 1199,
    badges: ["bestseller"],
    colors: [{ name: "Sage Green", hex: "#C9D6BE", tone: "sage" }],
    description:
      "A quiet, considered sage green in a straight-cut silhouette that moves easily from home to a full working day.",
    fabricDetails: "100% pure cotton, soft-washed for everyday comfort.",
    fitDetails: "Straight fit, not fitted at the waist — easy to move in.",
    neckType: "Mandarin collar",
    sleeveType: "Full sleeves with buttoned cuff",
    kurtiLength: "Knee-length (42 in, size M)",
    modelHeightCm: 165,
    modelSizeWorn: "M",
    ratingAverage: 4.5,
    ratingCount: 84,
    similarProductSlugs: ["ivory-floral-a-line-kurti", "grey-melange-office-kurti"],
  }),
  buildProduct({
    slug: "lavender-printed-kurti",
    name: "Lavender Printed Kurti",
    category: "Office Wear",
    collectionSlugs: ["office-wear", "new-arrivals", "best-sellers"],
    fabric: "Rayon",
    occasion: ["Office", "Everyday"],
    priceAmount: 1299,
    badges: ["bestseller", "new"],
    colors: [{ name: "Lavender", hex: "#DCD3E8", tone: "lavender" }],
    description:
      "A small-scale print on fluid rayon in a soft lavender — quietly polished enough for a desk, soft enough for the walk home.",
    fabricDetails: "100% rayon, fluid drape, lightly breathable.",
    fitDetails: "Semi-fitted at the shoulder, straight through the body.",
    neckType: "V-neck with front placket",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Knee-length (43 in, size M)",
    modelHeightCm: 167,
    modelSizeWorn: "M",
    ratingAverage: 4.4,
    ratingCount: 41,
    similarProductSlugs: ["grey-melange-office-kurti", "rust-orange-straight-kurti"],
  }),
  buildProduct({
    slug: "peach-chikankari-kurti",
    name: "Peach Chikankari Kurti",
    category: "Festive Kurtis",
    collectionSlugs: ["festive-kurtis", "best-sellers"],
    fabric: "Cotton",
    occasion: ["Festive", "Celebration"],
    priceAmount: 1399,
    badges: ["bestseller"],
    colors: [{ name: "Peach", hex: "#EFD9C3", tone: "peach" }],
    description:
      "Traditional chikankari hand embroidery, worked in soft peach thread on breathable cotton — understated festive dressing.",
    fabricDetails: "Pure cotton with chikankari embroidery.",
    fitDetails: "A-line fit, comfortable through the hip.",
    neckType: "Keyhole neck",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Ankle-length (45 in, size M)",
    sideSlit: "Side slits up to the knee",
    modelHeightCm: 168,
    modelSizeWorn: "M",
    ratingAverage: 4.7,
    ratingCount: 73,
    similarProductSlugs: ["pastel-pink-embroidered-kurti", "maroon-zari-border-kurti"],
  }),
  buildProduct({
    slug: "blue-floral-cotton-kurti",
    name: "Blue Floral Cotton Kurti",
    category: "Cotton Kurtis",
    collectionSlugs: ["cotton-kurtis", "everyday-kurtis", "best-sellers"],
    fabric: "Pure Cotton",
    occasion: ["Everyday", "Casual"],
    priceAmount: 1199,
    badges: ["bestseller"],
    colors: [{ name: "Sky Blue", hex: "#C9DCE8", tone: "sky" }],
    description:
      "A light floral scattered across breathable cotton in a cool sky blue — made for the season of calm.",
    fabricDetails: "100% pure cotton, breathable plain weave.",
    fitDetails: "Relaxed straight fit, true to size.",
    neckType: "Round neck",
    sleeveType: "Elbow-length sleeves",
    kurtiLength: "Knee-length (43 in, size M)",
    modelHeightCm: 164,
    modelSizeWorn: "M",
    ratingAverage: 4.5,
    ratingCount: 59,
    similarProductSlugs: ["ivory-floral-a-line-kurti", "coral-printed-cotton-kurti"],
  }),
  buildProduct({
    slug: "mustard-yellow-a-line-kurti",
    name: "Mustard Yellow A-Line Kurti",
    category: "Everyday Kurtis",
    collectionSlugs: ["everyday-kurtis", "new-arrivals"],
    fabric: "Rayon",
    occasion: ["Everyday", "Casual"],
    priceAmount: 1249,
    badges: ["new"],
    colors: [{ name: "Mustard", hex: "#E7D19B", tone: "mustard" }],
    description:
      "A warm mustard that earns its place in every season, cut in a forgiving A-line that flatters most body types.",
    fabricDetails: "100% rayon, soft drape.",
    fitDetails: "A-line fit, gently flared from the bust.",
    neckType: "Round neck with tassel tie",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Knee-length (43 in, size M)",
    modelHeightCm: 165,
    modelSizeWorn: "M",
    ratingAverage: 4.3,
    ratingCount: 22,
    similarProductSlugs: ["sage-green-straight-kurti", "rust-orange-straight-kurti"],
  }),
  buildProduct({
    slug: "rust-orange-straight-kurti",
    name: "Rust Orange Straight Kurti",
    category: "Office Wear",
    collectionSlugs: ["office-wear"],
    fabric: "Rayon",
    occasion: ["Office", "Everyday"],
    priceAmount: 1349,
    colors: [
      { name: "Rust", hex: "#CC8A66", tone: "peach" },
      { name: "Charcoal", hex: "#4B4A48", tone: "ivory", outOfStockSizes: ["S"] },
    ],
    description:
      "A confident rust with a quiet finish — a straight kurti built for long desk days and longer meetings.",
    fabricDetails: "100% rayon, structured drape that holds its shape.",
    fitDetails: "Straight fit through the body, not clingy.",
    neckType: "Mandarin collar with placket",
    sleeveType: "Full sleeves",
    kurtiLength: "Knee-length (42 in, size M)",
    modelHeightCm: 167,
    modelSizeWorn: "M",
    ratingAverage: 4.2,
    ratingCount: 34,
    similarProductSlugs: ["lavender-printed-kurti", "grey-melange-office-kurti"],
  }),
  buildProduct({
    slug: "teal-blue-anarkali-kurti",
    name: "Teal Blue Anarkali Kurti",
    category: "Festive Kurtis",
    collectionSlugs: ["festive-kurtis"],
    fabric: "Georgette",
    occasion: ["Festive", "Celebration"],
    priceAmount: 1899,
    salePriceAmount: 1599,
    badges: ["sale"],
    colors: [{ name: "Teal Blue", hex: "#A9CBC7", tone: "sky" }],
    description:
      "A flowing anarkali silhouette in teal georgette, lined for comfort — for the evenings that call for a little more movement.",
    fabricDetails: "Georgette with inner lining, flared panels.",
    fitDetails: "Fitted yoke, flared anarkali skirt from the bust.",
    neckType: "Round neck with back tie-up",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Floor-length (52 in, size M)",
    modelHeightCm: 168,
    modelSizeWorn: "M",
    ratingAverage: 4.6,
    ratingCount: 47,
    similarProductSlugs: ["maroon-zari-border-kurti", "emerald-green-festive-kurti-set"],
  }),
  buildProduct({
    slug: "maroon-zari-border-kurti",
    name: "Maroon Zari Border Kurti",
    category: "Festive Kurtis",
    collectionSlugs: ["festive-kurtis", "new-arrivals"],
    fabric: "Silk Blend",
    occasion: ["Festive", "Celebration"],
    priceAmount: 1799,
    badges: ["new"],
    colors: [{ name: "Maroon", hex: "#7A3B3B", tone: "rose" }],
    description:
      "A rich maroon finished with a woven zari border — the kurti that anchors a festive evening without trying too hard.",
    fabricDetails: "Silk-cotton blend with woven zari border.",
    fitDetails: "Semi-fitted, straight cut with a structured hem.",
    neckType: "Boat neck",
    sleeveType: "Elbow-length sleeves",
    kurtiLength: "Ankle-length (45 in, size M)",
    modelHeightCm: 166,
    modelSizeWorn: "M",
    ratingAverage: 4.7,
    ratingCount: 18,
    similarProductSlugs: ["peach-chikankari-kurti", "teal-blue-anarkali-kurti"],
  }),
  buildProduct({
    slug: "white-chanderi-kurti-set",
    name: "White Chanderi Kurti Set",
    category: "Kurti Sets",
    collectionSlugs: ["kurti-sets", "festive-kurtis", "new-arrivals", "best-sellers"],
    fabric: "Chanderi Cotton",
    occasion: ["Festive", "Celebration"],
    priceAmount: 2199,
    badges: ["new", "bestseller"],
    colors: [{ name: "White", hex: "#F5F1E8", tone: "ivory" }],
    description:
      "A three-piece Chanderi set — kurti, straight pants and a soft dupatta — in a white that feels ceremonial without being formal.",
    fabricDetails: "Chanderi cotton kurti and dupatta, cotton-blend pants.",
    fitDetails: "Straight kurti fit, relaxed straight pants, true to size.",
    neckType: "Round neck with gota trim",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Knee-length (44 in, size M) with matching pants and dupatta",
    modelHeightCm: 168,
    modelSizeWorn: "M",
    ratingAverage: 4.8,
    ratingCount: 29,
    similarProductSlugs: ["beige-cotton-kurti-set", "emerald-green-festive-kurti-set"],
  }),
  buildProduct({
    slug: "beige-cotton-kurti-set",
    name: "Beige Cotton Kurti Set",
    category: "Kurti Sets",
    collectionSlugs: ["kurti-sets", "cotton-kurtis", "new-arrivals"],
    fabric: "Pure Cotton",
    occasion: ["Everyday", "Office"],
    priceAmount: 1999,
    badges: ["new"],
    colors: [{ name: "Beige", hex: "#E4D8C4", tone: "ivory" }],
    description:
      "A two-piece cotton set in warm beige — a kurti and matching palazzo built for full, easy days.",
    fabricDetails: "100% pure cotton kurti and palazzo.",
    fitDetails: "Relaxed A-line kurti, wide-leg palazzo, true to size.",
    neckType: "Round neck",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Knee-length (43 in, size M) with matching palazzo",
    modelHeightCm: 165,
    modelSizeWorn: "M",
    ratingAverage: 4.4,
    ratingCount: 15,
    similarProductSlugs: ["white-chanderi-kurti-set", "sage-green-straight-kurti"],
  }),
  buildProduct({
    slug: "grey-melange-office-kurti",
    name: "Grey Melange Office Kurti",
    category: "Office Wear",
    collectionSlugs: ["office-wear"],
    fabric: "Rayon",
    occasion: ["Office"],
    priceAmount: 1249,
    colors: [{ name: "Grey Melange", hex: "#CBC7C1", tone: "ivory" }],
    description:
      "A no-fuss grey melange kurti for the days that need one less decision — smart, soft and easy to repeat.",
    fabricDetails: "100% rayon, melange weave.",
    fitDetails: "Straight fit, true to size.",
    neckType: "Round neck with front placket",
    sleeveType: "Full sleeves",
    kurtiLength: "Knee-length (42 in, size M)",
    modelHeightCm: 166,
    modelSizeWorn: "M",
    ratingAverage: 4.1,
    ratingCount: 27,
    similarProductSlugs: ["rust-orange-straight-kurti", "lavender-printed-kurti"],
  }),
  buildProduct({
    slug: "coral-printed-cotton-kurti",
    name: "Coral Printed Cotton Kurti",
    category: "Cotton Kurtis",
    collectionSlugs: ["cotton-kurtis", "everyday-kurtis"],
    fabric: "Pure Cotton",
    occasion: ["Everyday", "Casual"],
    priceAmount: 1349,
    salePriceAmount: 1149,
    badges: ["sale"],
    colors: [{ name: "Coral", hex: "#E7B7A6", tone: "peach", outOfStockSizes: ["XXL"] }],
    description:
      "A cheerful coral print on soft cotton, cut generously for warm-weather comfort.",
    fabricDetails: "100% pure cotton, lightweight weave.",
    fitDetails: "Relaxed fit, gently flared hem.",
    neckType: "Round neck",
    sleeveType: "Three-quarter sleeves",
    kurtiLength: "Knee-length (43 in, size M)",
    modelHeightCm: 164,
    modelSizeWorn: "M",
    ratingAverage: 4.3,
    ratingCount: 38,
    similarProductSlugs: ["blue-floral-cotton-kurti", "ivory-floral-a-line-kurti"],
  }),
  buildProduct({
    slug: "emerald-green-festive-kurti-set",
    name: "Emerald Green Festive Kurti Set",
    category: "Kurti Sets",
    collectionSlugs: ["kurti-sets", "festive-kurtis", "new-arrivals"],
    fabric: "Silk Blend",
    occasion: ["Festive", "Celebration"],
    priceAmount: 2499,
    badges: ["new"],
    colors: [{ name: "Emerald Green", hex: "#5C7A66", tone: "sage" }],
    description:
      "A three-piece festive set in emerald green, finished with a contrast dupatta — for the evenings worth dressing up for.",
    fabricDetails: "Silk-blend kurti and dupatta, cotton-blend pants.",
    fitDetails: "Semi-fitted kurti, straight pants, true to size.",
    neckType: "V-neck with embroidered yoke",
    sleeveType: "Elbow-length sleeves",
    kurtiLength: "Ankle-length (46 in, size M) with matching pants and dupatta",
    modelHeightCm: 168,
    modelSizeWorn: "M",
    ratingAverage: 4.6,
    ratingCount: 12,
    similarProductSlugs: ["white-chanderi-kurti-set", "teal-blue-anarkali-kurti"],
  }),
];

export const mockProductListItems = mockProducts.map(productDetailToListItem);

export function findMockProductBySlug(slug: string): ProductDetail | undefined {
  return mockProducts.find((p) => p.slug === slug);
}
