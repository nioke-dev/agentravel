import React from "react";
import { ShowReservation } from "@/components/reservations/ShowReservation";

interface PageProps {
  params: { id: string };
}

export default async function ReservationDetailPage({ params }: PageProps) {
    const { id } = params;
    return (
        <section className="p-6">
        <ShowReservation id={id} />
        </section>
    );
}