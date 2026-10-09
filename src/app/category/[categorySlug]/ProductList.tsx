
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const bn = (n: number) =>
  n.toLocaleString("bn-BD");

const unitBn = (u: string) =>
  ({
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    piece: "প্রতিটি",
    dozen: "প্রতি ডজন",
  })[u] ?? `প্রতি ${u}`;

function ChangeBadge({
  dir,
  pct,
}: {
  dir: Product["change"]["dir"];
  pct: number;
}) {
  const style =
    dir === "up"
      ? "bg-red-50 text-red-600"
      : dir === "down"
        ? "bg-green-50 text-green-600"
        : "bg-gray-100 text-gray-500";

  const arrow =
    dir === "up"
      ? "▲"
      : dir === "down"
        ? "▼"
        : "—";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${style}`}
    >
      {arrow} {bn(Math.abs(pct))}%
    </span>
  );
}

export default function ProductList({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState("default");

  const sorted = useMemo(() => {
    const list = [...products];

    switch (sort) {
      case "price-asc":
        return list.sort(
          (a, b) => a.today - b.today
        );

      case "price-desc":
        return list.sort(
          (a, b) => b.today - a.today
        );

      default:
        return list;
    }
  }, [products, sort]);

  return (
    <>
      {/* Sort Bar */}
      <div className="mb-4 flex items-center justify-end gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4">
        <label
          htmlFor="sort"
          className="text-sm text-gray-500"
        >
          সাজান
        </label>

        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-green-500"
        >
          <option value="default">
            ডিফল্ট
          </option>

          <option value="price-asc">
            দাম: কম থেকে বেশি
          </option>

          <option value="price-desc">
            দাম: বেশি থেকে কম
          </option>
        </select>
      </div>

      {/* Product Count */}
      <p className="mb-3 text-xs text-gray-500">
        মোট {bn(sorted.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      {sorted.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          এই ক্যাটাগরিতে কোনো পণ্য নেই।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {sorted.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="block"
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">

                {/* Product Name */}
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {p.image}
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      {p.nameBn}
                    </h2>

                    <p className="text-xs text-gray-500">
                      {unitBn(p.unit)}
                    </p>
                  </div>

                </div>

                {/* Price */}
                <p className="mt-4 text-xs text-gray-500">
                  আজকের দাম
                </p>

                <div className="mt-1 flex items-center justify-between">

                  <p className="text-xl font-extrabold text-gray-900">
                    {bn(p.today)}{" "}
                    <span className="text-sm font-medium">
                      টাকা
                    </span>
                  </p>

                  <ChangeBadge
                    dir={p.change.dir}
                    pct={p.change.pct}
                  />

                </div>

              </div>
            </Link>
          ))}

        </div>
      )}
    </>
  );
}

