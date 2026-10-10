"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

import DateDisplay from "./DateDisplay";

// navLinks = layout.tsx (server) theke ashbe, tai ekhane import korte hobe na
const Header = ({ navLinks }: { navLinks: ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  // sign-up er somoy deya naam dekhabe; naam na thakle email er prothom ongsho
  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  // বাইরে click করলে বা Escape চাপলে dropdown বন্ধ হবে
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await signOut();

      if (error) {
        console.error("Sign out failed:", error);
        return;
      }

      setIsDropdownOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর logo"
                width={44}
                height={44}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                বাজার দর
              </h1>
              <DateDisplay />
            </div>
          </Link>

          {/* Authentication */}
          <div
            ref={dropdownRef}
            className="relative flex shrink-0 items-center gap-2 sm:gap-3"
          >
            {isPending ? (
              // session load hocche: sign-in button flash kora ekhane bondho
              <div className="h-11 w-28 animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-sm hover:bg-gray-50 sm:px-3"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={displayName}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* এখন mobile এও naam dekhabe */}
                  <span className="max-w-20 truncate font-semibold text-gray-800 sm:max-w-32">
                    {displayName}
                  </span>

                  <span className="text-xs text-gray-500">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[60] mt-2 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-3">
                      <p className="truncate font-bold text-gray-900">
                        {displayName}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="mt-2 block rounded-lg px-3 py-2.5 font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                    >
                      👤 Profile
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="mt-1 w-full rounded-lg px-3 py-2.5 text-left font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSigningOut ? "Signing out..." : "↪ Sign Out"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-bold text-gray-700 hover:bg-gray-100 sm:px-6"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-xl bg-green-500 px-3 py-2.5 font-bold text-white hover:bg-green-600 sm:px-6"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation links */}
        {navLinks}
      </header>
    </>
  );
};

export default Header;
