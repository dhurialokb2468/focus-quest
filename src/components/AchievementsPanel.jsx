import React from 'react';
import { Trophy, Award, CheckCircle2, Sparkles, Coins, Trees, Gem, Lock } from 'lucide-react';
import { sfx } from '../utils/sfx';

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_sprint',
    title: 'Novice Adventurer',
    icon: '🎯',
    description: 'Complete your first 25-minute Focus Sprint',
    rewardText: '+50 Gold, +30 XP',
    reward: { gold: 50, xp: 30 },
    condition: (stats) => stats.sessionsCompleted >= 1
  },
  {
    id: 'build_three',
    title: 'Master Architect',
    icon: '⚒️',
    description: 'Construct at least 3 realm structures',
    rewardText: '+100 Gold, +20 Wood',
    reward: { gold: 100, wood: 20 },
    condition: (stats) => stats.totalBuildings >= 3
  },
  {
    id: 'slay_three',
    title: 'Distraction Slayer',
    icon: '⚔️',
    description: 'Slay 3 distraction monsters during sprints',
    rewardText: '+75 XP, +25 Stone',
    reward: { xp: 75, stone: 25 },
    condition: (stats) => stats.monstersSlain >= 3
  },
  {
    id: 'focus_century',
    title: 'Deep Focus Legend',
    icon: '⚡',
    description: 'Accumulate 100 total minutes of focus time',
    rewardText: '+150 Gold, +100 XP',
    reward: { gold: 150, xp: 100 },
    condition: (stats) => stats.totalFocusMinutes >= 100
  },
  {
    id: 'stout_citadel',
    title: 'Fortress Defender',
    icon: '🛡️',
    description: 'Maintain Citadel Wall HP above 90%',
    rewardText: '+50 Stone, +50 Gold',
    reward: { stone: 50, gold: 50 },
    condition: (stats) => stats.wallHp >= 90
  }
];

export default function AchievementsPanel({ stats, claimedAchievements = [], onClaimReward }) {
  
  const handleClaim = (ach) => {
    if (!claimedAchievements.includes(ach.id) && ach.condition(stats)) {
      sfx.playUpgrade();
      onClaimReward(ach.id, ach.reward);
    }
  };

  const unlockedCount = ACHIEVEMENTS_LIST.filter(a => a.condition(stats)).length;

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              QUEST ACHIEVEMENTS
            </h3>
            <p className="text-xs text-slate-400">Earn trophies & bonus resources</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          {unlockedCount} / {ACHIEVEMENTS_LIST.length} Unlocked
        </span>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const isUnlocked = ach.condition(stats);
          const isClaimed = claimedAchievements.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isClaimed
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : isUnlocked
                  ? 'bg-slate-950/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`text-2xl p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 ${!isUnlocked && 'grayscale opacity-50'}`}>
                  {ach.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-100 font-mono">
                      {ach.title}
                    </h4>
                    {!isUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {ach.description}
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono mt-1">
                    Reward: {ach.rewardText}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {isClaimed ? (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Claimed
                  </span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleClaim(ach)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-['Silkscreen'] text-xs font-bold transition hover:scale-105 shadow-md shadow-amber-500/20"
                  >
                    CLAIM
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                    Locked
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
