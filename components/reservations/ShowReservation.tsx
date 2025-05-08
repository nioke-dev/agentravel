/* components/reservations/ShowReservationForm.tsx */

"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReservationDetail = {
  _id: string;
  nik: number;
  name: string;
  contact: string;
  ticket_id: string;
  destination: string;
  date: string;
  estimated_budget: number;
  total_price: number;
  payment_method: "Prepaid" | "Postpaid";
  payment_status: "Pending" | "Paid";
  status: "Booked" | "Completed" | "Cancelled";
  admin_id: string;
};

type ShowReservationProps = {
  id: string;
};

export const ShowReservation: FC<ShowReservationProps> = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservation() {
      setLoading(true);
      try {
        const response = await fetch(`/api/reservasi/${id}`);
        const result = await response.json();
        if (response.ok && result?.data) {
          const reservation = result.data;
          setData({
            ...reservation,
            date: new Date(reservation.date).toISOString().split("T")[0],
          });
        }
      } catch (error) {
        console.error("Failed to fetch reservation:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReservation();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Reservation not found.</p>;

  const inputClass = "text-bold border-b border-gray-200 font-normal rounded-lg bg-transparent";
  const textClass = "text-semibold text-sm outline outline-1 outline-gray-200 p-2 rounded-lg shadow";

  return (
    <form className="bg-white rounded-lg shadow p-6 space-y-6 w-full">
      <section>
        <h2 className="text-lg font-bold mb-2">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nomor Induk Kependudukan (NIK)</label>
            <Input value={data.nik} readOnly className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Customer Name</label>
            <Input value={data.name} readOnly className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Contact (Phone Number / Email)</label>
            <Input value={data.contact} readOnly className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2">Ticket Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">No. Ticket</label>
            <Input value={data.ticket_id} readOnly className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Destination</label>
            <Input value={data.destination} readOnly className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Departure Date</label>
            <Input type="date" value={data.date} readOnly className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-2">Cost & Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Estimated Budget</label>
            <Input value={data.estimated_budget} readOnly className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Total Price</label>
            <Input value={data.total_price} readOnly className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Type</label>
            <p className={textClass}>{data.payment_method}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-2">Booking & Payment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Booking Status</label>
            <p className={textClass}>{data.status}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Payment Status</label>
            <p className={textClass}>{data.payment_status}</p>
          </div>
        </div>
      </section>

      <div className="flex space-x-2 pt-4">
        <Button className="bg-[#377dec] text-white hover:bg-[#2e61b5] flex items-center" variant="outline" onClick={() => router.back()}>Close Details</Button>
      </div>
    </form>
  );
};
