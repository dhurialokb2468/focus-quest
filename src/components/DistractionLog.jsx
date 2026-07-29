import React from 'react';
import { Scroll, ShieldAlert, Sword, Hammer, Sparkles, CheckCircle2 } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function DistractionLog({ distractionLog, wallHp, maxWallHp, onRepairWall, resources }) {
  
  const canRepair = wallHp < maxWallHp && resources.stone >= 15;

  const handleRepair = () => {
    if (canRepair) {
      sfx.playBuild();
      onRepairWall(15); // costs 15 stone, restores 25 HP
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Log Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-rose-200">
              QUEST DISTRACTION LOG
            </h3>
            <p className="text-xs text-slate-400">Defeated monsters & Citadel wall health</p>
          </div>
        </div>

        {/* Citadel Wall HP Status */}
        <div className="flex items-center gap-2">
          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400">Citadel Wall HP</div>
            <div className={`text-xs font-bold ${wallHp > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {wallHp} / {maxWallHp} HP
            </div>
          </div>
          <div className="w-16 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${wallHp > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${(wallHp / maxWallHp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Repair Wall Option */}
      {wallHp < maxWallHp && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛠️</span>
            <div>
              <div className="text-xs font-bold text-amber-200 font-mono">Citadel Wall Damaged</div>
              <div className="text-[11px] text-slate-300">Spend 15 Stone to repair +25 Wall HP</div>
            </div>
          </div>
          <button
            onClick={handleRepair}
            disabled={!canRepair}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              canRepair
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-60 cursor-not-allowed'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" /> Repair Wall
          </button>
        </div>
      )}

      {/* Distraction History Log */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {distractionLog.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            <Scroll className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No distraction monsters logged yet. Pure focus in the kingdom!
          </div>
        ) : (
          distractionLog.map((log, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {log.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-rose-300">{log.monster}</span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-sans mt-0.5">
                    "{log.distraction}"
                  </div>
                  <div className="text-[11px] text-emerald-400 font-sans mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" /> Plan: {log.plan}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                Slain +10 Gold
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
