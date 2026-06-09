"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Moon, Sun,
  Globe, Download, Trash2, LogOut, ChevronRight, Check, Smartphone
} from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
        checked ? "bg-violet-600" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const user = useBrainStore((s) => s.user);

  const [fullName, setFullName] = useState(user?.fullName ?? "Alex Turner");
  const [email, setEmail] = useState(user?.email ?? "alex@brainos.ai");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [notifications, setNotifications] = useState({
    dailyCheckIn: true,
    burnoutAlerts: true,
    weeklyReport: true,
    coachMessages: false,
    moodReminders: true,
    focusTimer: true,
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    crashReports: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-600/15 border border-slate-500/20 flex items-center justify-center text-slate-400">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-xs text-slate-400 font-mono">Configure your BrainOS experience</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile"><User className="w-3.5 h-3.5 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-3.5 h-3.5 mr-1.5" /> Appearance</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="w-3.5 h-3.5 mr-1.5" /> Privacy</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{fullName}</p>
                  <p className="text-xs text-slate-500 font-mono">{email}</p>
                  <button className="text-[10px] text-violet-400 font-mono mt-1 underline underline-offset-2 cursor-pointer">Change avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Full Name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Email Address</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSave} variant="default" className="cursor-pointer">
                  {saved ? <><Check className="w-4 h-4 mr-1" /> Saved</> : "Save Changes"}
                </Button>
                {saved && <span className="text-xs text-emerald-400 font-mono animate-pulse">✓ Profile updated</span>}
              </div>
            </CardContent>
          </Card>

          {/* Connected Devices */}
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-sm flex items-center gap-2"><Smartphone className="w-4 h-4 text-cyan-400" /> Connected Devices</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Apple Watch Series 9", status: "Connected", synced: "2 min ago" },
                { name: "Oura Ring Gen 4", status: "Connected", synced: "15 min ago" },
                { name: "Whoop 5.0", status: "Disconnected", synced: "Never" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${d.status === "Connected" ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{d.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Last synced: {d.synced}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {Object.entries(notifications).map(([key, val]) => {
                const labels: Record<string, [string, string]> = {
                  dailyCheckIn: ["Daily Check-In Reminder", "Get prompted for your morning neural calibration"],
                  burnoutAlerts: ["Burnout Warning Alerts", "Receive alerts when burnout risk exceeds threshold"],
                  weeklyReport: ["Weekly Wellness Report", "Detailed AI summary of your weekly metrics"],
                  coachMessages: ["AI Coach Messages", "Proactive coaching nudges throughout the day"],
                  moodReminders: ["Mood Log Reminders", "Periodic reminders to log your emotional state"],
                  focusTimer: ["Focus Timer Notifications", "Get notified when focus sessions complete"],
                };
                const [label, desc] = labels[key] ?? [key, ""];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-slate-200 font-semibold">{label}</p>
                      <p className="text-[11px] text-slate-500 font-sans">{desc}</p>
                    </div>
                    <Toggle checked={val} onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-base">Theme</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5" />, desc: "Default deep space" },
                  { value: "light", label: "Light", icon: <Sun className="w-5 h-5" />, desc: "Clean & bright" },
                  { value: "system", label: "System", icon: <Globe className="w-5 h-5" />, desc: "Match OS" },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      theme === t.value
                        ? "border-violet-500/50 bg-violet-600/10"
                        : "border-white/5 hover:border-white/15 bg-white/[0.02]"
                    }`}
                  >
                    <span className={theme === t.value ? "text-violet-400" : "text-slate-500"}>{t.icon}</span>
                    <span className="text-xs font-semibold text-slate-200">{t.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono text-center">{t.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-base">Data & Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {Object.entries(privacy).map(([key, val]) => {
                const labels: Record<string, [string, string]> = {
                  dataSharing: ["Share Usage Data", "Help improve BrainOS by sharing anonymized data"],
                  analytics: ["Analytics Tracking", "Internal product analytics for your experience"],
                  crashReports: ["Crash Reports", "Automatically send error reports for debugging"],
                };
                const [label, desc] = labels[key] ?? [key, ""];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-slate-200 font-semibold">{label}</p>
                      <p className="text-[11px] text-slate-500 font-sans">{desc}</p>
                    </div>
                    <Toggle checked={val} onChange={(v) => setPrivacy((prev) => ({ ...prev, [key]: v }))} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="border border-rose-500/15">
            <CardHeader><CardTitle className="text-rose-400 text-sm">Danger Zone</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Export All Data</p>
                    <p className="text-[10px] text-slate-500 font-mono">Download a JSON archive of all metrics</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs">Export</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-rose-500/15 bg-rose-500/5">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <div>
                    <p className="text-xs font-semibold text-rose-300">Delete Account</p>
                    <p className="text-[10px] text-rose-400/60 font-mono">Permanently erase all data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10">Delete</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Sign Out</p>
                    <p className="text-[10px] text-slate-500 font-mono">End current session</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs">Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
