"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session?.user?.name || "Customer"}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-[#7a3045] px-4 py-2 text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#7a3045]">
            Customer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {session?.user?.name || "Customer"}!
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your wedding bookings and discover trusted wedding services.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Pending Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Accepted Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">0</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            href="/services"
            className="rounded-2xl bg-[#7a3045] p-6 text-white transition hover:bg-[#64263a]"
          >
            <h3 className="text-xl font-semibold">Browse Services</h3>
            <p className="mt-2 text-sm text-white/80">
              Find photographers, venues, caterers and more.
            </p>
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              My Bookings
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              View and manage your wedding service bookings.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}