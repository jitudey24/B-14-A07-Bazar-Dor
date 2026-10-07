'use client'
import { Button } from "@heroui/react";
import Image from "next/image";
import NavLinks from "./NavLinks";

const Header = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-green-500 shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              বাজার দর
            </h1>

            <p className="text-xs text-gray-500 sm:text-sm">{date}</p>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">

          <Button

            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md sm:px-6"
          >

            সাইন ইন
          </Button>
          <Button className="rounded-xl bg-green-500 px-4 py-2.5 font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-lg sm:px-6">

            সাইন আপ
          </Button>
        </div>
      </div>
      <NavLinks/>
    </header>

  );
};

export default Header;
