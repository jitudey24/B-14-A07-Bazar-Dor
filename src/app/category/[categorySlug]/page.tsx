import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import baseUrl from "@/services/baseUrl";
import ProductList, { type Product } from "./ProductList";
import { CategoryPageSkeleton } from "@/components/Skeleton";

async function getCategoryProducts(slug: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours"); // বারবার API hit না করে 429 এড়াতে

  const res = await fetch(
    `${baseUrl}/products?category=${encodeURIComponent(slug)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

// হোম পেজের সাথে একই width ও background
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#f3f8f4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  let products: Product[];
  try {
    products = await getCategoryProducts(categorySlug);
  } catch (err) {
    console.error(err);

    // API 404 dile category nei -> 404 page
    if (err instanceof Error && err.message.includes(": 404")) {
      notFound();
    }

    // onno error (jemon 429, 500) hole error message
    return (
      <Shell>
        <div className="p-10 text-center text-red-600">
          লোড করা যায়নি, কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </div>
      </Shell>
    );
  }

  // Khali ba vul category hole 404 page
  if (!Array.isArray(products) || products.length === 0) {
    notFound();
  }

  const first = products[0];
  const name = first?.categoryNameBn ?? categorySlug;
  const icon = first?.categoryIcon ?? "🛒";

  return (
    <Shell>
      {/* Header card */}
      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{name}</h1>
          <p className="text-xs text-gray-500">
            {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও
            পরিবর্তন
          </p>
        </div>
      </div>

      <ProductList products={products} />
    </Shell>
  );
}

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
