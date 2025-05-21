export type PaymentMethod = "Prepaid" | "Postpaid";

export type PaymentStatus = "Pending" | "Paid";

export type ReservationStatus = "Booked" | "Completed" | "Canceled";

export interface ReservationFormValues {
  nik: number;
  name: string;
  contact: string;
  ticket_id: number;
  destination: string;
  date: Date;
  estimated_budget: number;
  total_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: ReservationStatus;
  admin_id: string;

  readonly _id?: string;

}

export interface ApiResponse<T> {
    status?: string;
    message?: string;
    data: T;
}

export type ReservationFilters = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
};

export interface Options {
  id?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  initialValues?: Partial<ReservationFormValues>;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
}