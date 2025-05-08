import React from 'react'
import { notFound } from 'next/navigation'
import { EditReservationForm } from '@/components/reservations/EditReservationForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditReservationPage({ params }: PageProps) {
  const { id } = params
  if (!id) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Reservation</h1>
        <EditReservationForm id={id} />
      </div>
    </main>
  )
}

export const runtime = 'edge';
