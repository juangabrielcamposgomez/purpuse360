"use client";

import { useMemo } from "react";
import { Moon, MoonStar, Clock, Activity } from "lucide-react";
const Zzz = MoonStar;

interface SleepMetricsProps {
  data: {
    duration: number; // in hours
    deepSleep: number; // percentage
    remSleep: number; // percentage
    efficiency: number; // percentage
    score: number; // 0-100
  };
  compact?: boolean;
}

export function SleepMetricsDashboard({ data, compact }: SleepMetricsProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl ${
        compact ? "p-4" : "p-6"
      } text-white`}
      aria-label="Sleep metrics"
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Moon className="size-5 text-indigo-400" />
          </div>
          <span className="font-semibold tracking-tight text-lg">Sleep Performance</span>
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
          Score: {data.score}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={<Clock className="size-4 text-blue-400" />}
          label="Duration"
          value={`${data.duration}h`}
          subtext="Total Sleep"
        />
        <MetricCard
          icon={<Zzz className="size-4 text-purple-400" />}
          label="Deep Sleep"
          value={`${data.deepSleep}%`}
          subtext="Restorative"
        />
        <MetricCard
          icon={<Activity className="size-4 text-pink-400" />}
          label="REM"
          value={`${data.remSleep}%`}
          subtext="Dream State"
        />
        <MetricCard
          icon={<Moon className="size-4 text-cyan-400" />}
          label="Efficiency"
          value={`${data.efficiency}%`}
          subtext="Sleep/Bed Ratio"
        />
      </div>

      {!compact && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
            <Activity className="size-3" /> Insights
          </h4>
          <p className="text-xs text-white/80 leading-relaxed">
            Your deep sleep is 15% above your average. This indicates excellent physical recovery.
            Consider maintaining your current bedtime routine.
          </p>
        </div>
      )}
    </section>
  );
}

function MetricCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) {
  return (
    <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/40">{subtext}</div>
    </div>
  );
}
