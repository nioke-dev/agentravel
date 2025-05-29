// pages/api/dashboard-stats.js
import dbConnect from '@/database/connection/mongodb'; // Asumsikan Anda memiliki file koneksi DB
import Reservation from '@/database/model/reservasi'; // Sesuaikan path ke model Anda
import Invoice from '@/database/model/invois';     // Sesuaikan path ke model Anda
import { Hono } from 'hono';

const custom = new Hono();

custom
    .get('/dashboard-stats', async (c) => {
        try {
            // 1. Menghitung total data dalam tabel reservasi.
            const totalReservations = await Reservation.countDocuments();

            // 2. Menghitung total data reservasi di mana property payment_status = 'pending'
            const pendingReservations = await Reservation.countDocuments({ payment_status: 'pending' });

            // 3. Menghitung total data invois dengan property status = 'unpaid'
            const unpaidInvoices = await Invoice.countDocuments({ status: 'unpaid' });

            // 4. Menghitung total pendapatan dari property total_amount tabel invois di mana bulan sama dengan bulan ini dan status 'paid'
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            const monthlyRevenueResult = await Invoice.aggregate([
                {
                $match: {
                    status: 'paid',
                    createdAt: {
                    $gte: new Date(currentYear, currentMonth, 1),
                    $lt: new Date(currentYear, currentMonth + 1, 1)
                    }
                }
                },
                {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total_amount' }
                }
                }
            ]);
            const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].totalRevenue : 0;

            // 5. Menghitung total data invois where bulan sama dengan bulan ini.
            /*
            const totalInvoicesCurrentMonth = await Invoice.countDocuments({
                createdAt: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
                }
            });
            */

            // Set tanggal mulai ke awal bulan 9 bulan yang lalu
            // Contoh: Jika sekarang Mei 2025, akan dimulai dari September 2024 (9 bulan lalu)
            const nineMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 8, 1); // Mengurangi 8 karena ingin 9 bulan (current month + 8 bulan sebelumnya)
            nineMonthsAgo.setHours(0, 0, 0, 0); // Atur ke awal hari
            const sales = await Invoice.aggregate([
                {
                  $match: {
                    status: 'paid', // Hanya hitung penjualan yang sudah dibayar
                    createdAt: { $gte: nineMonthsAgo } // Filter dari 9 bulan yang lalu
                  }
                },
                {
                  $group: {
                    _id: {
                      year: { $year: '$createdAt' },
                      month: { $month: '$createdAt' }
                    },
                    totalSales: { $sum: '$total_amount' }
                  }
                },
                {
                  $project: {
                    _id: 0, // Jangan sertakan _id dari grup
                    year: '$_id.year',
                    month: '$_id.month',
                    monthName: {
                      $switch: {
                        branches: [
                          { case: { $eq: ['$_id.month', 1] }, then: 'Januari' },
                          { case: { $eq: ['$_id.month', 2] }, then: 'Februari' },
                          { case: { $eq: ['$_id.month', 3] }, then: 'Maret' },
                          { case: { $eq: ['$_id.month', 4] }, then: 'April' },
                          { case: { $eq: ['$_id.month', 5] }, then: 'Mei' },
                          { case: { $eq: ['$_id.month', 6] }, then: 'Juni' },
                          { case: { $eq: ['$_id.month', 7] }, then: 'Juli' },
                          { case: { $eq: ['$_id.month', 8] }, then: 'Agustus' },
                          { case: { $eq: ['$_id.month', 9] }, then: 'September' },
                          { case: { $eq: ['$_id.month', 10] }, then: 'Oktober' },
                          { case: { $eq: ['$_id.month', 11] }, then: 'November' },
                          { case: { $eq: ['$_id.month', 12] }, then: 'Desember' }
                        ],
                        default: 'Tidak Diketahui'
                      }
                    },
                    totalSales: 1
                  }
                },
                {
                  $sort: {
                    year: 1,
                    month: 1
                  }
                }
            ]);
          
              // Mengisi bulan yang tidak ada data dengan totalSales 0
              const salesMap = new Map();
              sales.forEach(sale => {
                const key = `${sale.year}-${sale.month}`;
                salesMap.set(key, sale.totalSales);
              });
          
              const result = [];
              for (let i = 0; i < 9; i++) {
                const date = new Date(today.getFullYear(), today.getMonth() - (8 - i), 1);
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // getMonth() is 0-indexed
                const monthName = new Date(year, month - 1).toLocaleString('id-ID', { month: 'short' });
                const key = `${year}-${month}`;
                const totalSales = salesMap.get(key) || 0; // Jika tidak ada data, anggap 0
          
                result.push({
                  year,
                  month,
                  monthName,
                  totalSales,
                });
              }
            const monthlySales = result;

            // 6. Mengambil 5 data terbaru dari tabel invois
            const latestInvoices = await Invoice.find()
                .sort({ createdAt: -1 })
                .limit(5);

            return c.json({
                totalReservations,
                pendingReservations,
                unpaidInvoices,
                monthlyRevenue,
                monthlySales,
                latestInvoices,
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return c.json({ error: 'Failed to fetch dashboard data' });
        }
    })
;

export default custom;