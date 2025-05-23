import { Hono } from 'hono';
import { Laporan } from '@/database/model/all';

const laporan = new Hono();

laporan
  .get("/", async c => {
  const data = await Laporan.find();
  return c.json({ status: "berhasil", data });
  })
  .get("/:id", async c => {
      const { id } = c.req.param();
      const data = await Laporan.findById(id);
      return c.json({ status: "berhasil", data });
  });

export default laporan;
