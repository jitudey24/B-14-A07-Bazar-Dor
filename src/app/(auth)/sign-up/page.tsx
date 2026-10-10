"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

const SignUpPage = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const pass = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (name.length < 3) {
      toast.error("নাম কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    if (pass.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (pass !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      // callbackURL দেওয়া হয়নি, কারণ নিচে router দিয়েই home এ পাঠানো হচ্ছে
      // (দুটোই থাকলে দুইবার redirect হতে পারে)
      const { error } = await signUp.email({
        name,
        email,
        password: pass,
      });

      if (error) {
        toast.error(error.message || "সাইন আপ করা যায়নি");
        return;
      }

      toast.success("সাইন আপ সফল হয়েছে!");

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
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || `${label} দিয়ে লগইন ব্যর্থ হয়েছে`);
      }
    } catch {
      toast.error(`${label} দিয়ে লগইন করা যায়নি`);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-gray-900">নতুন অ্যাকাউন্ট</h1>
          <p className="mt-2 text-sm text-gray-500">
            বাজার দর ব্যবহার করতে অ্যাকাউন্ট তৈরি করুন।
          </p>
        </div>

        <Form onSubmit={handleSignUpSubmit} className="space-y-5">
          <TextField
            isRequired
            name="name"
            validate={(value) =>
              value.trim().length < 3 ? "নাম কমপক্ষে ৩ অক্ষরের হতে হবে" : null
            }
          >
            <Label>নাম</Label>
            <Input placeholder="আপনার নাম" autoComplete="name" />
            <FieldError />
          </TextField>

          <TextField isRequired name="email" type="email">
            <Label>ইমেইল</Label>
            <Input placeholder="আপনার ইমেইল" autoComplete="email" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            validate={(value) =>
              value.length < 8 ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" : null
            }
          >
            <Label>পাসওয়ার্ড</Label>
            <Input placeholder="কমপক্ষে ৮ অক্ষর" autoComplete="new-password" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="confirmPassword"
            type="password"
            validate={(value) =>
              value !== password ? "পাসওয়ার্ড মিলছে না" : null
            }
          >
            <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>
            <Input
              placeholder="পাসওয়ার্ড আবার লিখুন"
              autoComplete="new-password"
            />
            <FieldError />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
          </Button>

          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            type="button"
            isDisabled={loading}
            onPress={() => handleSocialSignIn("google")}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700"
          >
            Google দিয়ে চালিয়ে যান
          </Button>

          <Button
            type="button"
            isDisabled={loading}
            onPress={() => handleSocialSignIn("github")}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700"
          >
            GitHub দিয়ে চালিয়ে যান
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-bold text-green-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
