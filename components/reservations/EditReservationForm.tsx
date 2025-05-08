// components/reservations/EditReservationForm.tsx
"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Decimal128 } from "bson";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReservationFormValues = {
  nik: number;
  name: string;
  contact: string;
  ticket_id: number;
  destination: string;
  date: Date;
  estimated_budget: Decimal128;
  total_price: Decimal128;
  payment_method: "Prepaid" | "Postpaid"
  payment_status: "Pending" | "Paid";
  status: "Booked" | "Completed" | "Cancelled";
  admin_id: string;
};

const defaultValues: ReservationFormValues = {
  nik: 0,
  name: "",
  contact: "",
  ticket_id: 0,
  destination: "",
  date: new Date(),                                 
  estimated_budget: Decimal128.fromString("0"),
  total_price: Decimal128.fromString("0"),
  payment_method: "Prepaid",
  payment_status: "Pending",
  status: "Booked",
  admin_id: "",
};

type EditReservationFormProps = {
  id: string;
};

export const EditReservationForm: FC<EditReservationFormProps> = ({ id }) => {
  const router = useRouter();
  const [form, setForm] = useState<ReservationFormValues>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing reservation
  useEffect(() => {
    async function load() {
      setFetching(true);
      try {
        const res = await fetch(`/api/reservasi/${id}`);
        const json = await res.json();
        if (res.ok && json.data) {
          const data = json.data;
          setForm({
            nik: data.nik,
            name: data.name,
            contact: data.contact,
            ticket_id: data.ticket_id,
            destination: data.destination,
            date: new Date(data.date),
            estimated_budget: Decimal128.fromString(data.estimated_budget.toString()),
            total_price: Decimal128.fromString(data.total_price.toString()),
            payment_method: data.payment_method,
            payment_status: data.payment_status,
            status: data.status,
            admin_id: data.admin_id,
          });
        } else {
          console.error("Failed to load reservation:", json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        date: form.date.toISOString(),
        estimated_budget: Number(form.estimated_budget.toString()),
        total_price: Number(form.total_price.toString()),
      };
      const res = await fetch(`/api/reservasi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/dashboard/reservations");
      } else {
        const err = await res.json();
        console.error("Error updating reservation:", err);
        alert(err.message || "Gagal mengupdate reservasi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p>Loading reservation...</p>;
  }

  const inputClass = "text-gray-600 border-b border-gray-600 font-normal";

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 w-full">

      {/* Customer Information */}
      <section>
        <h2 className="text-lg font-bold mb-2">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Induk Kependudukan (NIK)</label>
            <Input
              className={inputClass}
              placeholder="Enter NIK"
              type="number"
              value={form.nik}
              onChange={(e) =>
                setForm((f) => ({ ...f, nik: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <Input
              className={inputClass}
              placeholder="Enter customer name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Contact (Phone/Email)</label>
            <Input
              className={inputClass}
              placeholder="Enter contact"
              value={form.contact}
              onChange={(e) =>
                setForm((f) => ({ ...f, contact: e.target.value }))
              }
            />
          </div>
        </div>
      </section>

      {/* Ticket Information */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Ticket Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">No. Ticket</label>
            <Input
              className={inputClass}
              placeholder="Enter ticket ID"
              type="number"
              value={form.ticket_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, ticket_id: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <Input
              className={inputClass}
              placeholder="Enter destination"
              value={form.destination}
              onChange={(e) =>
                setForm((f) => ({ ...f, destination: e.target.value }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Departure Date</label>
            <Input
              className={inputClass}
              type="date"
              value={form.date.toISOString().split("T")[0]}
              onChange={(e) =>
                setForm((f) => ({ ...f, date: new Date(e.target.value) }))
              }
            />

          </div>
        </div>
      </section>

      {/* Cost & Payment */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Cost & Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Budget</label>
            <Input
              className={inputClass}
              type="number"
              value={form.estimated_budget.toString()}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  estimated_budget: Decimal128.fromString(e.target.value || "0"),
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Price</label>
            <Input
              className={inputClass}
              type="number"
              value={form.total_price.toString()}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  total_price: Decimal128.fromString(e.target.value || "0"),
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <Select
              value={form.payment_method}
              onValueChange={(value) =>
                setForm((f) => ({
                  ...f,
                  payment_method: value as "Prepaid" | "Postpaid",
                }))
              }
            >
              <SelectTrigger className="w-full text-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#E7E7E7] border-gray-400">
                <SelectItem value="Prepaid">Prepaid</SelectItem>
                <SelectItem value="Postpaid">Postpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Status
            </label>
            <Select
              value={form.payment_status}
              onValueChange={(value) =>
                setForm((f) => ({
                  ...f,
                  payment_status: value as "Pending" | "Paid",
                }))
              }
            >
              <SelectTrigger className="w-full text-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#E7E7E7] border-gray-400">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Status & Admin */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Booking Status & Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((f) => ({
                  ...f,
                  status: value as "Booked" | "Completed" | "Cancelled",
                }))
              }
            >
              <SelectTrigger className="w-full text-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#E7E7E7] border-gray-400">
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Admin ID</label>
            <Input
              className={inputClass}
              value={form.admin_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, admin_id: e.target.value }))
              }
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex space-x-2 pt-4">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button className="bg-[#377dec] text-white hover:bg-[#2e61b5] flex items-center" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Reservation"}
        </Button>
      </div>
    </div>
  );
};

