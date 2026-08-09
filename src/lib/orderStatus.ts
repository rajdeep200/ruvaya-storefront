import { Clock, CheckCircle2, PackageCheck, Truck, XCircle, RotateCcw, type LucideIcon } from "lucide-react";

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Payment pending",
  PAYMENT_PENDING: "Payment pending",
  PAID: "Order confirmed",
  CONFIRMED: "Confirmed",
  SOURCING: "Preparing your order",
  READY_TO_SHIP: "Packed, ready to ship",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially refunded",
};

// Once a later status exists in the timeline, PENDING_PAYMENT/PAYMENT_PENDING
// is no longer "pending" - it's a completed checkpoint. ORDER_STATUS_LABEL is
// correct for a *current* status (still genuinely pending), but reads as a
// contradiction next to a checkmark in a history list, so history rendering
// should use this label instead for superseded entries.
export const ORDER_STATUS_HISTORY_LABEL: Record<string, string> = {
  ...ORDER_STATUS_LABEL,
  PENDING_PAYMENT: "Order placed",
  PAYMENT_PENDING: "Order placed",
};

export const ORDER_STATUS_TONE: Record<string, "success" | "warning" | "error" | "secondary"> = {
  PENDING_PAYMENT: "warning",
  PAYMENT_PENDING: "warning",
  PAID: "success",
  CONFIRMED: "success",
  SOURCING: "secondary",
  READY_TO_SHIP: "secondary",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "error",
  PARTIALLY_REFUNDED: "error",
};

export const ORDER_STATUS_MESSAGE: Record<string, string> = {
  PENDING_PAYMENT: "Waiting for payment confirmation.",
  PAYMENT_PENDING: "Waiting for payment confirmation.",
  PAID: "Your order has been confirmed.",
  CONFIRMED: "We're preparing your order.",
  SOURCING: "We're preparing your order.",
  READY_TO_SHIP: "Your order is packed and ready to ship.",
  SHIPPED: "Your order is on the way.",
  DELIVERED: "Your order has been delivered.",
  CANCELLED: "This order was cancelled.",
  REFUNDED: "This order was refunded.",
  PARTIALLY_REFUNDED: "Part of this order was refunded.",
};

export const ORDER_STATUS_ICON: Record<string, LucideIcon> = {
  PENDING_PAYMENT: Clock,
  PAYMENT_PENDING: Clock,
  PAID: CheckCircle2,
  CONFIRMED: CheckCircle2,
  SOURCING: PackageCheck,
  READY_TO_SHIP: PackageCheck,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
  REFUNDED: RotateCcw,
  PARTIALLY_REFUNDED: RotateCcw,
};
