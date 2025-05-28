'use client';

import { DashboardContent } from "@/components/views/dashboard-content";
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalReservations: 0,
        pendingReservations: 0,
        unpaidInvoices: 0,
        monthlyRevenue: 0, 
        monthlySales: [],
        latestInvoices: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/dashboard-stats');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setDashboardData(data); // Langsung ganti state
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []); // [] => hanya dipanggil sekali setelah render pertama
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return <DashboardContent dashboardData={ dashboardData } />
}