import type React from "react"
import '@/app/globals.css'
import { Sidebar } from "@/components/views/sidebar"
import { Header } from "@/components/views/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#f5f5f5] p-4">{children}</main>
      </div>
    </div>
  )
}