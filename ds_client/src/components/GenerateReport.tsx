import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Report {
  id: number;
  user: number;
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
      if (!res.ok) throw new Error("Failed to fetch reports.");
      const data: Report[] = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      alert("Error in fetching reports");
    } finally {
      setLoading(false);
    }
  };
  //Trigger reports generation
  const generateReports = async () => {
    if (!token) return;
    setGenerating(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/reports/generate/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to generate reports");
      const data = await res.json();
      alert(`Report generation started. Task ID: ${data.task_id}`);
      fetchReports(); // refresh after triggering

      // ✅ Poll for report update (every 2s, up to 5 times)
      // let attempts = 0;
      // const interval = setInterval(async () => {
      //   attempts++;
      //   await fetchReports();
      //   if (attempts >= 5) clearInterval(interval);
      // }, 2000);
    } catch (err) {
      console.error(err);
      alert("Error in generating reports");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);
  return (
    <div className="p-6 bg-white rounded-2xl shadow max-w-4xl mx-auto mt-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expense Reports</h2>
        <button
          onClick={generateReports}
          disabled={generating}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {generating ? "Generating..." : "Generate Reports"}
        </button>
      </div>
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">No reports available.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Total Expenses</th>
              <th className="p-2 border">Generated At</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="p-2 border">{report.month}</td>
                <td className="p-2 border">{report.year}</td>
                <td className="p-2 font-semibold border">
                  {Number(report.total_expenses).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-2 border">
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
