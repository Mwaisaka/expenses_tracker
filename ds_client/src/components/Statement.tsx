import React, { useState } from "react";

export default function Statement() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [format, setFormat] = useState("select");
    const [jsonData, setJsonData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://127.0.0.1:8000"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setJsonData(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/reports/statement/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ start_date: startDate, end_date: endDate, format })
            });
            if (!response.ok) throw new Error("Failed to fetch statement");

            if (format === "json") {
                const data = await response.json();
                setJsonData(data);
            } else {
                // For PDF / Excel → trigger download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `statement_${startDate}_${endDate}.${format === "pdf" ? "pdf" : "xlsx"}`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

        } catch (err) {
            console.error(err);
            alert("Error in generating statement.")
        } finally {
            setLoading(false)
        }
    };
    return (<div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-4 w-full">
        <h2 className="text-2xl font-bold mb-4">Expenses Statement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value) }}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block font-medium">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value) }}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block font-medium">Format</label>
                <select
                    value={format}
                    onChange={(e) => { setFormat(e.target.value) }}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="select">Select</option>
                    <option value="json">JSON (Preview)</option>
                    <option value="pdf">PDF (Download)</option>
                    <option value="excel">Excel (Download)</option>

                </select>

            </div>
            <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Generating..." : "Generate Statement"}
            </button>
        </form>
        {jsonData && (
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Statement Preview</h3>
                <pre className="bg-gray-100 p-3 rounded max-h-64 overflow-y-auto">
                    {JSON.stringify(jsonData, null, 2)}
                </pre>
            </div>
        )}
    </div>)
}