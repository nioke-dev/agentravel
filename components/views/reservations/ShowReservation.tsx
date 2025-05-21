"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useReservationForm } from "@/hooks/useReservationForm";
import { Button } from "@/components/ui/button";

export default function ShowReservation() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const router = useRouter();
  const { form: reservation, fetching, error } = useReservationForm({ id });

  if (fetching) return <p>Loading reservation...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!reservation) return <p>No reservation found.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Customer Information */}
      <section>
        <h2 className="text-lg font-bold mb-2">Customer Information</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="block text-sm font-medium mb-1">Nomor Induk Kependudukan (NIK)</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.nik}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Customer Name</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.name}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Contact (Phone Number/Email)</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.contact}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">Ticket Information</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="block text-sm font-medium mb-1">No. Ticket</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm ont-normal">{reservation.ticket_id}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Destination</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.destination}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Departure Date</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{new Date(reservation.date).toLocaleDateString()}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">Cost & Payment</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="block text-sm font-medium mb-1">Estimated Budget</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.estimated_budget}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Total Price</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.total_price}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Payment Method</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.payment_method}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">Booking & Payment Status</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="block text-sm font-medium mb-1">Booking Status</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.payment_status}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium mb-1">Payment Status</dt>
            <dd className="text-black border border-gray-400 p-1 rounded-lg text-sm font-normal">{reservation.status}</dd>
          </div>
        </dl>
      </section>  

      <div className="flex space-x-2 pt-4">
        <Button
          className="text-white bg-[#377dec] hover:bg-[#2e61b5]"
          onClick={() => router.back()}
        >
          Close Details
        </Button>
      </div>

    </div>
  );
}