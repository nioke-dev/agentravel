'use client';

import type React from "react"
import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/views/sidebar"
import { Header } from "@/components/views/header"
import { UserContext } from "@/app/context/UserContext";
import '@/app/globals.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/pengguna/afterSignIn', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log("Data.loggedIn: ", data.loggedIn);
        console.log("Data user: ", data.user)
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          router.push('/');
        }
      });
  }, []);

  return (
    <UserContext.Provider value={user}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header data={ user }/>
          <main className="flex-1 overflow-y-auto bg-[#f5f5f5] p-4">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}