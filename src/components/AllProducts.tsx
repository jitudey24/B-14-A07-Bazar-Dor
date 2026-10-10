import Link from "next/link";
import { cacheLife } from "next/cache";
import baseUrl from "@/services/baseUrl";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

const bn = (n: number) => n.toLocaleString("bn-BD");

const unitBn = (u: string) =>
  (
    ({
      kg: "প্রতি কেজি",
      litre: "প্রতি লিটার",
      piece: "প্রতিটি",
      dozen: "প্রতি ডজন",
    }) as Record<string, string>
  )[u] ?? `প্রতি ${u}`;

async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(`${baseUrl}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

const BADGE = {
  up: { style: "bg-red-50 text-red-600", arrow: "▲" },
  down: { style: "bg-green-50 text-green-600", arrow: "▼" },
  flat: { style: "bg-gray-100 text-gray-500", arrow: "—" },
} as const;

export default async function AllProducts() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    return (
      <section className="rounded-3xl bg-gray-50 p-5 text-center text-sm text-gray-500">
        এই মুহূর্তে তথ্য লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      id="সব-পণ্য"
      className="scroll-mt-6 rounded-3xl bg-gray-50/80 p-5 sm:p-6"
    >
      <div className="mb-4 flex items-start gap-2">
        <span className="mt-1.5 text-sm text-green-600">●</span>
        <div>
          <h2 className="text-lg font-bold leading-tight text-gray-900">
            সকল পণ্যের দাম
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            মোট {bn(products.length)}টি পণ্য
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const b = BADGE[p.change.dir];
          return (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  {p.image}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-900">
                    {p.nameBn}
                  </h3>
                  <p className="text-xs text-gray-500">{unitBn(p.unit)}</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">আজকের দাম</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xl font-extrabold text-gray-900">
                  {bn(p.today)}{" "}
                  <span className="text-sm font-medium text-gray-700">
                    টাকা
                  </span>
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${b.style}`}
                >
                  {b.arrow} {bn(Math.abs(p.change.pct))}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
