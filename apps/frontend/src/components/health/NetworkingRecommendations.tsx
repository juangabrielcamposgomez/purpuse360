"use client";

import { Users, Link, MessageSquare, Award } from "lucide-react";

interface NetworkingProps {
  recommendations: Array<{
    type: "Clinic" | "Podcast" | "Community" | "Specialist";
    name: string;
    description: string;
    action: string;
    relevance: string;
  }>;
}

export function NetworkingRecommendations({ recommendations }: NetworkingProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 text-white shadow-2xl">
      <header className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Users className="size-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">Strategic Networking</h3>
          <p className="text-xs text-white/40">AI-curated growth opportunities</p>
        </div>
      </header>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge type={rec.type} />
                <h4 className="font-bold text-sm">{rec.name}</h4>
              </div>
              <button className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-white transition-colors">
                <Link className="size-3" />
              </button>
            </div>
            <p className="text-xs text-white/60 mb-3 leading-relaxed">{rec.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400 font-medium">
                <Award className="size-3" />
                {rec.relevance}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 group-hover:text-emerald-400 transition-colors">
                {rec.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Badge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Clinic: "text-blue-400 bg-blue-500/20",
    Podcast: "text-purple-400 bg-purple-500/20",
    Community: "text-orange-400 bg-orange-500/20",
    Specialist: "text-pink-400 bg-pink-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${colors[type] || "bg-white/10"}`}>
      {type}
    </span>
  );
}
