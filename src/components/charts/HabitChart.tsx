"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

export const HabitChart: React.FC = () => {
  // Mock habit weekly completion trends
  const mockHabitTrend = [
    { day: "Mon", completed: 1 },
    { day: "Tue", completed: 2 },
    { day: "Wed", completed: 2 },
    { day: "Thu", completed: 3 },
    { day: "Fri", completed: 3 },
    { day: "Sat", completed: 4 },
    { day: "Sun", completed: 4 }
  ];

  return (
    <Card className="border border-white/5 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-100 font-semibold">Habit Completion Curve</CardTitle>
        <CardDescription>Track daily completed mental wellness routines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockHabitTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
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
                domain={[0, 5]}
                allowDecimals={false}
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
              <Line 
                type="monotone" 
                dataKey="completed" 
                name="Habits Completed" 
                stroke="#22C55E" 
                strokeWidth={2.5}
                dot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default HabitChart;
