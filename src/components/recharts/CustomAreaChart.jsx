import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import moment from 'moment';

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
    <div style={{ width: "100%", height: "210px",fontSize:"10px"}}>
      {/* ResponsiveContainer to make it responsive */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          {/* CartesianGrid for better visuals */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* X-Axis with date formatting */}
          <XAxis
            dataKey="date"
            tickFormatter={(str) => moment(str).format("MMM DD, YYYY")}
            angle={-30}
            textAnchor="end"
            height={60}
          >
            <Label value="" position="bottom" />
          </XAxis>
          
          {/* Y-Axis */}
          <YAxis>
            <Label value="Rate" position="left" angle={-90} />
          </YAxis>

          {/* Tooltip to show data on hover */}
          <Tooltip formatter={(value) => `${value} units`} />

          {/* Area chart for rate1 */}
          <Area
            type="monotone"
            dataKey="rate1"
            stroke="#82ca9d"
            fill="lightgreen"
            fillOpacity={0.5}
            dot={{ r: 5 }}
          />
          
          {/* Area chart for rate2 */}
          <Area
            type="monotone"
            dataKey="rate2"
            stroke="#8884d8"
            fill="blue"
            fillOpacity={0.3}
            dot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
