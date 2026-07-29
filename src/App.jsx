import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import RPGHeader from './components/RPGHeader';
import Timer from './components/Timer';
import SoundscapeMixer from './components/SoundscapeMixer';
import BuildingShop from './components/BuildingShop';
import KingdomRealm from './components/KingdomRealm';
import KingdomCanvas from './components/KingdomCanvas';
import DistractionLog from './components/DistractionLog';
import AchievementsPanel from './components/AchievementsPanel';
import FocusAnalytics from './components/FocusAnalytics';
import MonsterRaidModal from './components/MonsterRaidModal';
import SettingsModal from './components/SettingsModal';
import { sfx } from './utils/sfx';

export default function App() {
  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoro_kingdom_settings');
    return saved ? JSON.parse(saved) : {
      workMin: 25,
      shortBreakMin: 5,
      longBreakMin: 15,
      autoStartBreaks: false,
      soundEnabled: true
    };
  });

  // Mode & Timer State
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(settings.workMin * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    return parseInt(localStorage.getItem('pomodoro_kingdom_sessions') || '0', 10);
  });

  // Total Focus Minutes State
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => {
    return parseInt(localStorage.getItem('pomodoro_kingdom_focus_mins') || '75', 10);
  });

  // Citadel Wall HP State
  const [wallHp, setWallHp] = useState(() => {
    return parseInt(localStorage.getItem('pomodoro_kingdom_wall_hp') || '100', 10);
  });

  // Active Monster Raid State
  const [activeRaidMonster, setActiveRaidMonster] = useState(null);

  // Distraction History Log
  const [distractionLog, setDistractionLog] = useState(() => {
    const saved = localStorage.getItem('pomodoro_kingdom_distraction_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Claimed Achievements State
  const [claimedAchievements, setClaimedAchievements] = useState(() => {
    const saved = localStorage.getItem('pomodoro_kingdom_claimed_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  // RPG State (Level, XP, Resources)
  const [rpgState, setRpgState] = useState(() => {
    const saved = localStorage.getItem('pomodoro_kingdom_rpg');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 35,
      maxXp: 100,
      streak: 3,
      resources: { gold: 120, wood: 45, stone: 20 }
    };
  });

  // Buildings State
  const [buildings, setBuildings] = useState(() => {
    const saved = localStorage.getItem('pomodoro_kingdom_buildings');
    return saved ? JSON.parse(saved) : {
      lumber_mill: 0,
      stone_quarry: 0,
      barracks: 0,
      wizard_tower: 0,
      grand_castle: 0
    };
  });

  const [activeTab, setActiveTab] = useState('canvas');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDistractionModalOpen, setIsDistractionModalOpen] = useState(false);

  const timerRef = useRef(null);
  const raidDamageRef = useRef(null);

  const getTotalTimeForMode = (m) => {
    if (m === 'work') return settings.workMin * 60;
    if (m === 'shortBreak') return settings.shortBreakMin * 60;
    if (m === 'longBreak') return settings.longBreakMin * 60;
    return 25 * 60;
  };

  const totalTime = getTotalTimeForMode(mode);

  const handleSetMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getTotalTimeForMode(newMode));
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, settings]);

  useEffect(() => {
    if (activeRaidMonster) {
      raidDamageRef.current = setInterval(() => {
        setWallHp((prevHp) => {
          const newHp = Math.max(0, prevHp - 5);
          localStorage.setItem('pomodoro_kingdom_wall_hp', newHp.toString());
          return newHp;
        });
        sfx.playMonsterAttack();
      }, 1500);
    } else {
      clearInterval(raidDamageRef.current);
    }

    return () => clearInterval(raidDamageRef.current);
  }, [activeRaidMonster]);

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoro_kingdom_settings', JSON.stringify(newSettings));
    sfx.enabled = newSettings.soundEnabled;
    setTimeLeft(newSettings[mode === 'work' ? 'workMin' : mode === 'shortBreak' ? 'shortBreakMin' : 'longBreakMin'] * 60);
  };

  const handleTriggerRaid = () => {
    sfx.playMonsterAttack();
    const monsterObj = {
      name: 'Distraction Beast',
      icon: '👹',
      hp: 50
    };
    setActiveRaidMonster(monsterObj);
    setIsDistractionModalOpen(true);
  };

  const handleDefeatMonster = (entry) => {
    setActiveRaidMonster(null);

    const updatedLog = [entry, ...distractionLog];
    setDistractionLog(updatedLog);
    localStorage.setItem('pomodoro_kingdom_distraction_log', JSON.stringify(updatedLog));

    const newWallHp = Math.min(100, wallHp + 20);
    setWallHp(newWallHp);
    localStorage.setItem('pomodoro_kingdom_wall_hp', newWallHp.toString());

    const updatedRpg = {
      ...rpgState,
      resources: {
        ...rpgState.resources,
        gold: rpgState.resources.gold + 20
      }
    };
    setRpgState(updatedRpg);
    localStorage.setItem('pomodoro_kingdom_rpg', JSON.stringify(updatedRpg));
  };

  const handleRepairWall = (stoneCost) => {
    const newHp = Math.min(100, wallHp + 25);
    setWallHp(newHp);
    localStorage.setItem('pomodoro_kingdom_wall_hp', newHp.toString());

    const updatedRpg = {
      ...rpgState,
      resources: {
        ...rpgState.resources,
        stone: rpgState.resources.stone - stoneCost
      }
    };
    setRpgState(updatedRpg);
    localStorage.setItem('pomodoro_kingdom_rpg', JSON.stringify(updatedRpg));
  };

  const handleBuyBuilding = (buildingId, cost) => {
    const updatedResources = {
      gold: rpgState.resources.gold - cost.gold,
      wood: rpgState.resources.wood - cost.wood,
      stone: rpgState.resources.stone - cost.stone
    };

    const updatedBuildings = {
      ...buildings,
      [buildingId]: (buildings[buildingId] || 0) + 1
    };

    const updatedRpg = {
      ...rpgState,
      resources: updatedResources
    };

    setRpgState(updatedRpg);
    setBuildings(updatedBuildings);

    localStorage.setItem('pomodoro_kingdom_rpg', JSON.stringify(updatedRpg));
    localStorage.setItem('pomodoro_kingdom_buildings', JSON.stringify(updatedBuildings));

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const handleClaimReward = (achId, reward) => {
    const updatedClaimed = [...claimedAchievements, achId];
    setClaimedAchievements(updatedClaimed);
    localStorage.setItem('pomodoro_kingdom_claimed_achievements', JSON.stringify(updatedClaimed));

    const updatedRpg = {
      ...rpgState,
      xp: rpgState.xp + (reward.xp || 0),
      resources: {
        gold: rpgState.resources.gold + (reward.gold || 0),
        wood: rpgState.resources.wood + (reward.wood || 0),
        stone: rpgState.resources.stone + (reward.stone || 0)
      }
    };
    setRpgState(updatedRpg);
    localStorage.setItem('pomodoro_kingdom_rpg', JSON.stringify(updatedRpg));

    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleTimerCompletion = () => {
    setIsRunning(false);
    sfx.playComplete();

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    if (mode === 'work') {
      const newCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newCompleted);
      localStorage.setItem('pomodoro_kingdom_sessions', newCompleted.toString());

      const newTotalMins = totalFocusMinutes + settings.workMin;
      setTotalFocusMinutes(newTotalMins);
      localStorage.setItem('pomodoro_kingdom_focus_mins', newTotalMins.toString());

      let woodMult = 1 + (buildings.lumber_mill || 0) * 0.25;
      let stoneMult = 1 + (buildings.stone_quarry || 0) * 0.25;
      let xpMult = 1 + (buildings.barracks || 0) * 0.20;
      let goldMult = 1 + (buildings.wizard_tower || 0) * 0.30;
      
      if (buildings.grand_castle) {
        const castleBoost = buildings.grand_castle * 0.50;
        woodMult += castleBoost;
        stoneMult += castleBoost;
        xpMult += castleBoost;
        goldMult += castleBoost;
      }

      setRpgState((prev) => {
        const baseClassXp = 30;
        const baseGold = 25;
        const baseWood = 12;
        const baseStone = 8;

        const gainedXp = Math.round(baseClassXp * xpMult);
        const gainedGold = Math.round(baseGold * goldMult);
        const gainedWood = Math.round(baseWood * woodMult);
        const gainedStone = Math.round(baseStone * stoneMult);

        let newXp = prev.xp + gainedXp;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;

        if (newXp >= prev.maxXp) {
          newLevel += 1;
          newXp = newXp - prev.maxXp;
          newMaxXp = Math.round(prev.maxXp * 1.25);
        }

        const updated = {
          ...prev,
          level: newLevel,
          xp: newXp,
          maxXp: newMaxXp,
          resources: {
            gold: prev.resources.gold + gainedGold,
            wood: prev.resources.wood + gainedWood,
            stone: prev.resources.stone + gainedStone
          }
        };

        localStorage.setItem('pomodoro_kingdom_rpg', JSON.stringify(updated));
        return updated;
      });

      if (newCompleted % 4 === 0) {
        handleSetMode('longBreak');
      } else {
        handleSetMode('shortBreak');
      }

      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }

    } else {
      handleSetMode('work');
    }
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    if (isRunning && mode === 'work') {
      sfx.playMonsterAttack();
      const newHp = Math.max(0, wallHp - 25);
      setWallHp(newHp);
      localStorage.setItem('pomodoro_kingdom_wall_hp', newHp.toString());
      setActiveRaidMonster({ name: 'Procrastination Beast', icon: '🐉', hp: 50 });
    }
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      handleSetMode('shortBreak');
    } else {
      handleSetMode('work');
    }
  };

  const handleAdjustTime = (seconds) => {
    setTimeLeft((prev) => Math.max(10, prev + seconds));
  };

  const statsForAchievements = {
    sessionsCompleted,
    totalBuildings: Object.values(buildings).reduce((a, b) => a + b, 0),
    monstersSlain: distractionLog.length,
    totalFocusMinutes,
    wallHp
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* RPG Top Header */}
      <RPGHeader
        level={rpgState.level}
        xp={rpgState.xp}
        maxXp={rpgState.maxXp}
        streak={rpgState.streak}
        resources={rpgState.resources}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pomodoro Countdown Engine */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <Timer
            mode={mode}
            setMode={handleSetMode}
            timeLeft={timeLeft}
            totalTime={totalTime}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSkip={handleSkip}
            onAdjustTime={handleAdjustTime}
            sessionsCompleted={sessionsCompleted}
            openSettings={() => setIsSettingsOpen(true)}
            openDistractionModal={handleTriggerRaid}
            wallHp={wallHp}
            activeRaidMonster={activeRaidMonster}
          />
        </section>

        {/* Right Column: Multi-tab Panel */}
        <section className="lg:col-span-7 space-y-4">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-lg font-mono text-xs overflow-x-auto">
            <button
              onClick={() => { sfx.playClick(); setActiveTab('canvas'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'canvas'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              🗺️ Canvas Map
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('shop'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'shop'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              🔨 Shop
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('achievements'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'achievements'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              🏆 Trophies
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('analytics'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('distractions'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'distractions'
                  ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/50'
              }`}
            >
              🛡️ Monsters ({distractionLog.length})
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('soundscape'); }}
              className={`flex-1 py-2 px-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === 'soundscape'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              🎵 Audio
            </button>
          </div>

          {/* Active Tab Panel Content */}
          {activeTab === 'canvas' && (
            <KingdomCanvas
              level={rpgState.level}
              buildings={buildings}
              distractionLog={distractionLog}
              wallHp={wallHp}
              activeRaidMonster={activeRaidMonster}
            />
          )}

          {activeTab === 'shop' && (
            <BuildingShop
              resources={rpgState.resources}
              buildings={buildings}
              onBuyBuilding={handleBuyBuilding}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsPanel
              stats={statsForAchievements}
              claimedAchievements={claimedAchievements}
              onClaimReward={handleClaimReward}
            />
          )}

          {activeTab === 'analytics' && (
            <FocusAnalytics
              sessionsCompleted={sessionsCompleted}
              distractionCount={distractionLog.length}
              wallHp={wallHp}
              totalFocusMinutes={totalFocusMinutes}
            />
          )}

          {activeTab === 'realm' && (
            <KingdomRealm
              level={rpgState.level}
              buildings={buildings}
            />
          )}

          {activeTab === 'distractions' && (
            <DistractionLog
              distractionLog={distractionLog}
              wallHp={wallHp}
              maxWallHp={100}
              onRepairWall={handleRepairWall}
              resources={rpgState.resources}
            />
          )}

          {activeTab === 'soundscape' && (
            <SoundscapeMixer />
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500 font-mono">
        ⚔️ Focus Quest v6.0 — Gamified Deep-Work RPG App
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <MonsterRaidModal
        isOpen={isDistractionModalOpen}
        onClose={() => setIsDistractionModalOpen(false)}
        onDefeatMonster={handleDefeatMonster}
        activeRaidMonster={activeRaidMonster}
        wallHp={wallHp}
      />

    </div>
  );
}
