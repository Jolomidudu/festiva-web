"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      localStorage.setItem(
        "festyvibe_token",
        response.accessToken
      );

      localStorage.setItem(
        "festyvibe_user",
        JSON.stringify(response.user)
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f9f7f2] px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-[#777c78] transition hover:text-[#193c32]"
        >
          <ArrowLeft size={16} />
          Back to Festyvibe
        </Link>

        <div className="rounded-[2rem] border border-[#ebe8e1] bg-white p-7 shadow-sm md:p-9">
          <div className="text-center">
            <p className="serif text-4xl text-[#193c32]">
              Festyvibe
            </p>

            <h1 className="mt-8 text-2xl font-semibold text-[#202522]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[#777c78]">
              Sign in to continue planning your celebration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#202522]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#202522]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 pr-12 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777c78] transition hover:text-[#193c32] disabled:cursor-not-allowed"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193c32] py-3.5 font-medium text-white transition hover:bg-[#102d25] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777c78]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#193c32] transition hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}