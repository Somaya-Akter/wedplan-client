"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) {
        setError(
          signInError.message || "Invalid email or password"
        );
        return;
      }

      const role = data?.user?.role;

      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }

      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });
    } catch (err) {
      setError(err.message || "Google sign in failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue planning your perfect wedding.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#7a3045]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none transition focus:border-[#7a3045]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#7a3045]"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7a3045] px-4 py-3 font-semibold text-white transition hover:bg-[#64263a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#7a3045]"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}