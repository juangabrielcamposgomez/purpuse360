"use client";

import { Target, TrendingUp, Zap } from "lucide-react";

interface StrategyProps {
  roadmap: Array<{
    phase: string;
    title: string;
    tasks: string[];
    status: "Upcoming" | "Active" | "Completed";
  }>;
}

export function StrategicPositioning({ roadmap }: StrategyProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 text-white shadow-2xl">
      <header className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Target className="size-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">Growth Roadmap</h3>
          <p className="text-xs text-white/40">Personal brand positioning strategy</p>
        </div>
      </header>

      <div className="space-y-6">
        {roadmap.map((item, i) => (
          <div key={i} className="relative pl-8 border-l border-white/10 last:border-l-0 pb-6 last:pb-0">
            <div className={`absolute left-[-5px] top-0 size-2.5 rounded-full ${
              item.status === "Active" ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" : 
              item.status === "Completed" ? "bg-emerald-400" : "bg-white/20"
            }`} />
            
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.phase}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                item.status === "Active" ? "bg-indigo-500/20 text-indigo-300" : 
                item.status === "Completed" ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/40"
              }`}>{item.status}</span>
            </div>
            
            <h4 className="font-bold text-sm mb-3">{item.title}</h4>
            
            <ul className="space-y-2">
              {item.tasks.map((task, j) => (
                <li key={j} className="flex items-center gap-2 text-xs text-white/60">
                  <div className="size-1 bg-white/20 rounded-full" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Zap className="size-4 text-indigo-400" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Next Action</div>
          <div className="text-xs text-white/80 font-medium">Record 3 educational reels on sleep hygiene</div>
        </div>
        <button className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors">
          <TrendingUp className="size-4 text-white/40" />
        </button>
      </div>
    </section>
  );
}
