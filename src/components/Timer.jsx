import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings, Plus, Minus, ShieldAlert, Sword, Flame } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function Timer({
  mode,
  setMode,
  timeLeft,
  totalTime,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
  onAdjustTime,
  sessionsCompleted,
  openSettings,
  openDistractionModal,
  wallHp = 100,
  activeRaidMonster = null
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const modeColors = {
    work: {
      accent: 'amber',
      stroke: activeRaidMonster ? '#ef4444' : '#f59e0b',
      shadow: activeRaidMonster ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.4)',
      border: activeRaidMonster ? 'border-rose-500/50' : 'border-amber-500/30',
      badge: activeRaidMonster ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: activeRaidMonster ? '🚨 MONSTER RAID IN PROGRESS!' : '⚔️ FOCUS QUEST',
      subtitle: activeRaidMonster ? 'Citadel Wall HP taking -2 HP damage every 4 sec!' : 'Defending the Realm against Distraction Raids'
    },
    shortBreak: {
      accent: 'emerald',
      stroke: '#10b981',
      shadow: 'rgba(16, 185, 129, 0.4)',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: '☕ TAVERN REST',
      subtitle: 'Short Rest & Recovering Energy'
    },
    longBreak: {
      accent: 'cyan',
      stroke: '#06b6d4',
      shadow: 'rgba(6, 182, 212, 0.4)',
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      title: '🏰 GREAT BANQUET',
      subtitle: 'Long Rest & Replenishing Citadel Forces'
    }
  };

  const currentTheme = modeColors[mode];

  const handleModeChange = (newMode) => {
    sfx.playModeSwitch();
    setMode(newMode);
  };

  const handlePlayPause = () => {
    if (isRunning) {
      sfx.playPause();
      onPause();
    } else {
      sfx.playStart();
      onStart();
    }
  };

  return (
    <div className={`relative w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border ${currentTheme.border} rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-950/80 transition-all duration-500`}>
      
      {/* Decorative Gold Frame Corner Accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4 shadow-inner">
        <button
          onClick={() => handleModeChange('work')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 font-mono flex items-center justify-center gap-1.5 ${
            mode === 'work'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
          }`}
        >
          ⚔️ Focus (25m)
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 font-mono flex items-center justify-center gap-1.5 ${
            mode === 'shortBreak'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50'
          }`}
        >
          ☕ Short Rest (5m)
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 font-mono flex items-center justify-center gap-1.5 ${
            mode === 'longBreak'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
          }`}
        >
          🏰 Long Rest (15m)
        </button>
      </div>

      {/* Active Raid Warning Banner */}
      {activeRaidMonster && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold flex items-center justify-between shadow-lg shadow-rose-500/10 animate-bounce">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{activeRaidMonster.name} Attacking!</span>
          </div>
          <button
            onClick={() => { sfx.playMonsterAttack(); openDistractionModal(); }}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] transition flex items-center gap-1 shadow"
          >
            <Sword className="w-3.5 h-3.5 fill-current" /> DEFEND
          </button>
        </div>
      )}

      {/* Mode Subtitle */}
      <div className="text-center mb-4">
        <span className={`inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full border font-mono font-bold ${currentTheme.badge}`}>
          {currentTheme.title}
        </span>
        <p className="text-xs text-slate-400 mt-1 font-sans">{currentTheme.subtitle}</p>
      </div>

      {/* Main Circular Countdown Display */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 mx-auto flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke={currentTheme.stroke}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: `drop-shadow(0 0 12px ${currentTheme.shadow})`
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="font-['Silkscreen'] text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            {formattedTime}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => { sfx.playClick(); onAdjustTime(-60); }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700 text-xs flex items-center gap-1 font-mono"
            >
              <Minus className="w-3.5 h-3.5" /> 1m
            </button>
            <button
              onClick={() => { sfx.playClick(); onAdjustTime(60); }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700 text-xs flex items-center gap-1 font-mono"
            >
              <Plus className="w-3.5 h-3.5" /> 1m
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-500'}`} />
            <span>{isRunning ? 'Quest Active...' : 'Paused'}</span>
          </div>
        </div>
      </div>

      {/* Log Distraction / Defend Kingdom Action Button */}
      {mode === 'work' && (
        <div className="my-4 text-center">
          <button
            onClick={() => { sfx.playMonsterAttack(); openDistractionModal(); }}
            className={`w-full py-3 px-4 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg ${
              activeRaidMonster
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white border-rose-400 shadow-rose-500/40 animate-pulse'
                : 'bg-gradient-to-r from-rose-600/30 via-rose-500/20 to-rose-600/30 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            {activeRaidMonster ? '⚔️ DEFEND CITADEL (SLAY MONSTER NOW)' : '🛡️ LOG DISTRACTION (SPAWN & BATTLE MONSTER)'}
          </button>
        </div>
      )}

      {/* Main Control Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => { sfx.playClick(); onReset(); }}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 shadow-md hover:scale-105 active:scale-95"
          title="Reset Quest Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className={`flex-1 py-4 px-6 rounded-2xl font-bold font-['Silkscreen'] text-base tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:scale-[1.03] active:scale-[0.98] ${
            isRunning
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-amber-500/30'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-amber-400/40 animate-pulse'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 fill-current" /> PAUSE
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" /> START QUEST
            </>
          )}
        </button>

        <button
          onClick={() => { sfx.playClick(); onSkip(); }}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 shadow-md hover:scale-105 active:scale-95"
          title="Skip Session"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <button
          onClick={() => { sfx.playClick(); openSettings(); }}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition border border-slate-700 shadow-md hover:scale-105 active:scale-95"
          title="Timer Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
