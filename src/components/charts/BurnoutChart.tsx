"use client";

import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useBrainStore } from "../../store/useBrainStore";

export const BurnoutChart: React.FC = () => {
  const data = useBrainStore((state) => state.burnoutMetrics.historicalData);

  return (
    <Card className="border border-white/5 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold">Workload & Fatigue Correlation</CardTitle>
        <CardDescription>Compare worked hours vs meeting loads & cognitive fatigue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                yAxisId="hours"
                orientation="left"
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#64748B', style: { textAnchor: 'middle', fontSize: 10 } }}
              />
              <YAxis 
                yAxisId="fatigue"
                orientation="right"
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]}
                label={{ value: 'Fatigue', angle: 90, position: 'insideRight', fill: '#64748B', style: { textAnchor: 'middle', fontSize: 10 } }}
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
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar 
                yAxisId="hours"
                dataKey="workedHours" 
                name="Work Hours" 
                fill="#3B82F6" 
                opacity={0.7}
                radius={[3, 3, 0, 0]} 
                maxBarSize={30}
              />
              <Bar 
                yAxisId="hours"
                dataKey="meetingHours" 
                name="Meeting Hours" 
                fill="#EF4444" 
                opacity={0.7}
                radius={[3, 3, 0, 0]} 
                maxBarSize={30}
              />
              <Line 
                yAxisId="fatigue"
                type="monotone" 
                dataKey="cognitiveFatigue" 
                name="Cognitive Fatigue %" 
                stroke="#EC4899" 
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default BurnoutChart;
