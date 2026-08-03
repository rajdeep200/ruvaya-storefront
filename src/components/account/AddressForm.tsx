"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, MapPin, Home, Flag, Building2, Map, Briefcase, Tag, type LucideIcon } from "lucide-react";
import { addressFormSchema, type AddressFormValues, type AccountAddress } from "@/lib/validation/auth";
import { ApiError } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: Tag },
];

const inputClass =
  "min-h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-text-primary outline-none focus:border-primary";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-primary">
        {label} {optional && <span className="font-normal text-text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

function IconInput({
  icon: Icon,
  id,
  ...props
}: { icon: LucideIcon; id: string } & React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Icon
        size={16}
        strokeWidth={1.6}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <input id={id} className={inputClass} {...props} />
    </div>
  );
}

export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AccountAddress;
  onSave: (values: AddressFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      label: initial?.label ?? "",
      fullName: initial?.fullName ?? "",
      phone: initial?.phone ?? "",
      addressLine: initial?.addressLine ?? "",
      locality: initial?.locality ?? "",
      landmark: initial?.landmark ?? "",
      city: initial?.city ?? "",
      state: initial?.state ?? "",
      pincode: initial?.pincode ?? "",
      isDefault: initial?.isDefault ?? false,
    },
  });

  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSave(values);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-md border border-border p-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Label <span className="font-normal text-text-muted">(optional)</span>
        </label>
        <Controller
          control={form.control}
          name="label"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {LABEL_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={field.value === opt.value ? "outline" : "secondary"}
                  onClick={() => field.onChange(field.value === opt.value ? "" : opt.value)}
                  aria-pressed={field.value === opt.value}
                  className={`h-auto min-h-11 gap-2 px-4 ${
                    field.value === opt.value ? "border-secondary bg-secondary/30 text-primary" : ""
                  }`}
                >
                  <opt.icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  {opt.value}
                </Button>
              ))}
            </div>
          )}
        />
      </div>

      <Field id="fullName" label="Recipient's name" error={form.formState.errors.fullName?.message}>
        <IconInput
          icon={User}
          id="fullName"
          autoComplete="name"
          placeholder="Enter recipient's name"
          {...form.register("fullName")}
        />
      </Field>

      <Field id="phone" label="Mobile number" error={form.formState.errors.phone?.message}>
        <IconInput
          icon={Phone}
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Enter mobile number"
          {...form.register("phone")}
        />
      </Field>

      <Field id="pincode" label="Pincode" error={form.formState.errors.pincode?.message}>
        <IconInput
          icon={MapPin}
          id="pincode"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          placeholder="Enter 6-digit pincode"
          {...form.register("pincode")}
        />
      </Field>

      <Field id="addressLine" label="Address" error={form.formState.errors.addressLine?.message}>
        <div className="relative">
          <Home
            size={16}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-3 top-3 text-text-muted"
            aria-hidden="true"
          />
          <textarea
            id="addressLine"
            rows={3}
            autoComplete="address-line1"
            placeholder="House no., Building, Street, Area"
            className="w-full rounded-md border border-border bg-surface py-2.5 pr-3 pl-10 text-sm text-text-primary outline-none focus:border-primary"
            {...form.register("addressLine")}
          />
        </div>
      </Field>

      <Field id="locality" label="Locality / Area" optional>
        <IconInput
          icon={MapPin}
          id="locality"
          autoComplete="address-line2"
          placeholder="Enter locality or area"
          {...form.register("locality")}
        />
      </Field>

      <Field id="landmark" label="Landmark" optional>
        <IconInput icon={Flag} id="landmark" placeholder="Nearby landmark" {...form.register("landmark")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="city" label="City" error={form.formState.errors.city?.message}>
          <IconInput
            icon={Building2}
            id="city"
            autoComplete="address-level2"
            placeholder="Enter city"
            {...form.register("city")}
          />
        </Field>

        <Field id="state" label="State" error={form.formState.errors.state?.message}>
          <Controller
            control={form.control}
            name="state"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="state" className="w-full">
                  <span className="flex min-w-0 items-center gap-2">
                    <Map size={16} strokeWidth={1.6} className="shrink-0 text-text-muted" aria-hidden="true" />
                    <SelectValue placeholder="Select state" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-surface-muted/40 px-4 py-3 text-sm text-text-primary">
        <input type="checkbox" className="h-4 w-4 cursor-pointer" {...form.register("isDefault")} />
        Set as default address
      </label>

      {submitError && (
        <div role="alert" className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {submitError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-auto min-h-12 w-full rounded-md text-sm font-medium tracking-wide uppercase disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Address"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-auto min-h-12 w-full rounded-md text-sm font-medium tracking-wide uppercase"
      >
        Cancel
      </Button>
    </form>
  );
}
