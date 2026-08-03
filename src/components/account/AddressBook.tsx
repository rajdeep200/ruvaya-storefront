"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookUser,
  Leaf,
  CirclePlus,
  ShieldCheck,
  Plus,
  Home,
  Briefcase,
  Tag,
  Phone,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import type { AccountAddress, AddressFormValues } from "@/lib/validation/auth";
import { createAddress, updateAddress, deleteAddress } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "./AddressForm";

type EditState = "closed" | "new" | string; // string = editing an existing address id

const labelIconProps = { size: 16, strokeWidth: 1.6, "aria-hidden": true } as const;
function renderLabelIcon(label: string | null) {
  if (label === "Home") return <Home {...labelIconProps} />;
  if (label === "Work") return <Briefcase {...labelIconProps} />;
  if (label === "Other") return <Tag {...labelIconProps} />;
  return <MapPin {...labelIconProps} />;
}

export function AddressBook({ initialAddresses }: { initialAddresses: AccountAddress[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editing, setEditing] = useState<EditState>("closed");

  async function handleCreate(values: AddressFormValues) {
    const created = await createAddress(values);
    setAddresses((rows) => (created.isDefault ? rows.map((row) => ({ ...row, isDefault: false })) : rows).concat(created));
    setEditing("closed");
    router.refresh();
  }

  async function handleUpdate(id: string, values: AddressFormValues) {
    const updated = await updateAddress(id, values);
    setAddresses((rows) =>
      rows.map((row) => {
        if (row.id === id) return updated;
        return updated.isDefault ? { ...row, isDefault: false } : row;
      }),
    );
    setEditing("closed");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this address?")) return;
    await deleteAddress(id);
    setAddresses((rows) => rows.filter((row) => row.id !== id));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-2xl text-text-primary uppercase">Addresses</h2>
        {editing === "closed" && (
          <Button type="button" onClick={() => setEditing("new")} className="gap-2 rounded-md">
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            Add address
          </Button>
        )}
      </div>

      {editing === "new" && (
        <div className="mb-6">
          <AddressForm onSave={handleCreate} onCancel={() => setEditing("closed")} />
        </div>
      )}

      {addresses.length === 0 && editing === "closed" ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted text-text-primary">
            <BookUser size={40} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-serif text-2xl text-text-primary">No saved addresses</h2>
          <div className="mt-3 flex items-center gap-2" aria-hidden="true">
            <span className="h-px w-10 bg-border" />
            <Leaf size={14} strokeWidth={1.6} className="text-secondary" />
            <span className="h-px w-10 bg-border" />
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Add an address to check out faster next time.
          </p>
          <Button
            type="button"
            onClick={() => setEditing("new")}
            className="mt-6 w-full max-w-xs gap-2 rounded-md"
          >
            <CirclePlus size={18} strokeWidth={1.8} aria-hidden="true" />
            Add address
          </Button>

          <div className="mt-6 flex w-full max-w-xs items-start gap-3 rounded-md border border-border bg-surface-muted/40 p-4 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-primary">
              <ShieldCheck size={16} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text-primary">Secure &amp; Easy Checkout</p>
              <p className="mt-0.5 text-xs text-text-secondary">
                Your addresses are saved securely and used for a faster checkout.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {addresses.map((address) =>
            editing === address.id ? (
              <li key={address.id}>
                <AddressForm
                  initial={address}
                  onSave={(values) => handleUpdate(address.id, values)}
                  onCancel={() => setEditing("closed")}
                />
              </li>
            ) : (
              <li key={address.id}>
                <AddressCard address={address} onEdit={() => setEditing(address.id)} onDelete={() => handleDelete(address.id)} />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
}: {
  address: AccountAddress;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-primary">
          {renderLabelIcon(address.label)}
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
          {address.label || "Address"}
        </p>
        {address.isDefault && (
          <Badge variant="secondary" className="shrink-0 text-xs normal-case tracking-normal">
            Default
          </Badge>
        )}
      </div>

      <p className="mt-3 truncate text-lg font-bold text-text-primary">{address.fullName}</p>

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm text-text-secondary">
        <Phone size={16} strokeWidth={1.6} className="shrink-0 text-text-muted" aria-hidden="true" />
        {address.phone}
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-border pt-4 text-sm text-text-secondary">
        <MapPin size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
        <div>
          <p>
            {address.addressLine}
            {address.locality ? `, ${address.locality}` : ""}
          </p>
          <p>
            {address.city}, {address.state}
          </p>
          <p>{address.pincode}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onEdit} className="h-auto min-h-11 flex-1 gap-2 rounded-md">
          <Pencil size={14} strokeWidth={1.8} aria-hidden="true" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          className="h-auto min-h-11 flex-1 gap-2 rounded-md border-error text-error hover:bg-error/5"
        >
          <Trash2 size={14} strokeWidth={1.8} aria-hidden="true" />
          Remove
        </Button>
      </div>
    </div>
  );
}
