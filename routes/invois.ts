import { Hono } from 'hono';
import { Invois } from '@/database/model/all';

const invois = new Hono();

invois
  .post("/", async c => {
    const body = await c.req.json();
    const baru = new Invois(body);
    await baru.save();
    return c.json({ message: "Invois dibuat", data: baru });
  })
  .get("/", async c => {
    const list = await Invois.find().populate('reservation_id');
    return c.json({ status: "berhasil", data: list });
  })
  .get("/:id", async c => {
    const { id } = c.req.param();
    const data = await Invois.findById(id).populate('reservation_id');
    if (!data) return c.json({ status: "tidak ditemukan" }, 404);
    return c.json({ status: "berhasil", data });
  })
  .put("/:id", async c => {
    const { id } = c.req.param();
    const body = await c.req.json();
    
    console.log("Updating invoice:", id);
    console.log("Update data:", body);
    
    try {
      // Gunakan findByIdAndUpdate untuk memperbarui dokumen secara langsung
      const updatedInvoice = await Invois.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true } // new: true mengembalikan dokumen yang sudah diperbarui
      ).populate('reservation_id');
      
      if (!updatedInvoice) {
        console.log("Invoice not found:", id);
        return c.json({ status: "tidak ditemukan", message: "Invoice tidak ditemukan" }, 404);
      }
      
      console.log("Invoice updated successfully:", updatedInvoice);
      return c.json({ status: "berhasil", message: "Invoice diperbarui", data: updatedInvoice });
    } catch (error) {
      console.error("Error updating invoice:", error);
      return c.json({ status: "gagal", message: "Gagal memperbarui invoice", error: String(error) }, 500);
    }
  })
  .delete("/:id", async c => {
    const { id } = c.req.param();
    
    try {
      const result = await Invois.findByIdAndDelete(id);
      if (!result) {
        return c.json({ status: "tidak ditemukan", message: "Invoice tidak ditemukan" }, 404);
      }
      return c.json({ status: "berhasil", message: "Invoice dihapus" });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      return c.json({ status: "gagal", message: "Gagal menghapus invoice", error: String(error) }, 500);
    }
  });

export default invois;
