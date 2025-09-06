import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  color?: string;
}

export default function Card({ title, value, color = "text-blue-600" }: CardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
