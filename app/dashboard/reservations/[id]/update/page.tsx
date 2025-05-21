"use client";
import React from "react";
import { useParams } from "next/navigation";
import { ReservationForm } from "@/components/views/reservations/ReservationForm";

export default function UpdateReservation() {
  const { id } = useParams();
  return (
    // menggunakan btn-update sebagai button UpdateReservation dan menampilkan reservationForm dibawah!
    <div className="w-full max-w-full px-4 mx-auto">
      <ReservationForm id={Array.isArray(id) ? id[0] : id} />
    </div>
  );
}