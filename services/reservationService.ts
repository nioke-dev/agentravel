import { ReservationFormValues, ApiResponse, Options, PagedResult, ReservationFilters } from "@/types/reservationType";
import { useMemo } from "react";

const BASE_URL = "/api/reservasi";

export async function getAllReservations(filters: ReservationFilters): Promise<ReservationFormValues[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch reservations: ${res.statusText}`);
  }
  const json: ApiResponse<ReservationFormValues[]> = await res.json();
  return json.data;
}

export async function getReservation(
  id: string
): Promise<ReservationFormValues> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reservation ${id}: ${res.statusText}`);
  }
  const json: ApiResponse<ReservationFormValues> = await res.json();
  return json.data;
}

export async function addReservation(payload: ReservationFormValues): Promise<ReservationFormValues> {
  const res = await fetch("/api/reservasi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let message = "Gagal membuat reservasi";

    if (contentType?.includes("application/json")) {
      const err = await res.json();
      message = err.message || message;
    } else {
      const text = await res.text();
      message = text || message;
    }

    throw new Error(message);
  }

  const json: ApiResponse<ReservationFormValues> = await res.json();
  return json.data;
}

export async function updateReservation(
  id: string,
  payload: Partial<ReservationFormValues>
): Promise<ReservationFormValues> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let message = `Gagal memperbarui reservasi ${id}`;

    if (contentType?.includes("application/json")) {
      const err = await res.json();
      message = err.message || message;
    } else {
      const text = await res.text();
      message = text || message;
    }

    throw new Error(message);
  }

  const json: ApiResponse<ReservationFormValues> = await res.json();
  return json.data;
}


export async function deleteReservation(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Failed to delete reservation ${id}`);
  }
}

export async function listReservations(opts: Options = {}): Promise<PagedResult<ReservationFormValues>> {
  const params = new URLSearchParams();
  if (opts.page) params.append("page", opts.page.toString());
  if (opts.limit) params.append("limit", opts.limit.toString());
  if (opts.search) params.append("search", opts.search);
  if (opts.status) params.append("status", opts.status);
  if (opts.payment_status) params.append("payment_status", opts.payment_status);

  const res = await fetch(`/api/reservasi?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch reservations");
  const json = await res.json() as { data: ReservationFormValues[]; total: number };
  return { data: json.data, total: json.total };
}

