import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Pie, PieChart, ResponsiveContainer, Cell, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line, Legend } from "recharts";

export default function AnalyticsDashboard() {
    const { token } = useAuth();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/reports/analytics/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err)
            alert("Error fetching analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAnalytics();
    }, [token])

    if (loading) return <p>Loading analytics...</p>;
    if (!data) return <p>No analytics available.</p>;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
            {/* Header */}
            <h1 className="text-2xl font-bold">Analytics</h1>
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="text-gray-500">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600">
                        KES {Number(data.total_expenses).toLocaleString()}
                    </p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="text-gray-500">Top Category</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {data.biggest_category || "N/A"}
                    </p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="text-gray-500">Active Days</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {data.daily_trend.length}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Breakdown Pie */}
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.category_breakdown}
                                dataKey="total"
                                nameKey="category"
                                label
                            >
                                {data.category_breakdown.map((_: any, i: number) => (
                                    <Cell key={i} fill={`hsl(${i * 60}, 70%, 60%)`} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Monthly Bar Chart */}
                <div className="p-4 bg-white rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Monthly Summary</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.monthly_summary}>
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Daily Trend Sparkline */}
            <div className="p-4 bg-white rounded-xl shadow">
                <h3 className="font-semibold mb-4">Daily Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.daily_trend}>
                        <XAxis dataKey="label" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line dataKey="total" dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Top Spending Days */}
            <div className="p-4 bg-white rounded-xl shadow">
                <h3 className="font-semibold mb-4">Top Spending Days</h3>
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.top_spending_days.map((d: any, i: number) => (
                            <tr key={i} className="border-t">
                                <td className="p-2 border">{d.label}</td>
                                <td className="p-2 border text-red-600 font-semibold">
                                    {Number(d.total).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>)
}