"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { signIn } from "@/lib/auth-client";

// Details page theke ashle login er por oi page e ferot pathabe
const getSafeCallbackURL = () => {
  const url = new URLSearchParams(window.location.search).get("callbackURL");
  // sudhu nijer site er path allow, na hole onno site e pathano jay
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/";
};

// Google icon (original colors)
const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

// GitHub icon (currentColor, dark mode e o thik thakbe)
const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 shrink-0"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);

    try {
      const { error } = await signIn.email({ email, password });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");
      window.location.href = "/";
    } catch {
      toast.error("কিছু ভুল হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    const label = provider === "google" ? "Google" : "GitHub";

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: getSafeCallbackURL(),
      });

      if (error) {
        toast.error(error.message || `${label} দিয়ে লগইন ব্যর্থ হয়েছে`);
      }
    } catch {
      toast.error(`${label} দিয়ে লগইন করা যায়নি`);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">সাইন ইন করুন</h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          আপনার অ্যাকাউন্টে প্রবেশ করুন।
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border p-5 shadow-sm sm:max-w-md sm:p-8">
        <Form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          <TextField isRequired name="email" type="email" className="w-full">
            <Label>ইমেইল</Label>
            <Input autoComplete="email" className="w-full" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            className="w-full"
          >
            <Label>পাসওয়ার্ড</Label>
            <Input autoComplete="current-password" className="w-full" />
            <FieldError />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
          </Button>
        </Form>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-500 sm:text-sm">
          <span className="h-px flex-1 bg-gray-200" />
          অথবা
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            isDisabled={loading}
            onPress={() => handleSocialSignIn("google")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            <GoogleIcon />
            <span className="sm:hidden">Google দিয়ে চালিয়ে যান</span>
            <span className="hidden sm:inline">Google</span>
          </Button>

          <Button
            type="button"
            isDisabled={loading}
            onPress={() => handleSocialSignIn("github")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            <GitHubIcon />
            <span className="sm:hidden">GitHub দিয়ে চালিয়ে যান</span>
            <span className="hidden sm:inline">GitHub</span>
          </Button>
        </div>

        <p className="mt-5 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-medium text-green-700">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-6 text-sm text-gray-500 hover:underline">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
};

export default SignInPage;
