import { useEffect, useMemo, useState } from "react"
import { Report } from "@/types/reportType"
import { reportService } from "@/services/reportService"

export function useReportForm(type: "Income" | "Expense") {
  const [reports, setReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [amountRange, setAmountRange] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      setLoading(true)
      try {
        const data = await reportService.getAll()
        setReports(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return reports.filter(r => {
      const matchType = r.type === type
      const matchSearch = r.description.toLowerCase().includes(q)
      const matchAmount = (() => {
        switch (amountRange) {
          case "lt1jt": return r.amount < 1_000_000
          case "1to5jt": return r.amount >= 1_000_000 && r.amount <= 5_000_000
          case "gt5jt": return r.amount > 5_000_000
          default: return true
        }
      })()
      return matchType && matchSearch && matchAmount
    })
  }, [reports, searchQuery, amountRange, type])

  return {
    loading,
    reports,
    searchQuery,
    setSearchQuery,
    amountRange,
    setAmountRange,
    filteredReports
  }
}
