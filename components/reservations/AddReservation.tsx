"use client"

import React, { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Decimal128 } from "bson"

export type ReservationFormValues = {
  nik: number
  name: string
  contact: string
  ticket_id: number
  destination: string
  date: Date
  estimated_budget: Decimal128
  total_price: Decimal128
  payment_method: "Prepaid" | "Postpaid"
  payment_status: "Pending" | "Paid"
  status: "Booked" | "Completed" | "Cancelled"
  admin_id: string
}

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
}

export const AddReservation: FC = () => {
  const router = useRouter()
  const [form, setForm] = useState<ReservationFormValues>(defaultValues)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        nik: form.nik,
        name: form.name,
        contact: form.contact,
        ticket_id: form.ticket_id,
        destination: form.destination,
        date: form.date.toISOString(),
        estimated_budget: Number(form.estimated_budget.toString()),
        total_price: Number(form.total_price.toString()),
        payment_method: form.payment_method,
        payment_status: form.payment_status,
        status: form.status,
        admin_id: form.admin_id,
      }

      const res = await fetch("/api/reservasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/dashboard/reservations")
      } else {
        const err = await res.json()
        console.error("Error adding reservation:", err)
        alert(err.message || "Gagal membuat reservasi")
      }
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan server")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "text-gray-600 border-b border-gray-300 rounded-lg font-normal"

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
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
              onChange={e => setForm(f => ({ ...f, nik: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <Input
              className={inputClass}
              placeholder="Enter customer name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Contact (Phone/Email)</label>
            <Input
              className={inputClass}
              placeholder="Enter contact"
              value={form.contact}
              onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
            />
          </div>
        </div>
      </section>

      {/* Ticket Information */}
      <section>
      <h2 className="text-lg font-bold mb-2">Ticket Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">No. Ticket</label>
            <Input
              className={inputClass}
              placeholder="Enter ticket ID"
              type="number"
              value={form.ticket_id}
              onChange={e => setForm(f => ({ ...f, ticket_id: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <Input
              className={inputClass}
              placeholder="Enter destination"
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Departure Date</label>
            <Input
              className={inputClass}
              type="date"
              value={form.date.toISOString().split("T")[0]}
              onChange={e => setForm(f => ({ ...f, date: new Date(e.target.value) }))}
            />
          </div>
        </div>
      </section>

      {/* Cost & Payment */}
      <section>
      <h2 className="text-lg font-bold mb-2">Cost & Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Budget</label>
            <Input
              className={inputClass}
              type="number"
              value={form.estimated_budget.toString()}
              onChange={e => setForm(f => ({ ...f, estimated_budget: Decimal128.fromString(e.target.value || "0") }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Price</label>
            <Input
              className={inputClass}
              type="number"
              value={form.total_price.toString()}
              onChange={e => setForm(f => ({ ...f, total_price: Decimal128.fromString(e.target.value || "0") }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <Select
              value={form.payment_method}
              onValueChange={value => setForm(f => ({ ...f, payment_method: value as "Prepaid" | "Postpaid" }))}
            >
              <SelectTrigger className="w-full text-gray-600 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-[#E7E7E7] border-gray-400">
                <SelectItem value="Prepaid">Prepaid</SelectItem>
                <SelectItem value="Postpaid">Postpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <Select
              value={form.payment_status}
              onValueChange={value => setForm(f => ({ ...f, payment_status: value as "Pending" | "Paid" }))}
            >
              <SelectTrigger className="w-full text-gray-600 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select status" />
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
              onValueChange={value => setForm(f => ({ ...f, status: value as "Booked" | "Completed" | "Cancelled" }))}
            >
              <SelectTrigger className="w-full text-gray-600 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select booking status" />
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
              placeholder="Enter admin ID"
              value={form.admin_id}
              onChange={e => setForm(f => ({ ...f, admin_id: e.target.value }))}
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex space-x-2 pt-4">
        <Button className="border-gray-400 text-gray-600 hover:bg-gray-200 flex items-center" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button className="bg-amber-400 text-white hover:bg-amber-500"
          variant="outline"
          onClick={() => setForm(defaultValues)}
          disabled={loading}
        >
          Reset
        </Button>
        <Button className="bg-[#377dec] text-white hover:bg-[#2e61b5] flex items-center" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Add Reservation"}
        </Button>
      </div>
    </div>
  )
}