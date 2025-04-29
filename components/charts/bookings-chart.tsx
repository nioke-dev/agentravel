"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type BookingsChartProps = {
  dateRange: { from: Date; to: Date }
  reportType: string
}

// Sample data - in a real app, this would be fetched based on dateRange and reportType
const data = [
  { name: "Jan", bookings: 65 },
  { name: "Feb", bookings: 59 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 81 },
  { name: "May", bookings: 56 },
  { name: "Jun", bookings: 55 },
  { name: "Jul", bookings: 40 },
  { name: "Aug", bookings: 70 },
  { name: "Sep", bookings: 90 },
  { name: "Oct", bookings: 110 },
  { name: "Nov", bookings: 130 },
  { name: "Dec", bookings: 150 },
]

export function BookingsChart({ dateRange, reportType }: BookingsChartProps) {
  // In a real app, we would filter data based on dateRange and reportType
  const filteredData = data

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          bookings: {
            label: "Bookings",
            color: "hsl(var(--chart-3))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-bookings)"
              strokeWidth={2}
              dot={{ fill: "var(--color-bookings)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
