import { Hono } from 'hono';
import { Laporan } from '@/database/model/all';
import { Invois } from '@/database/model/all';

const laporan = new Hono();

// Fungsi untuk membuat report otomatis dari invoice
async function createReportsFromInvoice(invoice: any) {
    // Cek apakah report untuk invoice ini sudah ada
    const existingReport = await Laporan.findOne({ invoice_ref: invoice._id });
    if (existingReport) return;

    if (invoice.status === 'Unpaid') {
        // Buat report expense untuk invoice unpaid
        const expenseReport = new Laporan({
            amount: invoice.total_amount,
            type: 'Expense',
            description: `Pemesanan tiket untuk ${invoice.reservation?.name || 'pelanggan'}`,
            invoice_ref: invoice._id,
            created_by: 'system', // atau ID user yang sesuai
        });
        await expenseReport.save();
    } else if (invoice.status === 'Paid') {
        // Buat report income untuk invoice paid
        const incomeReport = new Laporan({
            amount: invoice.total_price || (invoice.total_amount + (invoice.fee || 0)),
            type: 'Income',
            description: `Pembayaran tiket dari ${invoice.reservation?.name || 'pelanggan'}`,
            invoice_ref: invoice._id,
            created_by: 'system', // atau ID user yang sesuai
        });
        await incomeReport.save();
    }
}

laporan
    .get("/", async c => {
        const data = await Laporan.find().populate('invoice_ref');
        return c.json({ status: "berhasil", data });
    })
    .get("/:id", async c => {
        const { id } = c.req.param();
        const data = await Laporan.findById(id).populate('invoice_ref');
        return c.json({ status: "berhasil", data });
    });

export default laporan;