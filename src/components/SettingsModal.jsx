import React, { useState } from 'react';
import { X, Check, Bell, Volume2, Clock } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  if (!isOpen) return null;

  const [workMin, setWorkMin] = useState(settings.workMin || 25);
  const [shortBreakMin, setShortBreakMin] = useState(settings.shortBreakMin || 5);
  const [longBreakMin, setLongBreakMin] = useState(settings.longBreakMin || 15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks || false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);

  const handleSubmit = (e) => {
    e.preventDefault();
    sfx.playClick();
    onSaveSettings({
      workMin: Math.max(1, parseInt(workMin) || 25),
      shortBreakMin: Math.max(1, parseInt(shortBreakMin) || 5),
      longBreakMin: Math.max(1, parseInt(longBreakMin) || 15),
      autoStartBreaks,
      soundEnabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => { sfx.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-base font-bold text-amber-200">
              QUEST SETTINGS
            </h3>
            <p className="text-xs text-slate-400 font-sans">Customize durations & focus preferences</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          
          {/* Duration Customization Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Focus (m)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={workMin}
                onChange={(e) => setWorkMin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Short (m)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreakMin}
                onChange={(e) => setShortBreakMin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Long (m)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={longBreakMin}
                onChange={(e) => setLongBreakMin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" /> Auto-start Break Timers
              </span>
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Sound FX (UI Audio)
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { sfx.playClick(); onClose(); }}
              className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold text-xs transition font-mono"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs transition font-['Silkscreen'] shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> SAVE SETTINGS
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
