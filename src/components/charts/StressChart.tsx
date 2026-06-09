"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const StressChart: React.FC = () => {
  const trends = useBrainStore((state) => state.metricTrends);

  return (
    <Card className="border border-white/5 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold">Stress Index Breakdown</CardTitle>
        <CardDescription>Monitor peak daily cardiovascular / physical strain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#F8FAFC",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
              <Bar 
                dataKey="stressScore" 
                name="Stress Score" 
                fill="#FBBF24" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default StressChart;
