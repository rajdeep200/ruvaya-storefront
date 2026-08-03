"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { MeasurementRow } from "@/types";

type SizeGuideDialogProps = {
  measurements: MeasurementRow[];
  trigger: React.ReactNode;
};

export function SizeGuideDialog({ measurements, trigger }: SizeGuideDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-6 shadow-xl focus:outline-none">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-serif text-lg text-primary">Size Guide</Dialog.Title>
            <Dialog.Close aria-label="Close size guide" className="flex h-9 w-9 items-center justify-center">
              <X size={18} strokeWidth={1.8} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mb-4 text-sm text-text-secondary">
            Garment measurements in inches, laid flat. All sizes are unstitched-inspired ready-to-wear — for the most
            comfortable fit, compare against a similar kurti you already own.
          </Dialog.Description>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2 pr-3 font-medium">Size</th>
                  <th className="py-2 pr-3 font-medium">Bust</th>
                  <th className="py-2 pr-3 font-medium">Waist</th>
                  <th className="py-2 pr-3 font-medium">Hip</th>
                  <th className="py-2 pr-3 font-medium">Length</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((row) => (
                  <tr key={row.size} className="border-b border-border last:border-0">
                    <td className="py-2 pr-3 font-medium text-text-primary">{row.size}</td>
                    <td className="py-2 pr-3 text-text-secondary">{row.bustIn}&quot;</td>
                    <td className="py-2 pr-3 text-text-secondary">{row.waistIn}&quot;</td>
                    <td className="py-2 pr-3 text-text-secondary">{row.hipIn}&quot;</td>
                    <td className="py-2 pr-3 text-text-secondary">{row.lengthIn}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a
            href="/size-guide"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            View our general size &amp; measurement guide →
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
