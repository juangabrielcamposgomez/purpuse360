"use client";

import { useState } from "react";
import { ClipboardCheck, ArrowRight, Activity, Globe } from "lucide-react";

interface OnboardingProps {
  specialty: string;
  onComplete: (data: any) => void;
}

export function OnboardingForm({ specialty, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    goals: "",
    consultationType: "Online",
    onlinePresence: "Low",
    targetAudience: "",
  });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  return (
    <section className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-2xl p-8 text-white shadow-2xl max-w-lg mx-auto">
      <header className="mb-8 text-center">
        <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4">
          <Activity className="size-6 text-indigo-300" />
        </div>
        <h2 className="text-2xl font-bold">Purpose360 Onboarding</h2>
        <p className="text-sm text-white/50">Setting up your {specialty} ecosystem</p>
      </header>

      <div className="mb-8 flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? "bg-indigo-400" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="block text-sm font-medium mb-2 text-white/70 flex items-center gap-2">
              <ClipboardCheck className="size-4" /> What are your primary goals?
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32"
              placeholder="e.g., Increase patient acquisition, build personal brand..."
              value={data.goals}
              onChange={(e) => setData({ ...data, goals: e.target.value })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="block text-sm font-medium mb-4 text-white/70">Consultation Type</label>
            <div className="grid grid-cols-2 gap-4">
              {["Online", "In-Person", "Hybrid"].map((type) => (
                <button
                  key={type}
                  onClick={() => setData({ ...data, consultationType: type })}
                  className={`p-4 rounded-xl border transition-all text-sm font-bold ${
                    data.consultationType === type
                      ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="block text-sm font-medium mb-2 text-white/70 flex items-center gap-2">
              <Globe className="size-4" /> Target Audience
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Professionals with insomnia..."
              value={data.targetAudience}
              onChange={(e) => setData({ ...data, targetAudience: e.target.value })}
            />
          </div>
        )}

        <button
          onClick={next}
          className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl"
        >
          {step === 3 ? "Complete Setup" : "Continue"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
