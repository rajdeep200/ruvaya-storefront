"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { indianPincodeSchema } from "@/lib/validation/checkout";
import { checkServiceability } from "@/lib/api/checkout";
import { track } from "@/lib/analytics/track";
import type { ServiceabilityResponse } from "@/types";

export function ServiceabilityCheck() {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ServiceabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheck() {
    const parsed = indianPincodeSchema.safeParse(pincode);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid pincode");
      setResult(null);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await checkServiceability(pincode);
      setResult(res);
      track("serviceability_checked", { metadata: { pincode, isServiceable: res.isServiceable } });
    } catch {
      setError("We couldn't check this pincode right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor="pdp-pincode" className="mb-1.5 block text-sm font-medium text-text-primary">
        Check delivery to your pincode
      </label>
      <div className="flex gap-2">
        <input
          id="pdp-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Enter 6-digit pincode"
          aria-invalid={!!error}
          aria-describedby={error ? "pdp-pincode-error" : undefined}
          className="min-h-11 w-40 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCheck}
          disabled={isLoading}
          className="h-auto min-h-11 rounded-md px-4 disabled:opacity-60"
        >
          {isLoading ? "Checking..." : "Check"}
        </Button>
      </div>
      {error && (
        <p id="pdp-pincode-error" role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}
      {result && (
        <p className={`mt-2 text-sm ${result.isServiceable ? "text-success" : "text-error"}`} aria-live="polite">
          {result.isServiceable
            ? `Delivery available${result.city ? ` to ${result.city}` : ""} in ${result.estimatedDeliveryDays ?? 5}-${(result.estimatedDeliveryDays ?? 5) + 2} days. ${result.codAvailable ? "COD available." : ""}`
            : (result.message ?? "We don't deliver to this pincode yet.")}
        </p>
      )}
    </div>
  );
}
