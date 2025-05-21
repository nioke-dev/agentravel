import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as service from "@/services/reservationService";
import { ReservationFormValues, Options } from "@/types/reservationType";
import { useIsMobile } from "@/components/ui/use-mobile";

export function useReservationForm({ id, initialValues }: Options = {}) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const [reservations, setReservations] = useState<ReservationFormValues[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // ==== FETCH LIST ====
  useEffect(() => {
    setLoading(true);
    service
      .listReservations()
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error(err);
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []); // [] artinya hanya sekali saat mount

  // ==== FILTER & SEARCH MEMOIZED ====
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reservations.filter((r) => {
      const ticketStr = String(r.ticket_id).toLowerCase();
      const matchesSearch =
        ticketStr.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchQuery, statusFilter]);

  // ==== FORM HANDLING (untouched) ====
  const defaultForm: ReservationFormValues = {
    nik: 0,
    name: "",
    contact: "",
    ticket_id: 0,
    destination: "",
    date: new Date(),
    estimated_budget: 0,
    total_price: 0,
    payment_method: "Prepaid",
    payment_status: "Pending",
    status: "Booked",
    admin_id: "",
  };

  const [form, setForm] = useState<ReservationFormValues>(() => {
    if (initialValues) {
      return {
        ...defaultForm,
        ...initialValues,
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
      };
    }
    return defaultForm;
  });

  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isEdit || !id) return;
    setFetching(true);
    service
      .getReservation(id)
      .then((data) => {
        setForm({
          ...defaultForm,
          ...data,
          date: new Date(data.date),
        });
      })
      .catch((err) => setError(err.message || "Failed to load reservation"))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        date: new Date(form.date),
      };
  
      if (isEdit && id) {
        await service.updateReservation(id, payload);
      } else {
        await service.addReservation(payload);
      }
  
      router.push("/dashboard/reservations");
    } catch (error: any) {
      console.error("Submission error:", error);
      setError(error.message || (isEdit ? "Gagal memperbarui reservasi" : "Gagal membuat reservasi"));
    } finally {
      setLoading(false);
    }
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
    rawList: reservations,
    isMobile,
  };
}
