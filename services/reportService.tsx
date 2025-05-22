import { Report } from "@/types/reportType"

export const reportService = {
  async getAll(): Promise<Report[]> {
    const res = await fetch("/api/laporan")
    const json = await res.json()
    if (json.status === "berhasil") {
      return json.data
    }
    throw new Error("Failed to fetch reports")
  }
}
