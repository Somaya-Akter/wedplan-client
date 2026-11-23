"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  XCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "customer") {
      router.replace(`/dashboard/${session.user.role}`);
      return;
    }

    loadBookings();
  }, [session, isPending]);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/customer/bookings`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Failed to load bookings."
        );
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/customer/bookings/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Cancellation failed."
        );
        return;
      }

      toast.success("Booking cancelled successfully.");
      await loadBookings();
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7a3045]" />

          <p className="mt-4 text-gray-500">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "customer") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Toaster richColors position="top-right" />

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-[#7a3045]"
          >
            WedPlan
          </Link>

          <Link
            href="/dashboard/customer"
            className="text-sm font-semibold text-[#7a3045]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/dashboard/customer"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#7a3045]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <p className="font-semibold text-[#7a3045]">
            Customer Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            Track and manage your wedding service requests.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-14 text-center shadow-sm">
            <CalendarDays
              size={42}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-xl font-bold">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              Browse services and send your first booking request.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-block rounded-xl bg-[#7a3045] px-6 py-3 font-semibold text-white"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="grid gap-5 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-[150px_1fr_auto]"
              >
                <img
                  src={
                    booking.serviceImage ||
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={booking.serviceName}
                  className="h-32 w-full rounded-2xl object-cover"
                />

                <div>
                  <StatusBadge status={booking.status} />

                  <h2 className="mt-3 text-xl font-bold">
                    {booking.serviceName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Vendor: {booking.vendorName || "Wedding Vendor"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {booking.eventDate}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {booking.eventLocation}
                    </span>
                  </div>

                  {booking.message && (
                    <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                      {booking.message}
                    </p>
                  )}
                </div>

                <div>
                  {booking.status === "Pending" && (
                    <button
                      onClick={() =>
                        cancelBooking(booking._id)
                      }
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}