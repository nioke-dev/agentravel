import { Hono } from 'hono';
import dbConnect from '@/database/connection/mongodb';
import { Pengguna, 
         Reservasi,
         Pembayaran,
         Invois, 
         LogTransaksi, 
         Laporan 
} from '@/database/models/all';

export const runtime = 'nodejs'; // Sesuaikan dengan environment
const app = new Hono().basePath("/api");

// Koneksi database hanya sekali sebelum rute dijalankan
await dbConnect();

app.get('/hello', async (c) => c.json({ message: 'Hello from Hono!' }));
app.get('/hello2', (c) => c.json({ message: 'Selamat datang di Hono!' }));

app.post("/tambahManual", async c => {
    console.log("Menambahkan data manual");

    // Query dan lain-lain
    try {
        const body = await c.req.json();
        const newUser = new Pengguna({
            username: body.name,
            email: body.email,
            password: body.password, // Harus di-hash dalam produksi
            role: body.role,
        });

        await newUser.save();
        return c.json({ message: "Berhasil menambahkan data manual" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ error: String(error) }, 500);
    }
});

// Rute-rute API antara Next.js (frontend) dan Hono (backend)
/* -------------- MANAJEMEN PENGGUNA -------------- */
app.get("/pengguna", async c => {
        console.log("Mengambil data semua pengguna");

        // Query dan lain-lain
        try {
            const pengguna = await Pengguna.find();
            
            return c.json({ 
                status: "berhasil", 
                data: pengguna 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status: "gagal", 
                message: 'Gagal mengambil data pengguna', 
                error: String(error) 
            }, 500); 
        }
    })
    .get("/pengguna/:id", async c => {
        console.log("Mengambil detail pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const pengguna = await Pengguna.findById(id);
            return c.json({ 
                status: "berhasil", 
                data: pengguna 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .post("/pengguna", async c => {
        console.log("Menambah data pengguna baru");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const newUser = new Pengguna({
                username: body.name,
                email: body.email,
                password: body.password, // Harus di-hash dalam produksi
                role: body.role,
            });
    
            await newUser.save();
            return c.json({ 
                message: "Berhasil menambahkan data manual", 
                data: newUser 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .put("/pengguna/:id", async c => {
        console.log("Memperbarui data pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const pengguna = await Pengguna.findByIdAndUpdate(id, { $set: 
                { 
                  username: body.username,
                  email: body.email,
                  password: body.password, // Harus di-hash dalam produksi
                  role: body.role,
                }
            }, { new: true });
            
            return c.json({ 
                status  : "berhasil", 
                data    : pengguna
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .delete("/pengguna/:id", async c => {
        console.log("Menghapus data pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            await Pengguna.findOneAndDelete({ "id": id });
            
            return c.json({ 
                status: "berhasil", 
                message: 'Data pengguna berhasil dihapus' 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status: "gagal", 
                message: 'Gagal menghapus data pengguna', 
                error: String(error) 
            }, 500); 
        }
    });

/* -------------- MANAJEMEN CUSTOMER -------------- */
/*
app.get("/customer", async c => {
        console.log("Mengambil data semua customer");
        // Query dan lain-lain
        c.json({ message: 'Hello from Hono!' });
    })
    .post("/customer", async c => {
        console.log("Menambah data customer baru");
        // Query dan lain-lain
    })
    .get("/customer/:id", async c => {
        console.log("Mengambil data customer menurut id");
        // Query dan lain-lain
    })
    .put("/customer/:id", async c => {
        console.log("Memperbarui data customer menurut id");
        // Query dan lain-lain
    })
    .delete("/customer/:id", async c => {
        console.log("Menghapus data customer menurut id");
        // Query dan lain-lain
    });
*/

/* -------------- MANAJEMEN RESERVASI -------------- */
app.get("/reservasi", async c => {
        console.log("Mengambil data semua reservasi");
        
        // Query dan lain-lain
        try {
            const reservasi = await Reservasi.find();
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .post("/reservasi", async c => {
        console.log("Menambahkan data reservasi baru");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const reservasiBaru = new Reservasi({ 
                nik: body.nik,
                name: body.name,
                contact: body.contact, 
                ticket_id: body.ticket_id,
                destination: body.destination,
                date: body.date,
                estimated_budget: body.estimated_budget,
                total_price: body.total_price,
                payment_method: body.payment_method,
                payment_status: body.payment_status,
                status: body.status,
                admin_id: body.admin_id,
            });

            await reservasiBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data reservasi", 
                data    : reservasiBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .get("/reservasi/:id", async c => {
        console.log("Mengambil detail reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const reservasi = await Reservasi.findById(id);
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data reservasi', 
                error   : String(error) 
            }, 500); 
        }
    })
    .put("/reservasi/:id", async c => {
        console.log("Memperbarui data reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const reservasi = await Reservasi.findByIdAndUpdate(id, { $set: 
                { 
                    nik: body.nik,
                    name: body.name,
                    contact: body.contact, 
                    ticket_id: body.ticket_id,
                    destination: body.destination,
                    date: body.date,
                    estimated_budget: body.estimated_budget,
                    total_price: body.total_price,
                    payment_method: body.payment_method,
                    payment_status: body.payment_status,
                    status: body.status,
                    admin_id: body.admin_id,
                }
            }, { new: true });
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .delete("/reservasi/:id", async c => {
        console.log("Menghapus reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            await Reservasi.findOneAndDelete({ "id": id });
            
            return c.json({ 
                status  : "berhasil", 
                message : 'Data reservasi berhasil dihapus' 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal menghapus data reservasi', 
                error   : String(error) 
            }, 500); 
        }
    });

/* -------------- MANAJEMEN PEMBAYARAN -------------- */
app.post("/pembayaran", async c => {
        console.log("Membuat pembayaran");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const pembayaranBaru = new Pembayaran({ 
                reservasiId: body.reservasiId,
                jumlah: body.jumlah,
                metode: body.metode, 
                status: body.status,
            });

            await pembayaranBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data pembayaran", 
                data    : pembayaranBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .put("/pembayaran/:id", async c => {
        console.log("Memperbarui data pembayaran menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const pembayaran = await Pembayaran.findByIdAndUpdate(id, { $set: 
                { 
                    reservasiId: body.reservasiId,
                    jumlah: body.jumlah,
                    metode: body.metode, 
                    status: body.status,
                }
            }, { new: true });
            return c.json({ 
                status  : "berhasil", 
                data    : pembayaran 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal memperbarui data pembayaran', 
                error   : String(error) 
            }, 500); 
        }
    });

/* -------------- MANAJEMEN INVOIS -------------- */
app.post("/invois", async c => {
        console.log("Membuat dan mengirim invois");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const invoisBaru = new Pembayaran({ 
                reservation_id: body.reservation_id,
                total_amount: body.total_amount,
                fee: body.fee,
                payment_method: body.payment_method,
                payment_date: body.payment_date,
                issued_date: body.issued_date,
                due_date: body.due_date,
                status: body.status,
            });

            await invoisBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data invois", 
                data    : invoisBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .get("/invois/:id", async c => {
        console.log("Mendapatkan detail invois menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const invois = await Invois.findById(id);
            
            return c.json({ 
                status  : "berhasil", 
                data    : invois 
            }, 200);
        } catch (error: unknown) {
            
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    });

/* ---------- MANAJEMEN RIWAYAT TRANSAKSI ---------- */
app.get("/log-transaksi", async c => {
        console.log("Mendapatkan daftar log transaksi");
        
        // Query dan lain-lain
        try {
            const logTransaksi = await LogTransaksi.find();
            
            return c.json({ 
                status  : "berhasil", 
                data    : logTransaksi 
            }, 200);
        
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500);
        }
    })
    .get("/log-transaksi/:id", async c => {
        console.log("Mendapatkan detail log transaksi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const logTransaksi = await LogTransaksi.findById(id);
            
            return c.json({ 
                status  : "berhasil", 
                data    : logTransaksi 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    });

/* -------------- MANAJEMEN LAPORAN -------------- */
app.get("/laporan", async c => {
    console.log("Mendapatkan laporan");

    // Query dan lain-lain
    try {
        const laporan = await Laporan.find();
        
        return c.json({ 
            status  : "berhasil", 
            data    : laporan 
        }, 200);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ 
            status  : "gagal", 
            message : 'Gagal mengambil data laporan', 
            error   : String(error) 
        }, 500); 
    }
});

// // Menangani request dari Next.js
// export default async function handler(req: Request) {
//   return app.fetch(req);
// }

// Definisikan metode HTTP sebagai named exports
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;