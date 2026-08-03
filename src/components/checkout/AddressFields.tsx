"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CheckoutFormValues } from "@/types";

type AddressFieldsProps = {
  form: UseFormReturn<CheckoutFormValues>;
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary";

export function AddressFields({ form }: AddressFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id="fullName" label="Full Name" error={errors.fullName?.message}>
        <input id="fullName" type="text" autoComplete="name" className={inputClass} {...register("fullName")} />
      </Field>

      <Field id="phone" label="Mobile Number" error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          className={inputClass}
          {...register("phone")}
        />
      </Field>

      <Field id="email" label="Email Address" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={inputClass} {...register("email")} />
      </Field>

      <Field id="pincode" label="Pincode" error={errors.pincode?.message}>
        <input
          id="pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          className={inputClass}
          {...register("pincode")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field id="addressLine" label="Address" error={errors.addressLine?.message}>
          <input
            id="addressLine"
            type="text"
            autoComplete="address-line1"
            placeholder="Flat / House no., Building, Street"
            className={inputClass}
            {...register("addressLine")}
          />
        </Field>
      </div>

      <Field id="locality" label="Locality / Area (optional)">
        <input id="locality" type="text" autoComplete="address-line2" className={inputClass} {...register("locality")} />
      </Field>

      <Field id="landmark" label="Landmark (optional)">
        <input id="landmark" type="text" className={inputClass} {...register("landmark")} />
      </Field>

      <Field id="city" label="City" error={errors.city?.message}>
        <input id="city" type="text" autoComplete="address-level2" className={inputClass} {...register("city")} />
      </Field>

      <Field id="state" label="State" error={errors.state?.message}>
        <input id="state" type="text" autoComplete="address-level1" className={inputClass} {...register("state")} />
      </Field>

      <div className="sm:col-span-2">
        <Field id="deliveryInstructions" label="Delivery Instructions (optional)">
          <textarea
            id="deliveryInstructions"
            rows={2}
            maxLength={200}
            className={`${inputClass} min-h-0 py-2`}
            {...register("deliveryInstructions")}
          />
        </Field>
      </div>
    </div>
  );
}
