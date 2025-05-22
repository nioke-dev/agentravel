import { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';

/**
 * Custom hook to export an invoice to PDF
 */
export function useExportInvoice(invoiceId: string) {
  const { form: invoice, fetching } = useInvoiceForm({ id: invoiceId });
  const hiddenRef = useRef<HTMLDivElement>(null);

  // When invoice data is ready, render it into a hidden container
  useEffect(() => {
    if (!invoice || !hiddenRef.current) return;
    hiddenRef.current.innerHTML = `
      <div style="padding:16px; font-family:sans-serif;">
        <h2>Invoice #${invoice._id}</h2>
        <p>Reservation: ${invoice.reservation_ref?.ticket_id ?? '-'} - ${invoice.reservation_ref?.name ?? '-'}</p>
        <p>Issued: ${invoice.issued_date.toLocaleDateString()}</p>
        <p>Due: ${invoice.due_date.toLocaleDateString()}</p>
        <p>Status: ${invoice.status}</p>
        <p>Total: Rp ${invoice.total_amount.toLocaleString('id-ID')}</p>
        <p>Fee: Rp ${invoice.fee.toLocaleString('id-ID')}</p>
      </div>
    `;
  }, [invoice]);

  async function exportInvoice() {
    if (fetching || !hiddenRef.current) return;
    const canvas = await html2canvas(hiddenRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const width = pdf.internal.pageSize.getWidth();
    const props = pdf.getImageProperties(imgData);
    const height = (props.height * width) / props.width;
    const pdfUrl = pdf.output('bloburl');
    window.open(pdfUrl, '_blank');
  }

  return { hiddenRef, exportInvoice, fetching };
}