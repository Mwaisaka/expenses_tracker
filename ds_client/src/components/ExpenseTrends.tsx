import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function ExpenseTrends() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

    const fetchTrends = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const res = await fetch(`http://127.0.0.1:8000/reports/trends/?period=${period}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (!res.ok) throw new Error("Failed tp fetch trends")

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            alert("Failed to load trends.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends();
    }, [period]);

    return (
        <div className="p-6 bg-white shadow rounded-xl mt-6">
            {/* Header */}
            <h2 className="text-xl font-semibold mb-5">Expense Trends</h2>
            <div className="flex justify-between items-center mb-4">
                
                <div className="flex space-x-2">
                    {["daily", "weekly", "monthly"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p as any)}
                            className={`px-2 py-1 rounded-lg border ${period === p ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))

                    }

                </div>
            </div>
            {/* Chart */}
            {loading ? (
                <p>Loading trend chart...</p>
            ) : data.length === 0 ? (
                <p className="text-gray-500">No trend data available.</p>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
