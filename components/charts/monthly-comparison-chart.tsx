"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type MonthlyComparisonChartProps = {
  dateRange: { from: Date; to: Date }
  reportType: string
}

// Sample data - in a real app, this would be fetched based on dateRange and reportType
const data = [
  { name: "Jan", thisYear: 4000, lastYear: 2400 },
  { name: "Feb", thisYear: 3000, lastYear: 1398 },
  { name: "Mar", thisYear: 2000, lastYear: 9800 },
  { name: "Apr", thisYear: 2780, lastYear: 3908 },
  { name: "May", thisYear: 1890, lastYear: 4800 },
  { name: "Jun", thisYear: 2390, lastYear: 3800 },
]

export function MonthlyComparisonChart({ dateRange, reportType }: MonthlyComparisonChartProps) {
  // In a real app, we would filter data based on dateRange and reportType
  const filteredData = data

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          thisYear: {
            label: "This Year",
            color: "hsl(var(--chart-1))",
          },
          lastYear: {
            label: "Last Year",
            color: "hsl(var(--chart-3))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="thisYear" fill="var(--color-thisYear)" radius={[4, 4, 0, 0]} barSize={10} name="This Year" />
            <Bar dataKey="lastYear" fill="var(--color-lastYear)" radius={[4, 4, 0, 0]} barSize={10} name="Last Year" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
