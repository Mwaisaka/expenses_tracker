// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";

// interface Report {
//   id: number;
//   user: number;
//   month: number;
//   year: number;
//   total_expenses: string;
//   created_at: string;
// }

// export default function Reports() {
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [reports, setReports] = useState<Report[]>([]);
//   const [generating, setGenerating] = useState(false);

//   //Fetch Reports
//   const fetchReports = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/reports/report_list/", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch reports.");
//       const data: Report[] = await res.json();
//       setReports(data);
//     } catch (err) {
//       console.error(err);
//       alert("Error in fetching reports");
//     } finally {
//       setLoading(false);
//     }
//   };
//   //Trigger reports generation
//   const generateReports = async () => {
//     if (!token) return;
//     setGenerating(true);
//     try {
//       const res = await fetch("http://127.0.0.1:8000/reports/generate/", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) throw new Error("Failed to generate reports");
//       const data = await res.json();
//       alert(`Report generation started. Task ID: ${data.task_id}`);
//       fetchReports(); // refresh after triggering

//       // ✅ Poll for report update (every 2s, up to 5 times)
//       // let attempts = 0;
//       // const interval = setInterval(async () => {
//       //   attempts++;
//       //   await fetchReports();
//       //   if (attempts >= 5) clearInterval(interval);
//       // }, 2000);
//     } catch (err) {
//       console.error(err);
//       alert("Error in generating reports");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [token]);
//   return (
//     <div className="p-6 bg-white rounded-2xl shadow max-w-4xl mx-auto mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">Expense Reports</h2>
//         <button
//           onClick={generateReports}
//           disabled={generating}
//           className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {generating ? "Generating..." : "Generate Reports"}
//         </button>
//       </div>
//       {loading ? (
//         <p>Loading reports...</p>
//       ) : reports.length === 0 ? (
//         <p className="text-gray-500">No reports available.</p>
//       ) : (
//         <table className="w-full text-left border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">Month</th>
//               <th className="p-2 border">Year</th>
//               <th className="p-2 border">Total Expenses</th>
//               <th className="p-2 border">Generated At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.map((report) => (
//               <tr key={report.id} className="border-t">
//                 <td className="p-2 border">{report.month}</td>
//                 <td className="p-2 border">{report.year}</td>
//                 <td className="p-2 text-red-500 border">
//                   {Number(report.total_expenses).toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </td>
//                 <td className="p-2 border">
//                   {new Date(report.created_at).toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import StatementGenerator from "./Statement"; // the component we built earlier
import { useAuth } from "../context/AuthContext";

interface Report {
  id: number;
  user: number;
  month: number;
  year: number;
  total_expenses: string;
  created_at: string;
  food_expenses: string;
  transport_expenses: string;
  entertainment_expenses: string;
  shopping_expenses: string;
  bills_expenses: string;
  others_expenses: string;
}

export default function ReportsDashboard() {
  const { token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000/reports/report_list/";

  //Fetch Reports
  const fetchReports = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/reports/report_list/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      alert("Error loading reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [token]);

  // Prepare chart data from latest report
  const latestReport = reports[0];
  const pieData = latestReport
    ? [
      { name: "Food", value: Number(latestReport.food_expenses) },
      { name: "Transport", value: Number(latestReport.transport_expenses) },
      { name: "Entertainment", value: Number(latestReport.entertainment_expenses) },
      { name: "Shopping", value: Number(latestReport.shopping_expenses) },
      { name: "Bills", value: Number(latestReport.bills_expenses) },
      { name: "Others", value: Number(latestReport.others_expenses) },
    ]
    : [];

  const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#A020F0", "#8884D8"];

  return (
    <div className="p-6 space-y-10">
      {/*Charts section*/}
      <div className="grid md:grid-cols-2 gap-6">
        {/*Pie Chart*/}
        <div className="bg-wite shadow rounded-xl p-4">
          <h2 className="font-bold mb-4">Expenses by Category (Latest Report)</h2>
          {latestReport ? (
            <PieChart width={400} height={300}>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
        {/*Bar Chart*/}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font=-bold mb-">Monthly Expenses Trend</h2>
          {reports.length > 0 ? (
            <BarChart width={400} height={300} data={reports.slice(0, 6).reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_expenses" fill="#0088FE" />
            </BarChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
      {/*Reports Table section*/}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="font-bold mb-4">All Reports</h2>
        {loading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-500">No Reports found. </p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">Month</th>
                <th className="border p-1">Year</th>
                <th className="border p-1">Total (Kes)</th>
                <th className="border p-1">Generated At</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="border p-1 text-center">{r.month}</td>
                  <td className="border p-1 text-center">{r.year}</td>
                  <td className="border p-1 text-blue-600 font-semibold text-center">{Number(r.total_expenses).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}</td>
                  <td className="border p-1 text-center">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Statement Generator */}
      <div className="bg-white shadow rounded-xl p-4">
        <StatementGenerator />
      </div>
    </div>
  )
}