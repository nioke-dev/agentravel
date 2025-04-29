"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type RevenueChartProps = {
  dateRange: { from: Date; to: Date }
  reportType: string
}

// Sample data - in a real app, this would be fetched based on dateRange and reportType
const data = [
  { name: "Jan", domestic: 4000, international: 2400 },
  { name: "Feb", domestic: 3000, international: 1398 },
  { name: "Mar", domestic: 2000, international: 9800 },
  { name: "Apr", domestic: 2780, international: 3908 },
  { name: "May", domestic: 1890, international: 4800 },
  { name: "Jun", domestic: 2390, international: 3800 },
  { name: "Jul", domestic: 3490, international: 4300 },
]

export function RevenueChart({ dateRange, reportType }: RevenueChartProps) {
  // In a real app, we would filter data based on dateRange and reportType
  const filteredData = data

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          domestic: {
            label: "Domestic",
            color: "hsl(var(--chart-1))",
          },
          international: {
            label: "International",
            color: "hsl(var(--chart-2))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="domestic" fill="var(--color-domestic)" radius={[4, 4, 0, 0]} barSize={20} name="Domestic" />
            <Bar
              dataKey="international"
              fill="var(--color-international)"
              radius={[4, 4, 0, 0]}
              barSize={20}
              name="International"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
