import React, { useState } from "react";

export default function Statement() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [format, setFormat] = useState("json");
    const [jsonData, setJsonData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://127.0.0.1:8000"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setJsonData(null);

        try {
            const response = await fetch(`{API_URL/statement}`, {
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
                setLoading(data);
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
    return (<div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-4"><h2 className="text-2xl font-bold mb-4">Expenses Statement</h2>
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
        </form></div>)
}