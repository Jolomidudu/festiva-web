"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type ProfileResponse = {
  message: string;
  user: CurrentUser;
};

type PasswordResponse = {
  message: string;
};

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("festyvibe_user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: CurrentUser = JSON.parse(storedUser);

      setUser(parsedUser);

      const nameParts = parsedUser.name.trim().split(/\s+/);

      setFirstName(nameParts[0] ?? "");
      setLastName(nameParts.slice(1).join(" "));
      setEmail(parsedUser.email);
    } catch {
      localStorage.removeItem("festyvibe_user");
      router.replace("/login");
    }
  }, [router]);

  const initials = useMemo(() => {
    if (!user?.name) return "U";

    const parts = user.name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${
      parts[parts.length - 1].charAt(0)
    }`.toUpperCase();
  }, [user]);

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();

    if (!cleanFirstName) {
      setProfileError("Please enter your first name.");
      return;
    }

    if (cleanFirstName.length < 2) {
      setProfileError(
        "First name must be at least 2 characters.",
      );
      return;
    }

    if (!cleanEmail) {
      setProfileError("Please enter your email address.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setProfileError(
        "Please enter a valid email address.",
      );
      return;
    }

    const fullName = [cleanFirstName, cleanLastName]
      .filter(Boolean)
      .join(" ");

    setProfileLoading(true);

    try {
      const response = await api<ProfileResponse>(
        "/auth/profile",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: fullName,
            email: cleanEmail,
          }),
        },
      );

      setUser(response.user);

      localStorage.setItem(
        "festyvibe_user",
        JSON.stringify(response.user),
      );

      const nameParts = response.user.name
        .trim()
        .split(/\s+/);

      setFirstName(nameParts[0] ?? "");
      setLastName(nameParts.slice(1).join(" "));
      setEmail(response.user.email);

      setProfileMessage(
        response.message || "Profile updated successfully.",
      );

      window.dispatchEvent(
        new Event("festyvibe:user-updated"),
      );
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password.",
      );
      return;
    }

    if (currentPassword.length < 8) {
      setPasswordError(
        "Your current password must be at least 8 characters.",
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "Please enter a new password.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match.",
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api<PasswordResponse>(
        "/auth/password",
        {
          method: "PATCH",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        response.message ||
          "Password changed successfully.",
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to change your password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("festyvibe_token");
    localStorage.removeItem("festyvibe_user");

    router.replace("/login");
  }

  function PasswordInput({
    value,
    onChange,
    placeholder,
    visible,
    onToggle,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    visible: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 pr-12 text-sm text-[#202522] outline-none transition placeholder:text-[#aaa9a3] focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#777c78] transition hover:bg-[#f4f2ed] hover:text-[#193c32]"
          aria-label={
            visible ? "Hide password" : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-[#ebe8e1] bg-white p-8">
          <div className="h-5 w-32 animate-pulse rounded bg-[#eeeae3]" />
          <div className="mt-3 h-10 w-48 animate-pulse rounded bg-[#eeeae3]" />
          <div className="mt-8 h-40 animate-pulse rounded-3xl bg-[#f4f2ed]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="text-sm font-medium text-[#c99a6b]">
          Account
        </p>

        <h1 className="serif mt-1 text-4xl text-[#193c32]">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777c78]">
          Manage your profile, security and account
          preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="mt-8 overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white">
        <div className="border-b border-[#ebe8e1] px-6 py-5 md:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7eee8] text-[#193c32]">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#193c32]">
                Profile
              </h2>
              <p className="mt-1 text-sm text-[#777c78]">
                Update the personal information associated
                with your account.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="p-6 md:p-7"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-[#343936]"
              >
                First name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-sm text-[#202522] outline-none transition placeholder:text-[#aaa9a3] focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                placeholder="First name"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-[#343936]"
              >
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                className="w-full rounded-2xl border border-[#dedbd4] bg-white px-4 py-3.5 text-sm text-[#202522] outline-none transition placeholder:text-[#aaa9a3] focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#343936]"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92958f]"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full rounded-2xl border border-[#dedbd4] bg-white py-3.5 pl-11 pr-4 text-sm text-[#202522] outline-none transition placeholder:text-[#aaa9a3] focus:border-[#193c32] focus:ring-2 focus:ring-[#193c32]/10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {profileError && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{profileError}</span>
            </div>
          )}

          {profileMessage && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{profileMessage}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#102f27] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {profileLoading
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Security */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white">
        <div className="border-b border-[#ebe8e1] px-6 py-5 md:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3ece4] text-[#9b7048]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#193c32]">
                Security
              </h2>

              <p className="mt-1 text-sm text-[#777c78]">
                Keep your FestyVibe account secure by
                regularly updating your password.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="p-6 md:p-7"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-[#343936]"
              >
                Current password
              </label>

              <PasswordInput
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter your current password"
                visible={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(
                    (value) => !value,
                  )
                }
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-[#343936]"
                >
                  New password
                </label>

                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="At least 8 characters"
                  visible={showNewPassword}
                  onToggle={() =>
                    setShowNewPassword(
                      (value) => !value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#343936]"
                >
                  Confirm new password
                </label>

                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your new password"
                  visible={showConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#888d89]">
            <LockKeyhole size={14} />
            Your password is securely hashed before it is
            stored.
          </div>

          {passwordError && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <XCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordMessage && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{passwordMessage}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 rounded-full border border-[#193c32] bg-white px-5 py-3 text-sm font-medium text-[#193c32] transition hover:bg-[#f5f7f4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole size={17} />

              {passwordLoading
                ? "Updating..."
                : "Change password"}
            </button>
          </div>
        </form>
      </section>

      {/* Account */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[#ebe8e1] bg-white">
        <div className="px-6 py-5 md:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#193c32]">
                Account
              </h2>

              <p className="mt-1 text-sm text-[#777c78]">
                Sign out of your FestyVibe account on this
                device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#dedbd4] px-5 py-3 text-sm font-medium text-[#193c32] transition hover:border-[#193c32] hover:bg-[#f5f7f4]"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}