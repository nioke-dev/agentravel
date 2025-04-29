"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type BookingStatusChartProps = {
  dateRange: { from: Date; to: Date }
  reportType: string
}

// Sample data - in a real app, this would be fetched based on dateRange and reportType
const data = [
  { name: "Confirmed", value: 65 },
  { name: "Pending", value: 25 },
  { name: "Cancelled", value: 10 },
]

// Using the same colors as the status indicators in the app
const COLORS = ["#34c759", "#ffcc00", "#ff3b30"]

export function BookingStatusChart({ dateRange, reportType }: BookingStatusChartProps) {
  // In a real app, we would filter data based on dateRange and reportType
  const filteredData = data

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Percentage"]}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
