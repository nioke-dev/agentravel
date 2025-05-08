"use client"
import { useRouter } from "next/navigation"
import { AddReservation } from "@/components/reservations/AddReservation"

export default function AddReservationPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <main className="min-h-screen p-4">
      <AddReservation />
    </main>
  )
}