"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabItem = { label: string; href: string; disabled?: boolean };

export function Tabs({ items }: { items: TabItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border">
      {items.map((item) => {
        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="shrink-0 whitespace-nowrap px-3 py-2 font-ui text-[13px] text-text-muted"
            >
              {item.label}
            </span>
          );
        }

        const isActive = item.href === pathname;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "shrink-0 whitespace-nowrap border-b-2 border-burgundy px-3 py-2 font-ui text-[13px] text-burgundy"
                : "shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2 font-ui text-[13px] text-text-secondary transition-colors hover:text-text-primary"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
