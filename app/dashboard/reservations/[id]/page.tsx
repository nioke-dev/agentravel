import React from "react";
import ShowReservation from "@/components/views/reservations/ShowReservation";

export default async function ReservationDetailPage() {
    return (
      <section className="w-full max-w-full px-4 mx-auto">
        <ShowReservation />
      </section>
    );
}