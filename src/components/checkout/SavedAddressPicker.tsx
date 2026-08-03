"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CheckoutFormValues } from "@/types";
import type { AccountAddress } from "@/lib/validation/auth";

export function SavedAddressPicker({
  addresses,
  form,
}: {
  addresses: AccountAddress[];
  form: UseFormReturn<CheckoutFormValues>;
}) {
  const defaultId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id;
  const [selected, setSelected] = useState<string>(defaultId ?? "new");

  function applyAddress(address: AccountAddress) {
    form.setValue("fullName", address.fullName, { shouldValidate: true });
    form.setValue("phone", address.phone, { shouldValidate: true });
    if (address.email) form.setValue("email", address.email, { shouldValidate: true });
    form.setValue("addressLine", address.addressLine, { shouldValidate: true });
    form.setValue("locality", address.locality ?? "", { shouldValidate: true });
    form.setValue("landmark", address.landmark ?? "", { shouldValidate: true });
    form.setValue("city", address.city, { shouldValidate: true });
    form.setValue("state", address.state, { shouldValidate: true });
    form.setValue("pincode", address.pincode, { shouldValidate: true });
  }

  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-medium text-text-primary">Deliver to</p>
      <div className="flex flex-col gap-2">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm ${
              selected === address.id ? "border-primary" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="saved-address"
              className="mt-1"
              checked={selected === address.id}
              onChange={() => {
                setSelected(address.id);
                applyAddress(address);
              }}
            />
            <span className="text-text-secondary">
              <span className="font-medium text-text-primary">
                {address.label ? `${address.label} · ` : ""}
                {address.fullName}
              </span>
              <br />
              {address.addressLine}
              {address.locality ? `, ${address.locality}` : ""}, {address.city}, {address.state} {address.pincode}
            </span>
          </label>
        ))}
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
            selected === "new" ? "border-primary" : "border-border"
          }`}
        >
          <input type="radio" name="saved-address" checked={selected === "new"} onChange={() => setSelected("new")} />
          <span className="text-text-primary">Use a different address</span>
        </label>
      </div>
    </div>
  );
}
