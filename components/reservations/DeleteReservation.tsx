"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import DeleteButton from "@/components/ui/DeleteButton"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface DeleteReservationProps {
  id: string
  onSuccess?: () => void
}

export function DeleteReservation({ id, onSuccess }: DeleteReservationProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmDelete = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/reservasi/${id}`, {
        method: "DELETE",
      })
      const json = await res.json()

      if (json.status === "berhasil") {
        toast.success("Reservation deleted successfully.")
        onSuccess?.()
        router.refresh()
      } else {
        toast.error(json.message || "Failed to delete reservation.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while deleting the reservation.")
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DeleteButton onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="bg-white rounded-xl w-full max-w-sm mx-4">
        <DialogHeader className="flex items-center justify-center rounded-t-lg py-4 space-y-4">
        <Trash2 className="h-10 w-10 text-[#C8170D] mb-6"/>
          <DialogTitle>Delete Reservation?</DialogTitle>
          <DialogDescription>You’ll permanently lose this reservation</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-[#C8170D] disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Reservation"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
