import  { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Report {
    id: number;
    user: number;
    period_type: string,
    month: number;
    year: number;
    total_expenses: string;
    created_at: string;
}

export default function GenerateReports() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);
    const [generating, setGenerating] = useState(false);

    //From state
    const [periodType, setPeriodType] = useState<"Monthly" | "Yearly">("Monthly");
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    //Generate current year +-5 years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ]

    //Fetch Reports
    const fetchReports = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/reports/report_list/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to fetch reports");
            const data: Report[] = await res.json();
            setReports(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching reports");
        } finally {
            setLoading(false);
        }
    };

    //Generate Report with the selected period/year/month
    const generateReports = async () => {
        if (!token) {
            alert("You must be logged in");
            return;
        }

        setGenerating(true);
        try {
            const payload: any = {
                period_type: periodType,
                year: year,
            }

            //Only include month if Monthly
            if (periodType === "Monthly") {
                payload.month = month;
            }

            const res = await fetch("http://127.0.0.1:8000/reports/generate/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Failed to generate report");
            }

            const data = await res.json();
            alert(`Report generation started. Task ID: ${data.task_id}`);
            fetchReports(); // refresh list
        } catch (err: any) {
            console.error(err);
            alert("Error generating report");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [token]);

    return (
        <div className="p-8 bg-white rounded-2xl shadow max-w-5xl mx-auto mt-10 w-full">
            {/* <div className="flex justify-between items-center mb-4"> */}
            <h2 className="text-lg font-semibold mb-6">Expense Reports</h2>

            {/* Form controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-6 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
                    <select
                        value={periodType}
                        onChange={(e) => setPeriodType(e.target.value as "Monthly" | "Yearly")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={periodType === "Yearly" ? "opacity-50" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month {periodType === "Yearly" && "(Not applicable)"}
                    </label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        disabled={periodType === "Yearly"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    >
                        {months.map((m) => (
                            <option key={m.label} value={m.label}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Generate Button */}

            <div className="mb-8 text-center">
                <button
                    onClick={generateReports}
                    disabled={generating}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md"
                >
                    {generating ? "Generating..." : "Generate Reports"}
                </button>
            </div>

            {/* </div> */}
            {loading ? (
                <p className="text-center text-gray-500">Loading reports...</p>
            ) : reports.length === 0 ? (
                <p className="text-center text-gray-500">No reports gnerated yet.</p>
            ) : (
                <table className="w-full text-left border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Period</th>
                            <th className="p-2 border">Month</th>
                            <th className="p-2 border">Year</th>
                            <th className="p-2 border">Total Expenses</th>
                            <th className="p-2 border">Generated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{report.period_type}</td>
                                <td className="p-2 border">{report.month ? months[report.month - 1].label : "—"}</td>
                                <td className="p-2 border">{report.year}</td>
                                <td className="p-2 font-semibold border">
                                    {Number(report.total_expenses).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "Kes",
                                    })}
                                </td>
                                <td className="p-2 border text-sm text-gray-600">
                                    {new Date(report.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
