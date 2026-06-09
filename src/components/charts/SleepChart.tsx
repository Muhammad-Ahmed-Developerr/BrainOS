"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const SleepChart: React.FC = () => {
  const trends = useBrainStore((state) => state.metricTrends);

  // Map arbitrary sleep subcategories to mock
  const mappedData = trends.map(t => ({
    date: t.date,
    deepSleep: Math.round(t.sleepScore * 0.25),
    remSleep: Math.round(t.sleepScore * 0.35),
    lightSleep: Math.round(t.sleepScore * 0.40)
  }));

  return (
    <Card className="border border-white/5 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold">Sleep Architecture</CardTitle>
        <CardDescription>Stacked review of sleep phases (Deep, REM, Light) in index points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mappedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Bar dataKey="deepSleep" name="Deep Sleep" stackId="a" fill="#1E1B4B" />
              <Bar dataKey="remSleep" name="REM Sleep" stackId="a" fill="#4338CA" />
              <Bar dataKey="lightSleep" name="Light Sleep" stackId="a" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default SleepChart;
