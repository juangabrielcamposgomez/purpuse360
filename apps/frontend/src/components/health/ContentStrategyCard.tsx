"use client";

import { Share2, Target, Calendar } from "lucide-react";

interface ContentStrategyProps {
  data: {
    topic: string;
    platforms: string[];
    keyPoints: string[];
    scheduledDate: string;
    cta: string;
  };
  compact?: boolean;
}

export function ContentStrategyCard({ data, compact }: ContentStrategyProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-white/10 bg-indigo-950/40 backdrop-blur-xl shadow-2xl ${
        compact ? "p-4" : "p-6"
      } text-white`}
      aria-label="Content strategy"
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Share2 className="size-5 text-indigo-300" />
          </div>
          <span className="font-semibold tracking-tight text-lg">Content Strategy</span>
        </div>
      </header>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{data.topic}</h3>
        <div className="flex gap-2 flex-wrap">
          {data.platforms.map(p => (
            <span key={p} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider text-indigo-200">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2 text-white/50">
            <Target className="size-3" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Key Talking Points</span>
          </div>
          <ul className="space-y-1.5">
            {data.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-xs text-white/80 leading-relaxed">
                <span className="text-indigo-400 font-bold">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-white/40" />
            <span className="text-xs text-white/60">{data.scheduledDate}</span>
          </div>
          <button className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full text-xs font-bold transition-colors">
            Generate Draft
          </button>
        </div>
      </div>
    </section>
  );
}
