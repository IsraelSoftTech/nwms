import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "2024-03-01", rate1: 2.5, rate2: 1.8 },
  { date: "2024-03-02", rate1: 3.2, rate2: 2.0 },
  { date: "2024-03-03", rate1: 4.8, rate2: 2.5 },
  { date: "2024-03-04", rate1: 7.5, rate2: 3.1 },
  { date: "2024-03-05", rate1: 5.6, rate2: 2.8 },
  { date: "2024-03-06", rate1: 6.4, rate2: 3.2 },
  { date: "2024-03-07", rate1: 7.1, rate2: 3.8 },
];

const CustomAreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 70,  bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="rate1" stroke="#82ca9d" fill="lightgreen" fillOpacity={0.5} />
        <Area type="monotone" dataKey="rate2" stroke="#8884d8" fill="blue" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;