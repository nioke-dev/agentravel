"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Plus, Filter, Settings2Icon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import EditButton from "@/components/ui/EditButton"
import ShowDetails from "@/components/ui/ShowDetails"
// import DeleteButton from "@/components/ui/DeleteButton"
import { DeleteReservation } from "@/components/reservations/DeleteReservation"
import { Select } from "@/components/ui/select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Reservation = {
  _id: string
  ticket_id: number
  name: string
  destination: string
  date: Date
  estimated_budget: number
  total_price: number
  status: "Booked" | "Canceled" | "Completed"
}

export function ReservationsTableFlight() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
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

  // Filtered data reservasi
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return reservations.filter(r => {
      const ticketStr = String(r.ticket_id).toLowerCase()
      const matchesSearch =
        ticketStr.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [reservations, searchQuery, statusFilter])
  

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
          {reservations.length} Flight Reservations
        </h3>
        <div className="flex items-center space-x-2">
          {/* Search input */}
          <div className="relative inline-block">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400 " />
            <Input
              placeholder="Search customer, etc..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-fit"
            />
          </div>
          {/* Filter by status */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 rounded-md border border-input border-gray-300 bg-background px-3 py-2 flex items-center space-x-2" aria-label="Filter status">
                <Settings2Icon className="h-5 w-5 grayscale-50" />
                <span>Filter</span>
              </SelectTrigger>
              <SelectContent>
                {/* use a real non‐empty value for “no filter” */}
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Tambah Reservasi */}
          <Link href="/dashboard/reservations/add" passHref>
            <Button className="h-10 text-white bg-[#377dec] hover:bg-[#2e61b5] flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add Reservation
            </Button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E7E7E7] text-[#888888] rounded-t-xl ">
            <TableRow>
              <TableHead>No. Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Departure Date</TableHead>
              <TableHead>Estimated Budget</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Booking Status</TableHead>
              {/* <TableHead>Payment Status</TableHead> */}
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
                  <TableCell>Rp{r.estimated_budget}</TableCell>
                  <TableCell>Rp{r.total_price}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center justify-center w-24 min-w-[6rem] px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-center space-x-2">
                    <Link href={`/dashboard/reservations/${r._id}`} passHref> 
                      <ShowDetails />
                    </Link>
                    <Link href={`/dashboard/reservations/edit/${r._id}`} passHref> 
                      <EditButton />
                    </Link>
                    <DeleteReservation id={r._id} />
                    {/* tombol action delete diambil dari components\ui\DeleteButton.tsx */}
                    {/* dan fungsi delete nya diambil dari components\reservations\DeleteReservation.tsx */}
                      
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