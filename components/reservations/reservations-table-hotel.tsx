"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Plus, Filter, Eye, Edit, Trash } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

type Reservation = {
  _id: string
  ticket_id: string
  name: string
  destination: string
  date: string
  estimated_budget: number
  status: "Booked" | "Canceled" | "Completed"
  payment_status: string
}

export function ReservationsTableHotel() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useIsMobile()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch('/api/reservasi')
        const json = await res.json()
        if (json.status === 'berhasil') {
          setReservations(json.data)
        } else {
          console.error('Failed to fetch:', json)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const deleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return
    try {
      const res = await fetch(`/api/reservasi/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok) {
        setReservations(prev => prev.filter(r => r._id !== id))
      } else {
        console.error('Delete failed:', json)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const filtered = reservations.filter(r =>
    r.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-[#fff886] text-[#a66a02]'
      case 'Canceled':
        return 'bg-[#ffc8c5] text-[#c8170d]'
      case 'Completed':
        return 'bg-[#c0f2cc] text-[#1e7735]'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-sm text-gray-500 mb-2 sm:mb-0">
          {reservations.length} Hotel Reservations
        </h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customer, destination, etc..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-64"
            />
          </div>
          {!isMobile && (
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          )}
          <Link href="/dashboard/reservations/add" passHref>
            <Button className="h-10 text-white bg-[#377dec] hover:bg-[#2e61b5] flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add Reservation
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>No. Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Check-in Date</TableHead>
              <TableHead>Estimated Budget</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map(r => (
                <TableRow key={r._id} className="hover:bg-gray-50">
                  <TableCell>{r.ticket_id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.destination}</TableCell>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell>Rp {r.estimated_budget.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(r.status)}`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell>{r.payment_status}</TableCell>
                  <TableCell className="flex justify-center space-x-2">
                    <Link href={`/dashboard/reservations/${r._id}`}> 
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/dashboard/reservations/${r._id}/edit`}> 
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => deleteReservation(r._id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}