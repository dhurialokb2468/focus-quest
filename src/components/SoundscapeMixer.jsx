import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, Radio, Brain, SlidersHorizontal, Sparkles } from 'lucide-react';
import { soundscape } from '../utils/soundscape';
import { sfx } from '../utils/sfx';

export default function SoundscapeMixer() {
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState({
    rain: { active: false, volume: 50 },
    coffee: { active: false, volume: 40 },
    synthwave: { active: false, volume: 45 },
    binaural: { active: false, volume: 30 }
  });

  const toggleTrack = (trackName) => {
    sfx.playClick();
    const currentState = tracks[trackName].active;
    const newState = !currentState;

    setTracks((prev) => ({
      ...prev,
      [trackName]: { ...prev[trackName], active: newState }
    }));

    if (trackName === 'rain') newState ? soundscape.startRain() : soundscape.stopRain();
    if (trackName === 'coffee') newState ? soundscape.startCoffee() : soundscape.stopCoffee();
    if (trackName === 'synthwave') newState ? soundscape.startSynthwave() : soundscape.stopSynthwave();
    if (trackName === 'binaural') newState ? soundscape.startBinaural() : soundscape.stopBinaural();
  };

  const handleVolumeChange = (trackName, val) => {
    const normVal = parseFloat(val) / 100;
    setTracks((prev) => ({
      ...prev,
      [trackName]: { ...prev[trackName], volume: val }
    }));

    if (trackName === 'rain') soundscape.setRainVolume(normVal);
    if (trackName === 'coffee') soundscape.setCoffeeVolume(normVal);
    if (trackName === 'synthwave') soundscape.setSynthwaveVolume(normVal);
    if (trackName === 'binaural') soundscape.setBinauralVolume(normVal);
  };

  const toggleMasterMute = () => {
    sfx.playClick();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundscape.toggleMute(newMuted);
  };

  const applyPreset = (presetName) => {
    sfx.playClick();
    soundscape.stopAll();

    let newTracks = {
      rain: { active: false, volume: 50 },
      coffee: { active: false, volume: 40 },
      synthwave: { active: false, volume: 45 },
      binaural: { active: false, volume: 30 }
    };

    if (presetName === 'rainy') {
      newTracks.rain = { active: true, volume: 70 };
      newTracks.binaural = { active: true, volume: 30 };
      soundscape.startRain();
      soundscape.setRainVolume(0.7);
      soundscape.startBinaural();
      soundscape.setBinauralVolume(0.3);
    } else if (presetName === 'tavern') {
      newTracks.coffee = { active: true, volume: 60 };
      newTracks.rain = { active: true, volume: 30 };
      soundscape.startCoffee();
      soundscape.setCoffeeVolume(0.6);
      soundscape.startRain();
      soundscape.setRainVolume(0.3);
    } else if (presetName === 'synthwave') {
      newTracks.synthwave = { active: true, volume: 65 };
      newTracks.binaural = { active: true, volume: 35 };
      soundscape.startSynthwave();
      soundscape.setSynthwaveVolume(0.65);
      soundscape.startBinaural();
      soundscape.setBinauralVolume(0.35);
    } else if (presetName === 'alpha') {
      newTracks.binaural = { active: true, volume: 75 };
      soundscape.startBinaural();
      soundscape.setBinauralVolume(0.75);
    }

    setTracks(newTracks);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
              SOUNDSCAPE MIXER
            </h3>
            <p className="text-xs text-slate-400">Procedural Web Audio Ambient Synth</p>
          </div>
        </div>

        {/* Master Mute Toggle */}
        <button
          onClick={toggleMasterMute}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-400'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          <span>{isMuted ? 'Muted' : 'Audio On'}</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="mb-6">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          ✨ Ambient Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('rainy')}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-amber-300 transition flex items-center justify-center gap-1.5"
          >
            🌧️ Rainy Citadel
          </button>
          <button
            onClick={() => applyPreset('tavern')}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-amber-300 transition flex items-center justify-center gap-1.5"
          >
            ☕ Cozy Tavern
          </button>
          <button
            onClick={() => applyPreset('synthwave')}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-amber-300 transition flex items-center justify-center gap-1.5"
          >
            🌌 Synth Focus
          </button>
          <button
            onClick={() => applyPreset('alpha')}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-amber-300 transition flex items-center justify-center gap-1.5"
          >
            🧠 Alpha Wave
          </button>
        </div>
      </div>

      {/* Track Controls */}
      <div className="space-y-4">
        
        {/* Track 1: Rain */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
          <button
            onClick={() => toggleTrack('rain')}
            className={`p-3 rounded-xl border transition-all ${
              tracks.rain.active
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <CloudRain className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 font-mono">Rain & Thunder</span>
              <span className="text-slate-500 font-mono text-[11px]">{tracks.rain.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tracks.rain.volume}
              onChange={(e) => handleVolumeChange('rain', e.target.value)}
              className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Track 2: Coffee Shop */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
          <button
            onClick={() => toggleTrack('coffee')}
            className={`p-3 rounded-xl border transition-all ${
              tracks.coffee.active
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Coffee className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 font-mono">Tavern & Coffee Chatter</span>
              <span className="text-slate-500 font-mono text-[11px]">{tracks.coffee.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tracks.coffee.volume}
              onChange={(e) => handleVolumeChange('coffee', e.target.value)}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Track 3: Synthwave Drone */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
          <button
            onClick={() => toggleTrack('synthwave')}
            className={`p-3 rounded-xl border transition-all ${
              tracks.synthwave.active
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-md shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Radio className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 font-mono">Synthwave Deep Drone</span>
              <span className="text-slate-500 font-mono text-[11px]">{tracks.synthwave.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tracks.synthwave.volume}
              onChange={(e) => handleVolumeChange('synthwave', e.target.value)}
              className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Track 4: Binaural Alpha Beats */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
          <button
            onClick={() => toggleTrack('binaural')}
            className={`p-3 rounded-xl border transition-all ${
              tracks.binaural.active
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Brain className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-200 font-mono">Binaural Alpha Waves (10Hz)</span>
              <span className="text-slate-500 font-mono text-[11px]">{tracks.binaural.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tracks.binaural.volume}
              onChange={(e) => handleVolumeChange('binaural', e.target.value)}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
