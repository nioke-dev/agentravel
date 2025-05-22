import React from "react";
import ShowInvoice from "@/components/views/invoices/ShowInvoice";

export default async function InvoiceDetailPage() {
    return (
      <section className="w-full max-w-full px-4 mx-auto">
        <ShowInvoice />
      </section>
    );
}