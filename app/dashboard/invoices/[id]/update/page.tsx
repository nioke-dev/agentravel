"use client";

import React from "react";
import { useParams } from "next/navigation";
import { InvoiceForm } from "@/components/views/invoices/InvoiceForm";

export default function UpdateInvoicePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="w-full max-w-full px-4 mx-auto">
      <InvoiceForm id={id} />
    </div>
  );
}
