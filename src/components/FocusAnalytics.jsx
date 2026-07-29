import React from 'react';
import { BarChart3, Clock, Zap, ShieldAlert, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function FocusAnalytics({ sessionsCompleted, distractionCount, wallHp, totalFocusMinutes }) {
  
  const focusPurityScore = sessionsCompleted > 0
    ? Math.max(50, Math.min(100, Math.round(100 - (distractionCount / (sessionsCompleted * 2)) * 30)))
    : 100;

  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              FOCUS ANALYTICS & PURITY
            </h3>
            <p className="text-xs text-slate-400">Productivity statistics & deep work metrics</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          {focusPurityScore}% Focus Purity
        </span>
      </div>

      {/* Stats Key Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
        
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-semibold">Total Focus</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-100">{focusHours} hrs</div>
          <div className="text-[10px] text-slate-500">{totalFocusMinutes} mins total</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-semibold">Sprints</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-100">{sessionsCompleted}</div>
          <div className="text-[10px] text-slate-500">Completed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-semibold">Monsters Slain</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-100">{distractionCount}</div>
          <div className="text-[10px] text-slate-500">Distractions logged</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="text-[11px] font-semibold">Wall HP</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-100">{wallHp}/100</div>
          <div className="text-[10px] text-slate-500">Citadel Defense</div>
        </div>

      </div>

      {/* Visual Productivity Streak Heatmap */}
      <div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
          🗓️ 7-Day Focus Sprint Heatmap
        </span>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const intensity = (i + sessionsCompleted) % 4;
            const bgClass =
              intensity === 3 ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' :
              intensity === 2 ? 'bg-amber-600/60 text-amber-100' :
              intensity === 1 ? 'bg-amber-800/40 text-amber-300' :
              'bg-slate-950 border border-slate-800 text-slate-600';

            return (
              <div
                key={day}
                className={`p-3 rounded-2xl text-center text-xs font-mono flex flex-col items-center justify-center transition ${bgClass}`}
              >
                <div className="text-[10px] opacity-75">{day}</div>
                <div className="text-sm mt-1">{intensity > 0 ? `${intensity * 2}🍅` : '—'}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
