"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  BriefcaseBusiness,
  CalendarCheck,
  CreditCard,
  LogOut,
  Trash2,
  Power,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function VendorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [overview, setOverview] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "vendor") {
      router.replace(`/dashboard/${session.user.role || "customer"}`);
      return;
    }

    loadVendorData();
  }, [session, isPending]);

  const loadVendorData = async () => {
    try {
      setLoadingData(true);

      const [overviewRes, servicesRes] = await Promise.all([
        fetch(`${API_URL}/api/vendor/overview`, {
          credentials: "include",
          cache: "no-store",
        }),

        fetch(`${API_URL}/api/vendor/services`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const overviewData = await overviewRes.json();
      const servicesData = await servicesRes.json();

      if (overviewRes.ok) {
        setOverview(overviewData.stats);
      }

      if (servicesRes.ok) {
        setServices(servicesData.services || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor dashboard.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    if (
      !form.serviceName ||
      !form.category ||
      !form.description ||
      !form.price ||
      !form.location ||
      !form.image
    ) {
      toast.error("Please complete all service fields.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/vendor/services`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceName: form.serviceName,
            category: form.category,
            description: form.description,
            price: Number(form.price),
            location: form.location,
            images: [form.image],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to add service.");
        return;
      }

      toast.success("Service submitted for admin approval.");

      setForm({
        serviceName: "",
        category: "",
        description: "",
        price: "",
        location: "",
        image: "",
      });

      await loadVendorData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/vendor/services/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Delete failed.");
        return;
      }

      toast.success("Service deleted.");
      await loadVendorData();
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  const toggleAvailability = async (service) => {
    try {
      const response = await fetch(
        `${API_URL}/api/vendor/services/${service._id}/availability`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !service.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to update availability.");
        return;
      }

      toast.success(data.message);
      await loadVendorData();
    } catch {
      toast.error("Unable to update service.");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/sign-in");
    router.refresh();
  };

  if (isPending || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7a3045]" />

          <p className="mt-4 text-gray-500">
            Loading vendor dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "vendor") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1]">
      <Toaster richColors position="top-right" />

      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-[#281d21] p-6 text-white lg:flex">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            WedPlan
          </Link>

          <p className="mt-2 text-xs text-white/50">
            Vendor Dashboard
          </p>

          <nav className="mt-10 space-y-2">
            <a
              href="#overview"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm"
            >
              <LayoutDashboard size={18} />
              Overview
            </a>

            <a
              href="#add-service"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <PlusCircle size={18} />
              Add Service
            </a>

            <a
              href="#my-services"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <BriefcaseBusiness size={18} />
              My Services
            </a>

            <Link
              href="/dashboard/vendor/bookings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <CalendarCheck size={18} />
              Booking Requests
            </Link>

            <Link
              href="/dashboard/vendor/subscription"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <CreditCard size={18} />
              Subscription
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-200 hover:bg-white/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <section className="flex-1">
          <header className="border-b bg-white px-6 py-4">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Welcome back
                </p>

                <h1 className="font-bold text-gray-900">
                  {session.user.businessName ||
                    session.user.name}
                </h1>
              </div>

              <div className="rounded-full bg-[#f3e3e8] px-4 py-2 text-sm font-semibold text-[#7a3045]">
                {overview?.subscriptionPlan || "Free"} Plan
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl space-y-12 px-6 py-8">
            <section id="overview">
              <p className="font-semibold text-[#7a3045]">
                Vendor Overview
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Dashboard
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                  title="Total Services"
                  value={overview?.totalServices || 0}
                />

                <StatCard
                  title="Active Services"
                  value={overview?.activeServices || 0}
                />

                <StatCard
                  title="Pending Requests"
                  value={overview?.pendingBookings || 0}
                />

                <StatCard
                  title="Accepted Bookings"
                  value={overview?.acceptedBookings || 0}
                />

                <StatCard
                  title="Current Plan"
                  value={overview?.subscriptionPlan || "Free"}
                />
              </div>
            </section>

            <section
              id="add-service"
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="mb-6">
                <p className="font-semibold text-[#7a3045]">
                  Add Service
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Publish a wedding service
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  New services remain Pending until approved by an admin.
                </p>
              </div>

              <form
                onSubmit={handleAddService}
                className="grid gap-5 md:grid-cols-2"
              >
                <FormField label="Service Name">
                  <input
                    name="serviceName"
                    value={form.serviceName}
                    onChange={handleChange}
                    placeholder="Premium Wedding Photography"
                    className="input"
                  />
                </FormField>

                <FormField label="Category">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Price (BDT)">
                  <input
                    type="number"
                    min="1"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="25000"
                    className="input"
                  />
                </FormField>

                <FormField label="Location">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    className="input"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Description">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your wedding service..."
                      className="input resize-none"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Service Image URL">
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Image file upload via ImgBB will be connected next.
                    </p>
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <button
                    disabled={submitting}
                    className="rounded-xl bg-[#7a3045] px-6 py-3 font-semibold text-white transition hover:bg-[#64263a] disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit Service"}
                  </button>
                </div>
              </form>
            </section>

            <section id="my-services">
              <div>
                <p className="font-semibold text-[#7a3045]">
                  My Services
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Manage your services
                </h2>
              </div>

              {services.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-sm">
                  <BriefcaseBusiness
                    size={38}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="mt-4 font-bold">
                    No services yet
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Add your first wedding service above.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {services.map((service) => (
                    <article
                      key={service._id}
                      className="overflow-hidden rounded-3xl bg-white shadow-sm"
                    >
                      <img
                        src={service.images?.[0]}
                        alt={service.serviceName}
                        className="h-48 w-full object-cover"
                      />

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                service.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : service.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {service.status}
                            </span>

                            <h3 className="mt-3 text-lg font-bold">
                              {service.serviceName}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {service.category} · {service.location}
                            </p>
                          </div>

                          <p className="font-bold text-[#7a3045]">
                            ৳
                            {Number(
                              service.price
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              toggleAvailability(service)
                            }
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
                          >
                            <Power size={14} />

                            {service.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(service._id)
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          outline: none;
          background: white;
        }

        .input:focus {
          border-color: #7a3045;
        }
      `}</style>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      {children}
    </label>
  );
}