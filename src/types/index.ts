/**
 * Public type surface for the storefront. Components import domain types from
 * here, never from `@/lib/validation` directly — that module owns runtime
 * validation, this one is the ergonomic re-export for type-only usage.
 */
export type {
  Money,
  ImageAsset,
  VideoAsset,
  Seo,
  NavLink,
  Address,
  PaginationMeta,
  ApiErrorEnvelope,
} from "@/lib/validation/common";

export type {
  ProductBadge,
  SizeAvailability,
  ColorVariant,
  RatingSummary,
  MeasurementRow,
  ProductListItem,
  ProductDetail,
  ProductSort,
  ProductFilterOptions,
  ProductListResponse,
} from "@/lib/validation/product";

export type { CollectionSummary, CollectionDetail } from "@/lib/validation/collection";

export type { NavigationItem, NavigationResponse } from "@/lib/validation/navigation";

export type { FooterColumn, StorefrontConfig } from "@/lib/validation/storefrontConfig";

export type { CampaignStatus, Campaign } from "@/lib/validation/campaign";

export type {
  HeroSection,
  SeasonalCampaignBanner,
  TrustItem,
  FeaturedReview,
  InspirationImage,
  HomepageResponse,
} from "@/lib/validation/homepage";

export type {
  SearchSuggestionsResponse,
  SearchResultsResponse,
} from "@/lib/validation/search";

export type {
  CartLineInput,
  CartValidationRequest,
  CartLineValidation,
  CartValidationResponse,
} from "@/lib/validation/cart";

export type {
  CheckoutFormValues,
  ServiceabilityResponse,
  CheckoutRequest,
  CheckoutResponse,
} from "@/lib/validation/checkout";

export type {
  PaymentStatus,
  PaymentStatusResponse,
  PaymentRetryResponse,
} from "@/lib/validation/payment";

export type {
  OrderStatus,
  OrderItem,
  OrderTimelineStep,
  OrderDetail,
  TrackOrderRequest,
  TrackOrderResponse,
} from "@/lib/validation/order";

export type {
  FitFeedback,
  Review,
  ReviewSort,
  ReviewListResponse,
  ReviewTokenContext,
  ReviewSubmissionValues,
} from "@/lib/validation/review";

export type {
  AnalyticsEventName,
  AnalyticsEvent,
  AnalyticsBatchRequest,
} from "@/lib/validation/analytics";

export type {
  NewsletterSubscribeRequest,
  NewsletterSubscribeResponse,
} from "@/lib/validation/newsletter";

export type {
  SupportContactRequest,
  SupportContactResponse,
  FaqItem,
} from "@/lib/validation/support";
