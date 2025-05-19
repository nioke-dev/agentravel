import { Trash2 } from "lucide-react";
import * as service from "@/services/invoiceService";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import DeleteButton from "@/components/ui/btn-action";

interface DeleteInvoiceProps {
  id: string;
  onSuccess?: () => void;
}

export function DeleteInvoice({ id, onSuccess }: DeleteInvoiceProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await service.deleteInvoice(id);
      toast.success("Invoice deleted successfully");
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to delete reservation");
      toast.error(err.message || "Failed to delete reservation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DeleteButton onClick={() => setOpen(true)} />
      </DialogTrigger>

      <DialogContent className="bg-white rounded-xl w-full max-w-sm mx-4">
        <DialogHeader className="flex flex-col items-center space-y-2 py-4">
          <Trash2 className="h-10 w-10 text-[#C8170D] mb-6"/>
          <DialogTitle>Delete Invoice?</DialogTitle>
          <DialogDescription>
            You'll permanently lose this data invoices.
          </DialogDescription>
          {error && (
            <p className="text-sm text-red-600 mt-2">Error: {error}</p>
          )}
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-cceter space-x-4 mt-4">
          <DialogClose asChild>
            <button className="px-6 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-200 disabled:opacity-50 min-w-[120px]">
              Cancel
            </button>
          </DialogClose>

          <button
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="px-6 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-[#C8170D] disabled:opacity-50 min-w-[120px]"
          >
            {isLoading ? "Deleting..." : "Delete Invoice"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}