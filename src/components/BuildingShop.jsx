import React from 'react';
import { Castle, Hammer, ArrowUpCircle, Sparkles, Coins, Trees, Gem, CheckCircle2, Lock } from 'lucide-react';
import { sfx } from '../utils/sfx';

export const BUILDING_DEFINITIONS = [
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    icon: '🪵',
    category: 'Wood Production',
    baseCost: { gold: 50, wood: 20, stone: 0 },
    bonusType: 'wood',
    bonusText: '+25% Wood per Focus Sprint',
    description: 'Employs kingdom woodsmen to gather timber faster.',
    maxLevel: 5
  },
  {
    id: 'stone_quarry',
    name: 'Stone Quarry',
    icon: '🪨',
    category: 'Stone Mining',
    baseCost: { gold: 60, wood: 10, stone: 20 },
    bonusType: 'stone',
    bonusText: '+25% Stone per Focus Sprint',
    description: 'Excavates mountain granite for fortress walls.',
    maxLevel: 5
  },
  {
    id: 'barracks',
    name: 'Knight Barracks',
    icon: '⚔️',
    category: 'Military Training',
    baseCost: { gold: 120, wood: 40, stone: 30 },
    bonusType: 'xp',
    bonusText: '+20% XP per Focus Sprint',
    description: 'Trains brave knights to earn hero reputation.',
    maxLevel: 5
  },
  {
    id: 'wizard_tower',
    name: 'Wizard Tower',
    icon: '🧙‍♂️',
    category: 'Arcane Alchemy',
    baseCost: { gold: 200, wood: 30, stone: 60 },
    bonusType: 'gold',
    bonusText: '+30% Gold per Focus Sprint',
    description: 'Transmutes raw focus mana into pure gold coins.',
    maxLevel: 5
  },
  {
    id: 'grand_castle',
    name: 'Grand Citadel',
    icon: '🏰',
    category: 'Royal Seat',
    baseCost: { gold: 350, wood: 100, stone: 100 },
    bonusType: 'all',
    bonusText: '+50% All Yields & Citadel Defense',
    description: 'The glorious heart of your expanding empire.',
    maxLevel: 3
  }
];

export default function BuildingShop({ resources, buildings, onBuyBuilding }) {

  const getCostForNextLevel = (def, currentLevel) => {
    const multiplier = Math.pow(1.6, currentLevel);
    return {
      gold: Math.round(def.baseCost.gold * multiplier),
      wood: Math.round(def.baseCost.wood * multiplier),
      stone: Math.round(def.baseCost.stone * multiplier)
    };
  };

  const canAfford = (cost) => {
    return (
      resources.gold >= cost.gold &&
      resources.wood >= cost.wood &&
      resources.stone >= cost.stone
    );
  };

  const handlePurchase = (def) => {
    const currentLevel = buildings[def.id] || 0;
    const cost = getCostForNextLevel(def, currentLevel);

    if (canAfford(cost)) {
      if (currentLevel === 0) {
        sfx.playBuild();
      } else {
        sfx.playUpgrade();
      }
      onBuyBuilding(def.id, cost);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Shop Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              KINGDOM BUILDING SHOP
            </h3>
            <p className="text-xs text-slate-400">Construct & upgrade structures to boost focus yields</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Passive Multipliers
        </div>
      </div>

      {/* Buildings List */}
      <div className="space-y-4">
        {BUILDING_DEFINITIONS.map((def) => {
          const currentLevel = buildings[def.id] || 0;
          const isMaxed = currentLevel >= def.maxLevel;
          const cost = getCostForNextLevel(def, currentLevel);
          const affordable = canAfford(cost) && !isMaxed;

          return (
            <div
              key={def.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                currentLevel > 0
                  ? 'bg-slate-950/80 border-amber-500/30 shadow-md shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Building Info */}
                <div className="flex items-start gap-3.5">
                  <div className="text-3xl p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center shrink-0">
                    {def.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 font-mono text-sm">
                        {def.name}
                      </h4>
                      {currentLevel > 0 ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Tier {currentLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          Not Built
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-sans mt-0.5 font-medium">
                      {def.bonusText}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">
                      {def.description}
                    </p>
                  </div>
                </div>

                {/* Costs & Construct/Upgrade Button */}
                <div className="flex flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  
                  {/* Cost Badges */}
                  {!isMaxed && (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      {cost.gold > 0 && (
                        <span className={`flex items-center gap-1 ${resources.gold >= cost.gold ? 'text-amber-300' : 'text-rose-400 font-bold'}`}>
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> {cost.gold}
                        </span>
                      )}
                      {cost.wood > 0 && (
                        <span className={`flex items-center gap-1 ${resources.wood >= cost.wood ? 'text-emerald-300' : 'text-rose-400 font-bold'}`}>
                          <Trees className="w-3.5 h-3.5 text-emerald-400" /> {cost.wood}
                        </span>
                      )}
                      {cost.stone > 0 && (
                        <span className={`flex items-center gap-1 ${resources.stone >= cost.stone ? 'text-slate-300' : 'text-rose-400 font-bold'}`}>
                          <Gem className="w-3.5 h-3.5 text-cyan-400" /> {cost.stone}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Purchase Button */}
                  {isMaxed ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> MAX TIER
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(def)}
                      disabled={!affordable}
                      className={`px-4 py-2 rounded-xl text-xs font-['Silkscreen'] font-bold transition-all duration-200 flex items-center gap-2 shadow-md ${
                        affordable
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.97]'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {currentLevel === 0 ? (
                        <>
                          <Hammer className="w-4 h-4" /> CONSTRUCT
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="w-4 h-4" /> UPGRADE
                        </>
                      )}
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
