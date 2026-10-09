"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";
import baseUrl from "@/services/baseUrl";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

const bn = (n: number) => n.toLocaleString("bn-BD");

const pctBn = (n: number) =>
  Math.abs(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const unitBn = (u: string) =>
  (
    ({
      kg: "কেজি",
      litre: "লিটার",
      piece: "পিস",
      dozen: "ডজন",
    }) as Record<string, string>
  )[u] ?? u;

const TONE = {
  up: { color: "text-red-600", arrow: "▲" },
  down: { color: "text-green-600", arrow: "▼" },
  flat: { color: "text-gray-500", arrow: "—" },
} as const;

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${baseUrl}/products`);
        if (!res.ok) return;
        const data: Product[] = await res.json();
        if (!cancelled) setProducts(data);
      } catch {
        // ticker na dekhale site bhenge jabe na
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-white py-2">
      {/* Library nijei text clone kore loop banay, tai ekbar-i list dilei hobe */}
      <MarqueeText className="max-w-7xl mx-auto" duration={25} direction="right">
        {products.map((p) => {
          const t = TONE[p.change.dir];
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="inline-flex items-center gap-2 whitespace-nowrap px-5 text-sm hover:bg-gray-50"
            >
              <span className="text-lg">{p.image}</span>
              <span className="font-semibold text-gray-900">{p.nameBn}</span>
              <span className="text-gray-700">
                {bn(p.today)} টাকা/{unitBn(p.unit)}
              </span>
              <span className={`text-xs font-bold ${t.color}`}>
                {t.arrow} {pctBn(p.change.pct)}%
              </span>
            </Link>
          );
        })}
      </MarqueeText>
    </div>
  );
}
