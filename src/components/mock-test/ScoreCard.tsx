import React from "react";

export default function ScoreCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: "green" | "red" | "gray" | "blue" | "neutral";
}) {
  const tones = {
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    neutral: "bg-white text-navy border-gray-100",
  };

  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider opacity-70 mt-1">{label}</div>
    </div>
  );
}
