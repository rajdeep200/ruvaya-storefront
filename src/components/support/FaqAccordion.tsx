"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { FaqItem } from "@/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="multiple" className="border-t border-border">
      {items.map((item, i) => (
        <Accordion.Item key={i} value={String(i)} className="border-b border-border">
          <Accordion.Header>
            <Accordion.Trigger className="flex min-h-14 w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary">
              {item.question}
              <span aria-hidden="true" className="ml-3 text-lg text-primary">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="pb-4 text-sm text-text-secondary data-[state=closed]:hidden">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
