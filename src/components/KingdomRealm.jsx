import React from 'react';
import { Castle, Shield, Sparkles, TrendingUp, Trees, Coins, Gem, Zap } from 'lucide-react';
import { BUILDING_DEFINITIONS } from './BuildingShop';

export default function KingdomRealm({ level, buildings }) {

  // Calculate active multipliers based on built structure levels
  let woodMultiplier = 1;
  let stoneMultiplier = 1;
  let xpMultiplier = 1;
  let goldMultiplier = 1;

  if (buildings.lumber_mill) woodMultiplier += buildings.lumber_mill * 0.25;
  if (buildings.stone_quarry) stoneMultiplier += buildings.stone_quarry * 0.25;
  if (buildings.barracks) xpMultiplier += buildings.barracks * 0.20;
  if (buildings.wizard_tower) goldMultiplier += buildings.wizard_tower * 0.30;
  if (buildings.grand_castle) {
    const castleBoost = buildings.grand_castle * 0.50;
    woodMultiplier += castleBoost;
    stoneMultiplier += castleBoost;
    xpMultiplier += castleBoost;
    goldMultiplier += castleBoost;
  }

  const totalStructuresBuilt = Object.values(buildings).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Realm Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Castle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              YOUR REALM OVERVIEW
            </h3>
            <p className="text-xs text-slate-400">Visual layout of active structures & yields</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> {totalStructuresBuilt} Structures Built
        </span>
      </div>

      {/* Multipliers Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
        
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="font-semibold text-[11px]">Gold Boost</span>
            <Coins className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-amber-200">
            +{Math.round((goldMultiplier - 1) * 100)}%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="font-semibold text-[11px]">Wood Boost</span>
            <Trees className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-emerald-200">
            +{Math.round((woodMultiplier - 1) * 100)}%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400 mb-1">
            <span className="font-semibold text-[11px]">Stone Boost</span>
            <Gem className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-cyan-200">
            +{Math.round((stoneMultiplier - 1) * 100)}%
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <span className="font-semibold text-[11px]">XP Boost</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-purple-200">
            +{Math.round((xpMultiplier - 1) * 100)}%
          </div>
        </div>

      </div>

      {/* Visual Realm Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BUILDING_DEFINITIONS.map((def) => {
          const currentLevel = buildings[def.id] || 0;

          return (
            <div
              key={def.id}
              className={`p-4 rounded-2xl border text-center relative overflow-hidden transition-all duration-300 ${
                currentLevel > 0
                  ? 'bg-slate-950/80 border-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/40 border-slate-800 opacity-50'
              }`}
            >
              {/* Background ambient glow if built */}
              {currentLevel > 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
              )}

              <div className="text-3xl mb-2 flex justify-center">
                <span className={`transform transition-transform ${currentLevel > 0 ? 'scale-110 animate-bounce' : 'grayscale'}`}>
                  {def.icon}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-200 font-mono">
                {def.name}
              </div>

              <div className="mt-1 text-[10px] font-mono font-semibold">
                {currentLevel > 0 ? (
                  <span className="text-amber-400 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    Tier {currentLevel} Active
                  </span>
                ) : (
                  <span className="text-slate-500">Unconstructed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
