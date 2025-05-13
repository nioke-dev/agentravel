"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"

const data = [
  { name: "Apr", value: 20 },
  { name: "May", value: 120 },
  { name: "Jun", value: 280 },
  { name: "Jul", value: 240 },
  { name: "Aug", value: 480 },
  { name: "Sep", value: 360 },
  { name: "Oct", value: 420 },
  { name: "Nov", value: 300 },
  { name: "Dec", value: 500 },
]

export function DashboardContent() {
  const isMobile = useIsMobile()

  // 🚀 Fetch live reservation count
  const [totalReservations, setTotalReservations] = useState(0);
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/reservasi");
        const json = await res.json();
        if (json.status === "berhasil" && Array.isArray(json.data)) {
          setTotalReservations(json.data.length);
        }
      } catch (err) {
        console.error("Failed to load reservation count", err);
      }
    }
    fetchCount();
  }, []);

  const metrics = [
    {
      title: "Total Reservations",
      value: totalReservations.toString(),
      icon: "calendar",
      color: "blue",
    },
    {
      title: "Ongoing Reservations",
      value: "6",
      icon: "users",
      color: "blue",
    },
    {
      title: "Unpaid Invoices",
      value: "6",
      icon: "file-text",
      color: "blue",
    },
    {
      title: "Revenue This Month",
      value: "Rp. 200 K",
      icon: "dollar-sign",
      color: "blue",
    },
  ]

  return (
    <main className="bg-gray-100 min-h-screen space-y-5">
      {/* Greeting Banner (no card) */}
      <div>
        <h1 className="text-xl font-semibold mb-2">Hello! Good morning Musfiq</h1>
        <p className="text-sm text-gray-500/70 mb-6">Great service starts with great management. Keep up the good work!</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <Card key={m.title} className="bg-white rounded-2xl shadow-md border-0">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{m.title}</p>
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              </div>
              {/* Placeholder for icon; replace with actual icon component */}
              <div className={`p-2 rounded-lg bg-${m.color}-100`}>📅</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics & Recent Reservations */}
      <Card className="bg-grey-100 border-0">
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Panel */}
            <Card className="bg-white rounded-2xl shadow-md border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Monthly Reservations Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <div className="h-[360px]">
                  <ChartContainer
                    config={{ value: { label: "Reservations", color: "hsl(var(--chart-1))" } }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--color-value)"
                          strokeWidth={3}
                          dot={{ fill: "var(--color-value)" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reservations Table */}
            <Card className="bg-white rounded-2xl shadow-md border-0">
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Recent Reservations</CardTitle>
                <a href="#" className="text-sm text-blue-600 hover:underline">See All</a>
              </CardHeader>
              <CardContent className="pt-0 p-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Destination</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800">Satria Abrar</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Bali</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Rp. 250.000</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Booked</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800">Muhammad Paksi</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Jogja</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Rp. 100.000</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Booked</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800">Elis Nurhidayati</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Bandung</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Rp. 150.000</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Booked</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800">Abima Fadhrico</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Probolinggo</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Rp. 50.000</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Canceled</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-800">Bagus Arnovario</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Jakarta</td>
                      <td className="px-4 py-3 text-sm text-gray-800">Rp. 200.000</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
