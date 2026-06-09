"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Compass, HelpCircle, Send, Cpu, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select } from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { motion } from "framer-motion";

interface ContactFormData {
  fullName: string;
  email: string;
  category: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact submission:", data);
    setSuccess(true);
    reset();
  };

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 font-sans text-slate-900 relative">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-violet-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">Contact Center</h1>
          <p className="text-4xl md:text-5xl font-black mt-3 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">Connect with our Neural Lab</p>
          <p className="text-slate-500 mt-4 text-xs sm:text-sm md:text-base leading-relaxed">
            Have questions about biometric synchronizations, HIPAA compliance, or corporate licenses? Send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
          {/* Quick info panel */}
          <div className="space-y-4">
            <Card className="border border-slate-100 bg-slate-50/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-9 h-9 rounded-lg bg-violet-600/5 border border-violet-500/10 flex items-center justify-center text-violet-600">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Email Support</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">support@brainos.ai</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 bg-slate-50/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-9 h-9 rounded-lg bg-cyan-600/5 border border-cyan-500/10 flex items-center justify-center text-cyan-600">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Neural Lab HQ</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    100 Innovation Way, Suite 400<br />San Francisco, CA 94107
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 bg-slate-50/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-9 h-9 rounded-lg bg-emerald-600/5 border border-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">HIPAA & Security</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    All biosensor metrics remain end-to-end encrypted and locally sandboxed under HIPAA standards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form panel */}
          <div className="md:col-span-2">
            <Card className="border border-slate-100 bg-slate-50/50 p-6 md:p-8 relative overflow-hidden">
              <CardContent className="p-0">
                {success ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto text-xl">✓</div>
                    <h3 className="text-lg font-bold text-slate-800">Transmission Received</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                      Your query has been logged. Our cognitive support advisor will review and respond within 24 operational hours.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Full Name</label>
                        <Input
                          placeholder="Alex Rivera"
                          required
                          className="bg-white border-slate-200 text-slate-800 rounded-lg focus:border-violet-500/50"
                          {...register("fullName", { required: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Email Address</label>
                        <Input
                          type="email"
                          placeholder="alex@wellness.com"
                          required
                          className="bg-white border-slate-200 text-slate-800 rounded-lg focus:border-violet-500/50"
                          {...register("email", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-550">Inquiry Category</label>
                      <Select {...register("category")} className="bg-white border-slate-200 text-slate-800 rounded-lg focus:border-violet-500/50">
                        <option value="general">General Inquiry</option>
                        <option value="wearables">Smartwatch Synchronization</option>
                        <option value="hipaa">Data Protection & Privacy</option>
                        <option value="enterprise">Corporate & Team Licensing</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-500">Message Body</label>
                      <Textarea
                        rows={5}
                        placeholder="Write your mental health optimization questions here..."
                        required
                        className="bg-white border-slate-200 text-slate-800 rounded-lg focus:border-violet-500/50"
                        {...register("message", { required: true })}
                      />
                    </div>

                    <Button type="submit" variant="glow" className="w-full flex items-center justify-center gap-2 cursor-pointer py-6 rounded-xl font-bold">
                      Transmit Details <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
