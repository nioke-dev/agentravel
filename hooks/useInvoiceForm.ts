import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as invoiceService from "@/services/invoiceService";
import * as reservationService from "@/services/reservationService";
import { InvoiceFormValues, Options, Invoice, ReservationReference } from "@/types/invoiceType";
import { useIsMobile } from "@/components/ui/use-mobile";
import { ReservationFormValues } from "@/types/reservationType";

const formatDateForSearch = (date?: string | Date) => {
  if (!date) return "";
  // Format as 'dd/mm/yyyy' to match your locale
  return new Date(date).toLocaleDateString("id-ID");
}

export function useInvoiceForm({ id, initialValues }: Options = {}) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reservations, setReservations] = useState<ReservationFormValues[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const isMobile = useIsMobile();
  
  // Cache for reservation details to use in search
  const [reservationCache, setReservationCache] = useState<{[key: string]: ReservationFormValues}>({});

  // ==== FETCH INVOICE LIST ====
  useEffect(() => {
    setLoading(true);
    invoiceService
      .listInvoices()
      .then((res) => setInvoices(res.data))
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, []); 

  // ==== FETCH RESERVATIONS ====
  useEffect(() => {
    setLoadingReservations(true);
    reservationService
      .listReservations()
      .then((res) => {
        setReservations(res.data);
        
        // Build reservation cache for search
        const cache: {[key: string]: ReservationFormValues} = {};
        res.data.forEach(reservation => {
          if (reservation._id) {
            cache[reservation._id] = reservation;
          }
        });
        setReservationCache(cache);
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
        setReservations([]);
      })
      .finally(() => setLoadingReservations(false));
  }, []);

  // ==== FILTER & SEARCH MEMOIZED ====
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    // If no search query and status filter is "all", return all invoices
    if (!q && statusFilter === "all") {
      return invoices;
    }
    
    return invoices.filter((inv) => {
      // Status filter check
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      if (!matchesStatus) return false;
      
      // If no search query, just apply status filter
      if (!q) return true;
      
      // Get reservation data from either populated field, reference, or cache
      let reservationData = null;
      
      // Try to get from populated field
      if (inv.reservation) {
        reservationData = inv.reservation;
      } 
      // Try to get from cache
      else if (inv.reservation_id && reservationCache[inv.reservation_id]) {
        reservationData = reservationCache[inv.reservation_id];
      }
      
      // Check ticket ID
      let ticketId = '';
      if (reservationData && reservationData.ticket_id) {
        ticketId = String(reservationData.ticket_id).toLowerCase();
      }
      
      // Check customer name
      let customerName = '';
      if (reservationData && reservationData.name) {
        customerName = reservationData.name.toLowerCase();
      }
      
      // Check payment date (formatted for locale)
      const paymentDate = formatDateForSearch(inv.payment_date).toLowerCase();
      
      // Check due date
      const dueDate = formatDateForSearch(inv.due_date).toLowerCase();
      
      // Check status
      const status = inv.status.toLowerCase();
      
      // Check total amount
      const totalAmount = String(inv.total_amount).toLowerCase();
      
      // Check if any field matches the search query
      return (
        ticketId.includes(q) ||
        customerName.includes(q) ||
        paymentDate.includes(q) ||
        dueDate.includes(q) ||
        status.includes(q) ||
        totalAmount.includes(q)
      );
    });
  }, [invoices, searchQuery, statusFilter, reservationCache]);

  // ==== FORM HANDLING ====
  const defaultForm: InvoiceFormValues = {
    reservation_id: "",
    reservation_ref: undefined,
    total_amount: 0,
    fee: 0,
    payment_method: "Bank Transfer",
    payment_date: new Date(),
    issued_date: new Date(),
    due_date: new Date(),
    status: "Unpaid",
  };

  const [form, setForm] = useState<InvoiceFormValues>(() => {
    if (initialValues) {
      return {
        ...defaultForm,
        ...initialValues,
        payment_date: initialValues.payment_date ? new Date(initialValues.payment_date) : new Date(),
        issued_date: initialValues.issued_date ? new Date(initialValues.issued_date) : new Date(),
        due_date: initialValues.due_date ? new Date(initialValues.due_date) : new Date(),
      };
    }
    return defaultForm;
  });

  const [selectedReservation, setSelectedReservation] = useState<ReservationFormValues | null>(null);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoice details when editing
  useEffect(() => {
    if (!isEdit || !id) return;
    setFetching(true);
    invoiceService
      .getInvoice(id)
      .then((data) => {
        setForm({
          ...defaultForm,
          ...data,
          payment_date: new Date(data.payment_date),
          issued_date: new Date(data.issued_date),
          due_date: new Date(data.due_date),
        });
        
        // If we have the populated reservation data, set it
        if (data?.reservation) {
          setSelectedReservation(data.reservation);
          // Also set the reservation_ref for the form
          setForm(prev => ({
            ...prev,
            reservation_ref: {
              _id: data.reservation_id,
              ticket_id: data.reservation && typeof data.reservation === 'object' && 'ticket_id' in data.reservation 
                ? String(data.reservation.ticket_id || '') 
                : '',
              name: data.reservation && typeof data.reservation === 'object' && 'name' in data.reservation 
                ? String(data.reservation.name || '') 
                : ''
            } as ReservationReference
          }));
        } 
        // Otherwise fetch the reservation data
        else if (data.reservation_id) {
          fetchReservationDetails(data.reservation_id);
        }
      })
      .catch((err) => setError(err.message || "Failed to load invoice"))
      .finally(() => setFetching(false));
  }, [id, isEdit, defaultForm]);
  
  // Fetch reservation details when reservation_id changes
  const fetchReservationDetails = async (reservationId: string) => {
    if (!reservationId) return;
    
    try {
      const reservation = await reservationService.getReservation(reservationId);
      setSelectedReservation(reservation);
      
      // Update form with reservation data
      setForm(prev => ({
        ...prev,
        total_amount: reservation.total_price,
        reservation_id: reservationId,
        reservation_ref: {
          _id: reservationId,
          ticket_id: reservation.ticket_id ? reservation.ticket_id.toString() : '',
          name: reservation.name || ''
        }
      }));
      
      // Update reservation cache
      setReservationCache(prev => ({
        ...prev,
        [reservationId]: reservation
      }));
    } catch (error: any) {
      console.error("Error fetching reservation details:", error);
      setError("Failed to load reservation details");
    }
  };

  // Handle reservation selection
  const handleReservationChange = (reservationId: string) => {
    setForm(prev => ({
      ...prev,
      reservation_id: reservationId
    }));
    
    fetchReservationDetails(reservationId);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    
    console.log("Submitting form:", isEdit ? "UPDATE" : "CREATE", form);
    
    try {
      // Prepare payload - ensure dates are properly formatted
      const payload = {
        ...form,
        // Ensure dates are properly formatted for API
        payment_date: form.payment_date,
        issued_date: form.issued_date,
        due_date: form.due_date,
      };

      // Remove reservation_ref before sending to API
      const { reservation_ref, ...apiPayload } = payload;
      
      let result;
      if (isEdit && id) {
        console.log("Updating invoice with ID:", id);
        result = await invoiceService.updateInvoice(id, apiPayload);
        console.log("Update successful:", result);
      } else {
        console.log("Creating new invoice");
        result = await invoiceService.addInvoice(apiPayload);
        console.log("Creation successful:", result);
      }

      // Force a refresh of the page after successful update
      if (typeof window !== 'undefined') {
        router.refresh(); // Refresh current route
      }
      
      return result;
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || (isEdit ? "Gagal memperbarui invoice" : "Gagal membuat invoice"));
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = () => {
    setLoading(true);
    invoiceService
      .listInvoices()
      .then((res) => setInvoices(res.data))
      .catch((err) => {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  };

  return {
    filtered,
    form,
    setForm,
    submit,
    isEdit,
    fetching,
    error,
    loading,
    data: filtered,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    rawList: invoices,
    isMobile,
    reservations,
    loadingReservations,
    selectedReservation,
    handleReservationChange,
    fetchReservationDetails,
    refreshData
  };
}
