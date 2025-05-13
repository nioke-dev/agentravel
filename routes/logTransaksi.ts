import { Hono } from 'hono';
import { LogTransaksi } from '@/database/model/all';

const log = new Hono();

log
  .get("/", async c => {
    const data = await LogTransaksi.find();
    return c.json({ status: "berhasil", data });
  })
  .get("/:id", async c => {
    const { id } = c.req.param();
    const data = await LogTransaksi.findById(id);
    return c.json({ status: "berhasil", data });
  });

export default log;
