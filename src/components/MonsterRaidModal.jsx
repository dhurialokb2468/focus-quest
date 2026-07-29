import React, { useState } from 'react';
import { X, Sword, ShieldAlert, Sparkles, AlertTriangle, Flame } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function MonsterRaidModal({ isOpen, onClose, onDefeatMonster, activeRaidMonster, wallHp = 100 }) {
  if (!isOpen) return null;

  const [distractionText, setDistractionText] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  const monsterName = activeRaidMonster?.name || 'Distraction Beast';
  const monsterIcon = activeRaidMonster?.icon || '👹';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!distractionText.trim()) return;

    sfx.playMonsterDefeat();
    onDefeatMonster({
      monster: monsterName,
      icon: monsterIcon,
      distraction: distractionText,
      plan: actionPlan || 'Saved for after focus session',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setDistractionText('');
    setActionPlan('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Non-opaque Battle Glass Container allowing view of background Canvas destruction */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-rose-500/60 rounded-3xl p-6 shadow-2xl relative shadow-rose-500/20 backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={() => { sfx.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Rapid Wall HP Damage Meter */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-rose-500/30">
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-3xl animate-bounce">
            {monsterIcon}
          </div>
          <div className="flex-1">
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-rose-300 flex items-center gap-2">
              🚨 MONSTER ATTACKING REALM!
            </h3>
            <div className="text-xs text-rose-400 font-mono font-bold mt-1 flex items-center gap-1.5 animate-pulse">
              <Flame className="w-4 h-4 text-rose-500" /> CITADEL WALL: {wallHp}/100 HP (-5 HP/1.5 sec)
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          
          {/* Attacking Monster Info Banner */}
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-200 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> {monsterName} is destroying your citadel!
            </span>
            <span className="text-[10px] text-rose-400 px-2 py-0.5 rounded bg-rose-500/20">
              RAPID RAID
            </span>
          </div>

          {/* Distraction Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 font-mono mb-1">
              What distraction urge popped up? <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., Urge to check Twitter / Unrelated thoughts"
              value={distractionText}
              onChange={(e) => setDistractionText(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 shadow-inner"
            />
          </div>

          {/* Action Plan Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 font-mono mb-1">
              Countermeasure / Reflection:
            </label>
            <input
              type="text"
              placeholder="e.g., Wrote idea on notepad, returning to focus"
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 shadow-inner"
            />
          </div>

          {/* Slay Monster Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white font-['Silkscreen'] text-xs tracking-wider font-bold transition-all duration-300 shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sword className="w-5 h-5 fill-current" /> SLAY MONSTER & STOP CITADEL DESTRUCTION
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
