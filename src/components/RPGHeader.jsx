import React from 'react';
import { Shield, Sparkles, Coins, Trees, Gem, Flame, Sword } from 'lucide-react';

export default function RPGHeader({ level = 1, xp = 45, maxXp = 100, streak = 3, resources = { gold: 120, wood: 45, stone: 20 } }) {
  const xpPercent = Math.min(100, Math.round((xp / maxXp) * 100));

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Realm Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-xl">
              ⚔️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Silkscreen'] text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                FOCUS QUEST
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                RPG Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">Level up your focus & conquer your goals</p>
          </div>
        </div>

        {/* Hero Level & XP Bar */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          
          {/* Hero Profile Mini */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-amber-500/30 rounded-xl px-3 py-1.5 shadow-inner">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-amber-400/40 flex items-center justify-center text-lg shadow">
                🛡️
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] font-mono px-1 rounded shadow">
                Lv.{level}
              </span>
            </div>
            <div className="w-32 md:w-40">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-amber-300 font-semibold font-mono text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Apprentice Knight
                </span>
                <span className="text-slate-400 text-[10px] font-mono">{xp}/{maxXp} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-sm shadow-amber-400/50"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Resources & Daily Streak */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{resources.gold}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>{resources.wood}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-300">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span>{resources.stone}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{streak}d</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
