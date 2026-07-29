import React from 'react';
import { Shield, Castle, Sword, Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function KingdomTeaser({ level, xp, resources }) {
  const upcomingBuildings = [
    { name: 'Lumber Mill', icon: '🪵', bonus: '+15% Wood per Session', cost: '50 Wood', unlocked: true },
    { name: 'Knight Barracks', icon: '⚔️', bonus: '+10% XP per Sprint', cost: '100 Gold', unlocked: false },
    { name: 'Wizard Tower', icon: '🧙‍♂️', bonus: 'Auto-defends Monster Raids', cost: '200 Gold, 50 Stone', unlocked: false },
    { name: 'Grand Castle', icon: '🏰', bonus: 'Unlocks 2D Canvas Kingdom', cost: '500 Gold', unlocked: false },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Castle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              KINGDOM REALM PREVIEW
            </h3>
            <p className="text-xs text-slate-400">Phase 2 RPG Building & Monster Defenses</p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          Ready for Phase 2
        </span>
      </div>

      {/* Intro Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/30 mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="text-xs font-bold text-amber-200 font-mono">Frontier Outpost (Level {level})</div>
            <div className="text-[11px] text-slate-300">Complete Pomodoro sessions to accumulate Wood, Stone & Gold!</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-400 font-bold">
          <span>Earn & Build</span> <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Buildings Unlocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {upcomingBuildings.map((building, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
              building.unlocked
                ? 'bg-slate-950/80 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-950/40 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                {building.icon}
              </span>
              <div>
                <div className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                  {building.name}
                  {!building.unlocked && <Lock className="w-3 h-3 text-slate-500" />}
                </div>
                <div className="text-[11px] text-amber-400 font-sans">{building.bonus}</div>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-400">
              {building.unlocked ? (
                <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  Unlocked
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {building.cost}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
