import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Utility to format timestamp as readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

function LabGraph({ points, xLabel = "X", yLabel = "Y" }) {
  // Convert x values (dates) to timestamps for proportional spacing
  const processedPoints = points.map((p) => ({
    x: new Date(p.x).getTime(),
    y: p.y
  }));

  return (
    <div className="w-1/4 max-w-2xl h-72 bg-white p-4 rounded shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedPoints.sort((a, b) => a.x - b.x)}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatDate}
            label={{ value: xLabel, position: "bottom", offset: 0 }}
          />
          <YAxis
            type="number"
            domain={[0, "auto"]}
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
          />
          <Tooltip labelFormatter={(val) => formatDate(val)} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LabGraph;
