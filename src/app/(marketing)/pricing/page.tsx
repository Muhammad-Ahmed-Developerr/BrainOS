"use client";

import React, { useState } from "react";
import { Check, ShieldAlert, Cpu, Heart, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Core Plan",
      description: "Baseline mental tracking features for wellness enthusiasts.",
      price: { monthly: 0, annual: 0 },
      features: [
        "Manual Mood Logs & Focus Score tracking",
        "Weekly Stress Score estimations",
        "Standard focus pomodoro timer",
        "Static Recharts visual trends (7-day history)",
        "Mobile responsive dashboard access"
      ],
      unlockedScores: [
        "Focus Score",
        "Mood Score",
        "Stress Score"
      ],
      cta: "Deploy Core OS",
      highlighted: false,
      href: "/signup"
    },
    {
      name: "Pro Plan",
      description: "Continuous smartwatch sync and predictive AI forecasts.",
      price: { monthly: 19, annual: 12 },
      features: [
        "All Core capabilities",
        "Apple Watch, Garmin, Oura smartwatch sync",
        "AI Therapist Chatbot Coach integration",
        "AI Sentiment Analysis & Cognitive distortion tags",
        "Preemptive burnout risk alerts & peak forecasts",
        "Unlimited historical metric trends cache"
      ],
      unlockedScores: [
        "Focus Score",
        "Mood Score",
        "Stress Score",
        "Brain Score",
        "Burnout Score",
        "Sleep Score",
        "Energy Score",
        "Productivity Score"
      ],
      cta: "Initialize Pro OS",
      highlighted: true,
      href: "/signup"
    },
    {
      name: "Enterprise Plan",
      description: "Custom dashboards, wellness workshops, and team telemetry.",
      price: { monthly: 99, annual: 79 },
      features: [
        "All Pro capabilities",
        "Team mental wellness aggregation dashboards",
        "Corporate HIPAA-compliant telemetry options",
        "Dedicated mental performance advisor support",
        "Priority feature access & custom client integrations"
      ],
      unlockedScores: [
        "All 10 Scores Unlocked",
        "Social Wellness Score",
        "Mental Wellness Score"
      ],
      cta: "Contact Enterprise Team",
      highlighted: false,
      href: "/contact"
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 font-sans text-slate-900 relative">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Pricing Guide</h1>
          <p className="text-4xl md:text-5xl font-black mt-3 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">Predictive Wellness Plans</p>
          <p className="text-slate-500 mt-4 text-xs sm:text-sm md:text-base leading-relaxed">
            Select the scale of neurological optimization that suits your routine. Save up to 35% with our annual billing options.
          </p>

          {/* Switcher toggle */}
          <div className="mt-8 inline-flex items-center rounded-full bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                billingCycle === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Annual Billing (-35%)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((p, idx) => (
            <Card
              key={idx}
              className={`relative flex flex-col justify-between border transition-all duration-300 ${
                p.highlighted 
                  ? "border-violet-500/35 bg-white shadow-xl shadow-violet-500/5 scale-105" 
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
              }`}
            >
              {p.highlighted && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 px-3 py-1 text-[10px] font-mono font-bold uppercase text-white shadow-lg shadow-violet-500/10">
                  Most Popular
                </div>
              )}

              <div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">{p.name}</CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-1 leading-relaxed">{p.description}</CardDescription>
                </CardHeader>

                <CardContent className="py-4 border-b border-slate-100">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-4xl font-black tracking-tight text-slate-900">
                      ${billingCycle === "monthly" ? p.price.monthly : p.price.annual}
                    </span>
                    <span className="text-slate-400 text-xs font-mono uppercase">/ month</span>
                  </div>
                  {billingCycle === "annual" && p.price.annual > 0 && (
                    <span className="text-[10px] text-cyan-600 font-mono mt-1 block">Billed annually</span>
                  )}

                  {/* Core checklist */}
                  <div className="mt-6 space-y-3">
                    {p.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
                        <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Score locks matrix info */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block mb-2.5">Telemetry Unlocked</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.unlockedScores.map((score, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-white border border-slate-100 shadow-sm text-[9px] font-mono text-cyan-600 rounded-md">
                          {score}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-6">
                <Link href={p.href} className="w-full">
                  <Button
                    variant={p.highlighted ? "glow" : "outline"}
                    className="w-full text-xs font-mono cursor-pointer"
                  >
                    {p.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
