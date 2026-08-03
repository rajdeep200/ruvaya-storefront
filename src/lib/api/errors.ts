export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "AUTH_EXPIRED"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "NOT_CONFIGURED"
  | "NOT_FOUND"
  | "PRODUCT_UNAVAILABLE"
  | "PRICE_CHANGED"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "SERVER_ERROR";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends ApiError {
  constructor(message = "We couldn't reach Ruvaya. Please check your connection and try again.") {
    super("NETWORK_ERROR", message);
    this.name = "NetworkError";
  }
}

export class ValidationApiError extends ApiError {
  constructor(message = "That doesn't look right. Please review and try again.", details?: unknown) {
    super("VALIDATION_ERROR", message, 422, details);
    this.name = "ValidationApiError";
  }
}

export class AuthExpiredError extends ApiError {
  constructor(message = "This link has expired. Please request a new one.") {
    super("AUTH_EXPIRED", message, 401);
    this.name = "AuthExpiredError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Invalid email or password.") {
    super("UNAUTHORIZED", message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "That already exists.") {
    super("CONFLICT", message, 409);
    this.name = "ConflictError";
  }
}

export class NotConfiguredError extends ApiError {
  constructor(message = "This sign-in method isn't available right now.") {
    super("NOT_CONFIGURED", message, 503);
    this.name = "NotConfiguredError";
  }
}

export class NotFoundApiError extends ApiError {
  constructor(message = "We couldn't find what you were looking for.") {
    super("NOT_FOUND", message, 404);
    this.name = "NotFoundApiError";
  }
}

export class ProductUnavailableError extends ApiError {
  constructor(message = "This kurti is no longer available.") {
    super("PRODUCT_UNAVAILABLE", message, 409);
    this.name = "ProductUnavailableError";
  }
}

export class PriceChangedError extends ApiError {
  constructor(message = "The price of an item in your cart has changed.", details?: unknown) {
    super("PRICE_CHANGED", message, 409, details);
    this.name = "PriceChangedError";
  }
}

export class PaymentPendingError extends ApiError {
  constructor(message = "Your payment is still being verified.") {
    super("PAYMENT_PENDING", message, 202);
    this.name = "PaymentPendingError";
  }
}

export class PaymentFailedError extends ApiError {
  constructor(message = "Your payment did not go through.") {
    super("PAYMENT_FAILED", message, 402);
    this.name = "PaymentFailedError";
  }
}

export class ServerApiError extends ApiError {
  constructor(message = "Something went wrong on our end. Please try again shortly.", status = 500) {
    super("SERVER_ERROR", message, status);
    this.name = "ServerApiError";
  }
}

const CODE_TO_ERROR: Record<string, (message: string, details?: unknown) => ApiError> = {
  AUTH_EXPIRED: (m) => new AuthExpiredError(m),
  UNAUTHORIZED: (m) => new UnauthorizedError(m),
  CONFLICT: (m) => new ConflictError(m),
  NOT_CONFIGURED: (m) => new NotConfiguredError(m),
  NOT_FOUND: (m) => new NotFoundApiError(m),
  PRODUCT_UNAVAILABLE: (m) => new ProductUnavailableError(m),
  PRICE_CHANGED: (m, d) => new PriceChangedError(m, d),
  PAYMENT_PENDING: (m) => new PaymentPendingError(m),
  PAYMENT_FAILED: (m) => new PaymentFailedError(m),
  VALIDATION_ERROR: (m, d) => new ValidationApiError(m, d),
};

export function mapBackendErrorCode(code: string, message: string, details?: unknown): ApiError {
  const factory = CODE_TO_ERROR[code];
  if (factory) return factory(message, details);
  return new ServerApiError(message);
}
