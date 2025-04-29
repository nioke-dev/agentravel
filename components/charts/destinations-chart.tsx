"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type DestinationsChartProps = {
  dateRange: { from: Date; to: Date }
  reportType: string
}

// Sample data - in a real app, this would be fetched based on dateRange and reportType
const data = [
  { name: "Paris", bookings: 120 },
  { name: "Tokyo", bookings: 98 },
  { name: "New York", bookings: 86 },
  { name: "London", bookings: 75 },
  { name: "Rome", bookings: 60 },
  { name: "Bali", bookings: 45 },
  { name: "Sydney", bookings: 40 },
]

export function DestinationsChart({ dateRange, reportType }: DestinationsChartProps) {
  // In a real app, we would filter data based on dateRange and reportType
  const filteredData = data.sort((a, b) => b.bookings - a.bookings)

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          bookings: {
            label: "Bookings",
            color: "hsl(var(--chart-4))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[0, 4, 4, 0]} barSize={20} name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
