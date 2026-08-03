"use client";

import Link from "next/link";
import { Shirt, WashingMachine, Truck, PackageCheck, ShieldCheck, ChevronRight, type LucideIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { ProductDetail } from "@/types";

type ProductInfoAccordionProps = {
  product: ProductDetail;
};

export function ProductInfoAccordion({ product }: ProductInfoAccordionProps) {
  return (
    <Accordion type="multiple" defaultValue={["fabric-fit", "shipping-returns"]} className="mt-10 flex flex-col gap-4">
      <AccordionItem value="fabric-fit" className="rounded-2xl border border-border bg-surface px-5 shadow-sm last:border-b last:border-border">
        <AccordionTrigger className="hover:no-underline">
          <SectionHeading icon={Shirt} title="Fabric & Fit" />
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
              <Detail label="Fabric" value={product.fabricDetails} />
              <Detail label="Fit" value={product.fitDetails} />
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
              <Detail label="Neck" value={product.neckType} />
              <Detail label="Sleeve" value={product.sleeveType} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Length" value={product.kurtiLength} />
              {product.sideSlit && <Detail label="Slit" value={product.sideSlit} />}
            </div>
          </div>
          {product.modelInfo && (
            <p className="mt-4 text-xs text-text-muted">
              Model is {product.modelInfo.heightCm} cm tall and wearing size {product.modelInfo.sizeWorn}.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wash-care" className="rounded-2xl border border-border bg-surface px-5 shadow-sm last:border-b last:border-border">
        <AccordionTrigger className="hover:no-underline">
          <SectionHeading icon={WashingMachine} title="Wash Care" subtitle={product.washCare[0]} />
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-1.5 text-sm text-text-secondary">
            {product.washCare.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true">·</span>
                {line}
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping-returns" className="rounded-2xl border border-border bg-surface px-5 shadow-sm last:border-b last:border-border">
        <AccordionTrigger className="hover:no-underline">
          <SectionHeading icon={Truck} title="Shipping & Returns" />
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col">
            <InfoRow
              icon={PackageCheck}
              title={
                product.returnEligible
                  ? `Easy returns within ${product.returnWindowDays ?? 7} days`
                  : "This item is not eligible for return"
              }
              description={
                product.returnEligible
                  ? `Hassle-free returns within ${product.returnWindowDays ?? 7} days of delivery.`
                  : undefined
              }
            />
            <InfoRow icon={Truck} title="Shipping details" description={product.shippingInfo} />
            <Link href="/return-refund-policy" className="flex items-center gap-3 py-3 text-left hover:text-primary">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-text-primary">
                <ShieldCheck size={18} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-text-primary">Read our return policy</span>
                <span className="block text-xs text-text-secondary">
                  View full details of our return &amp; exchange policy.
                </span>
              </span>
              <ChevronRight size={18} strokeWidth={1.8} className="shrink-0 text-text-muted" aria-hidden="true" />
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <span className="flex items-center gap-3">
      <Icon size={22} strokeWidth={1.6} className="shrink-0 text-primary" aria-hidden="true" />
      <span>
        <span className="block text-sm font-bold tracking-wide text-text-primary uppercase">{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs font-normal text-text-secondary">{subtitle}</span>}
      </span>
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-text-primary">{value}</dd>
    </div>
  );
}

function InfoRow({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-text-primary">
        <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
      </div>
    </div>
  );
}
