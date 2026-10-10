
import baseUrl from "@/services/baseUrl";
import Link from "next/link";

const NavLinks = async () => {
  const res = await fetch(`${baseUrl}/categories`, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

 return (
  <nav className="w-full border-y border-gray-100 bg-white">
    <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8">
      <div
        className="flex w-full items-center gap-1.5 overflow-x-auto scroll-smooth sm:gap-2 lg:flex-wrap lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {data.map(
          (
            n: {
              slug: string;
              nameBn: string;
              icon: string;
            },
            i: number
          ) => (
            <Link
              key={n.slug || i}
              href={`/category/${n.slug}`}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-green-50 hover:text-green-600 active:scale-95 sm:px-4 md:px-5 md:text-base"
            >
              <span>{n.icon}</span>
              <span> {n.nameBn}</span>
            </Link>
          )
        )}
      </div>
    </div>
  </nav>
);
};

export default NavLinks;
