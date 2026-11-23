"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CreditCard,
  LogOut,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "admin") {
      router.replace(`/dashboard/${session.user.role || "customer"}`);
      return;
    }

    loadServices();
  }, [session, isPending]);

  const loadServices = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/api/admin/services?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to load services.");
        return;
      }

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !isPending &&
      session?.user?.role === "admin"
    ) {
      const timer = setTimeout(() => {
        loadServices();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [search, statusFilter]);

  const reviewService = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/services/${id}/review`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Action failed.");
        return;
      }

      toast.success(data.message);
      await loadServices();
    } catch {
      toast.error("Failed to review service.");
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/services/${id}`,
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

      toast.success("Service deleted successfully.");
      await loadServices();
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/sign-in");
    router.refresh();
  };

  const totalServices = services.length;

  const pendingServices = services.filter(
    (service) => service.status === "Pending"
  ).length;

  const approvedServices = services.filter(
    (service) => service.status === "Approved"
  ).length;

  const rejectedServices = services.filter(
    (service) => service.status === "Rejected"
  ).length;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        Loading admin dashboard...
      </div>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1]">
      <Toaster richColors position="top-right" />

      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-[#21191c] p-6 text-white lg:flex">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            WedPlan
          </Link>

          <p className="mt-2 text-xs text-white/50">
            Admin Dashboard
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
              href="#services"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <BriefcaseBusiness size={18} />
              Manage Services
            </a>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40">
              <Users size={18} />
              Manage Users
            </div>

            <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/40">
              <CreditCard size={18} />
              Transactions
            </div>
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
                  Administrator
                </p>

                <h1 className="font-bold">
                  {session.user.name}
                </h1>
              </div>

              <span className="rounded-full bg-[#f4e4e9] px-4 py-2 text-sm font-semibold text-[#7a3045]">
                Admin
              </span>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-8">
            <section id="overview">
              <p className="font-semibold text-[#7a3045]">
                Platform Overview
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Admin Dashboard
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Services"
                  value={totalServices}
                />

                <StatCard
                  title="Pending Services"
                  value={pendingServices}
                />

                <StatCard
                  title="Approved Services"
                  value={approvedServices}
                />

                <StatCard
                  title="Rejected Services"
                  value={rejectedServices}
                />
              </div>
            </section>

            <section
              id="services"
              className="mt-12"
            >
              <div>
                <p className="font-semibold text-[#7a3045]">
                  Manage Services
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Review vendor submissions
                </h2>
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search service or vendor..."
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
                />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7a3045]"
                >
                  <option value="">
                    All Status
                  </option>
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Approved">
                    Approved
                  </option>
                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              {loading ? (
                <div className="py-20 text-center text-gray-500">
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-white p-12 text-center shadow-sm">
                  No services found.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {services.map((service) => (
                    <article
                      key={service._id}
                      className="grid gap-5 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-[150px_1fr_auto]"
                    >
                      <img
                        src={service.images?.[0]}
                        alt={service.serviceName}
                        className="h-32 w-full rounded-2xl object-cover"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={service.status} />

                          <span className="text-xs text-gray-400">
                            {service.category}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-bold">
                          {service.serviceName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Vendor:{" "}
                          {service.vendorBusinessName ||
                            service.vendorName ||
                            service.vendorEmail}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {service.location} · ৳
                          {Number(
                            service.price
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap content-start gap-2 md:max-w-[210px]">
                        {service.status !== "Approved" && (
                          <button
                            onClick={() =>
                              reviewService(
                                service._id,
                                "Approved"
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>
                        )}

                        {service.status !== "Rejected" && (
                          <button
                            onClick={() =>
                              reviewService(
                                service._id,
                                "Rejected"
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteService(service._id)
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}