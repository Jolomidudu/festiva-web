"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type RegisterResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirstName) {
      setError("Please enter your first name.");
      return;
    }

    if (!trimmedLastName) {
      setError("Please enter your last name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: `${trimmedFirstName} ${trimmedLastName}`,
          email: trimmedEmail,
          password,
        }),
      });

      localStorage.setItem("festyvibe_token", response.accessToken);
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
          : "Unable to create your account. Please try again."
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
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#777c78]">
              Start planning your special day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-[#202522]"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-[#202522]"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
                />
              </div>
            </div>

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
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#dedbd4] px-4 py-3.5 pr-12 outline-none transition focus:border-[#193c32] disabled:cursor-not-allowed disabled:bg-[#f7f6f2]"
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

              <p className="mt-1.5 text-xs text-[#888d89]">
                Password must be at least 6 characters.
              </p>
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193c32] py-3.5 font-medium text-white transition hover:bg-[#244c40] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777c78]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#193c32] transition hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}