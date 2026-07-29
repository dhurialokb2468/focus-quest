import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, CloudRain, Sparkles, ShieldAlert, Flame, Sword } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function KingdomCanvas({ level = 1, buildings = {}, distractionLog = [], wallHp = 100, activeRaidMonster = null }) {
  const canvasRef = useRef(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [weather, setWeather] = useState('clear');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let tick = 0;

    // Rain particles array
    const rainParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 500,
      speed: 4 + Math.random() * 5,
      length: 8 + Math.random() * 8
    }));

    // Magic sparkle particles array
    const magicParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 500,
      radius: 1 + Math.random() * 2,
      alpha: Math.random(),
      speed: 0.02 + Math.random() * 0.03
    }));

    // Smoke particles for damaged citadel wall
    const smokeParticles = Array.from({ length: 25 }, () => ({
      x: 340 + Math.random() * 90,
      y: 40 + Math.random() * 20,
      radius: 3 + Math.random() * 6,
      alpha: 0.8,
      speedY: 0.5 + Math.random() * 0.5
    }));

    // Rapid fireball attack particles traveling from monster to citadel
    const fireballParticles = Array.from({ length: 8 }, (_, i) => ({
      x: 230,
      y: 170,
      progress: (i * 0.125),
      speed: 0.035 // Rapid fireball speed
    }));

    let heroX = 360;
    let heroDir = 1;
    let monsterYPos = 170;
    let monsterDir = 1;

    const render = () => {
      tick++;

      const width = canvas.width;
      const height = canvas.height;

      // Screen shake effect when wallHp < 50 or active raid
      ctx.save();
      if (activeRaidMonster && tick % 4 === 0) {
        ctx.translate((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
      }

      // 1. Draw Ground
      ctx.fillStyle = timeOfDay === 'night' ? '#06170d' : timeOfDay === 'sunset' ? '#1a3318' : '#144523';
      ctx.fillRect(-10, -10, width + 20, height + 20);

      // Grid lines
      ctx.strokeStyle = timeOfDay === 'night' ? 'rgba(15, 45, 25, 0.4)' : 'rgba(25, 80, 40, 0.4)';
      ctx.lineWidth = 1;
      const tileSize = 40;
      for (let x = 0; x < width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw River
      const riverY = 320;
      ctx.fillStyle = timeOfDay === 'night' ? '#092540' : timeOfDay === 'sunset' ? '#1a3d60' : '#1d548b';
      ctx.fillRect(0, riverY, width, 50);

      ctx.fillStyle = '#2b2118';
      ctx.fillRect(0, riverY - 3, width, 3);
      ctx.fillRect(0, riverY + 50, width, 3);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const rx = (tick * 1.5 + i * 140) % (width + 50) - 25;
        const ry = riverY + 12 + (i % 3) * 12;
        ctx.beginPath();
        ctx.arc(rx, ry, 8 + Math.sin(tick * 0.05 + i) * 3, 0, Math.PI);
        ctx.stroke();
      }

      // 3. Wooden Bridge
      const bridgeX = 360;
      ctx.fillStyle = '#5c3d2e';
      ctx.fillRect(bridgeX, riverY - 6, 50, 62);
      ctx.fillStyle = '#3d261c';
      for (let bx = bridgeX + 2; bx < bridgeX + 50; bx += 8) {
        ctx.fillRect(bx, riverY - 6, 2, 62);
      }
      ctx.fillStyle = '#8c5a3f';
      ctx.fillRect(bridgeX - 4, riverY - 8, 58, 4);
      ctx.fillRect(bridgeX - 4, riverY + 54, 58, 4);

      // 4. Cobblestone Paths
      ctx.fillStyle = '#4a443b';
      ctx.fillRect(100, 180, 560, 24);
      ctx.fillRect(373, 100, 24, 250);

      // 5. Buildings

      // Grand Citadel
      const hasCastle = buildings.grand_castle > 0;
      ctx.fillStyle = hasCastle ? '#383b42' : '#222428';
      ctx.fillRect(340, 50, 90, 60);
      ctx.fillStyle = hasCastle ? '#4b4f59' : '#2d3036';
      ctx.fillRect(330, 35, 25, 75);
      ctx.fillRect(415, 35, 25, 75);
      ctx.fillStyle = hasCastle ? '#b91c1c' : '#450a0a';
      ctx.beginPath();
      ctx.moveTo(330, 35);
      ctx.lineTo(342.5, 15);
      ctx.lineTo(355, 35);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(415, 35);
      ctx.lineTo(427.5, 15);
      ctx.lineTo(440, 35);
      ctx.fill();

      // Flag
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(385, 50);
      ctx.lineTo(385, 20);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(385, 20);
      ctx.lineTo(405, 27);
      ctx.lineTo(385, 34);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = '10px Silkscreen, monospace';
      ctx.fillText('CITADEL', 355, 100);

      // Citadel Wall Damage & Smoke Plumes
      if (wallHp < 100 || activeRaidMonster) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(330, 80, 110, 6); // Heavy wall damage crack

        smokeParticles.forEach((sp) => {
          ctx.fillStyle = `rgba(239, 68, 68, ${sp.alpha})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.fill();
          sp.y -= sp.speedY;
          sp.alpha -= 0.012;
          if (sp.y < 5 || sp.alpha <= 0) {
            sp.y = 50 + Math.random() * 20;
            sp.x = 330 + Math.random() * 110;
            sp.alpha = 0.8;
          }
        });
      }

      // Lumber Mill
      const hasLumber = buildings.lumber_mill > 0;
      ctx.fillStyle = hasLumber ? '#654321' : '#322110';
      ctx.fillRect(80, 80, 70, 55);
      ctx.fillStyle = hasLumber ? '#855529' : '#422a14';
      ctx.beginPath();
      ctx.moveTo(70, 80);
      ctx.lineTo(115, 55);
      ctx.lineTo(160, 80);
      ctx.fill();
      if (hasLumber) {
        ctx.save();
        ctx.translate(150, 110);
        ctx.rotate(tick * 0.08);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '9px monospace';
      ctx.fillText(hasLumber ? 'LUMBER' : '[LUMBER]', 92, 120);

      // Stone Quarry
      const hasQuarry = buildings.stone_quarry > 0;
      ctx.fillStyle = hasQuarry ? '#64748b' : '#334155';
      ctx.beginPath();
      ctx.arc(635, 100, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(620, 95, 30, 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText(hasQuarry ? 'QUARRY' : '[QUARRY]', 612, 135);

      // Knight Barracks
      const hasBarracks = buildings.barracks > 0;
      ctx.fillStyle = hasBarracks ? '#7f1d1d' : '#450a0a';
      ctx.fillRect(80, 220, 80, 55);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(75, 210, 90, 12);
      ctx.fillStyle = '#fef08a';
      ctx.font = '9px monospace';
      ctx.fillText(hasBarracks ? 'BARRACKS' : '[BARRACKS]', 88, 255);

      // Wizard Tower
      const hasWizard = buildings.wizard_tower > 0;
      ctx.fillStyle = hasWizard ? '#3b0764' : '#1e1b4b';
      ctx.fillRect(610, 200, 45, 75);
      if (hasWizard) {
        const glow = Math.sin(tick * 0.08) * 4 + 10;
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = glow;
        ctx.beginPath();
        ctx.arc(632.5, 185, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = '#e9d5ff';
      ctx.font = '9px monospace';
      ctx.fillText(hasWizard ? 'WIZARD' : '[WIZARD]', 610, 260);

      // Trees
      const treeCoords = [
        [30, 40], [40, 160], [180, 40], [240, 100],
        [520, 50], [700, 120], [720, 240], [520, 250],
        [200, 250], [40, 260], [670, 40]
      ];
      treeCoords.forEach(([tx, ty]) => {
        ctx.fillStyle = '#5c3d2e';
        ctx.fillRect(tx + 8, ty + 20, 6, 12);
        ctx.fillStyle = timeOfDay === 'night' ? '#0a2e16' : '#15803d';
        ctx.beginPath();
        ctx.arc(tx + 11, ty + 12, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. MONSTER SPAWNS ONLY WHEN RAID IS ACTIVE (Requirement: No idle monsters before!)
      if (activeRaidMonster) {
        monsterYPos += monsterDir * 0.4;
        if (monsterYPos > 180) monsterDir = -1;
        if (monsterYPos < 150) monsterDir = 1;

        const monsterX = 220;
        const monsterBounce = Math.abs(Math.sin(tick * 0.18)) * 5;

        // Big Red Raid Monster Sprite
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(monsterX, monsterYPos - monsterBounce, 22, 22);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(monsterX, monsterYPos + 10 - monsterBounce, 22, 10);

        // Glowing Eyes
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(monsterX + 4, monsterYPos + 4 - monsterBounce, 4, 4);
        ctx.fillRect(monsterX + 13, monsterYPos + 4 - monsterBounce, 4, 4);

        // Horns & Weapon
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(monsterX + 2, monsterYPos - 6 - monsterBounce, 3, 6);
        ctx.fillRect(monsterX + 17, monsterYPos - 6 - monsterBounce, 3, 6);

        // Monster Name Tag & Live HP Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(monsterX - 15, monsterYPos - 20 - monsterBounce, 52, 8);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(monsterX - 14, monsterYPos - 19 - monsterBounce, 50, 6);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Silkscreen, monospace';
        ctx.fillText('RAID BOSS 👹', monsterX - 18, monsterYPos - 24 - monsterBounce);

        // RAPID FIREBALL ATTACKS FLYING FROM MONSTER TO CITADEL
        fireballParticles.forEach((fb) => {
          fb.progress += fb.speed;
          if (fb.progress > 1) fb.progress = 0;

          const startX = monsterX + 12;
          const startY = monsterYPos;
          const targetX = 370;
          const targetY = 75;

          const currentX = startX + (targetX - startX) * fb.progress;
          const currentY = startY + (targetY - startY) * fb.progress - Math.sin(fb.progress * Math.PI) * 40;

          ctx.fillStyle = '#f97316';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Flashing Red Alert Overlay on Canvas Map
        const flashAlpha = Math.abs(Math.sin(tick * 0.12)) * 0.25;
        ctx.fillStyle = `rgba(239, 68, 68, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 7. Hero Knight Sprite
      heroX += heroDir * 0.4;
      if (heroX > 420) heroDir = -1;
      if (heroX < 340) heroDir = 1;

      const bounceY = Math.abs(Math.sin(tick * 0.15)) * 4;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(heroX, 160 - bounceY, 14, 18);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(heroX + 3, 155 - bounceY, 8, 5);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(heroX + (heroDir > 0 ? 15 : -4), 162 - bounceY, 3, 10);
      ctx.fillStyle = '#fef08a';
      ctx.font = '8px monospace';
      ctx.fillText('HERO 🛡️', heroX - 4, 148 - bounceY);

      // 8. Weather Particles
      if (weather === 'rain') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
        ctx.lineWidth = 1.5;
        rainParticles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        });
      } else if (weather === 'magic') {
        magicParticles.forEach((p) => {
          ctx.fillStyle = `rgba(232, 121, 249, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          p.y -= p.speed * 10;
          p.alpha += Math.sin(tick * 0.05) * 0.02;
          if (p.y < 0) p.y = height;
        });
      }

      // 9. Day / Sunset / Night Lighting
      if (timeOfDay === 'sunset') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
        ctx.fillRect(0, 0, width, height);
      } else if (timeOfDay === 'night') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.fillRect(0, 0, width, height);

        const torchGlow = Math.sin(tick * 0.1) * 3 + 12;
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = torchGlow;
        ctx.beginPath();
        ctx.arc(330, 70, 5, 0, Math.PI * 2);
        ctx.arc(440, 70, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore(); // Restore shake transform

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeOfDay, weather, buildings, wallHp, activeRaidMonster]);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-xl shadow-slate-950/80">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-['Silkscreen'] text-sm md:text-base font-bold text-amber-200">
            2D PIXEL REALM CANVAS
          </h3>
          <p className="text-xs text-slate-400">Live 60 FPS pixel-art map with active monster raid defense</p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { sfx.playClick(); setTimeOfDay('day'); }}
              className={`px-2.5 py-1 rounded-lg transition ${timeOfDay === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              title="Daytime"
            >
              <Sun className="w-3.5 h-3.5 inline" /> Day
            </button>
            <button
              onClick={() => { sfx.playClick(); setTimeOfDay('sunset'); }}
              className={`px-2.5 py-1 rounded-lg transition ${timeOfDay === 'sunset' ? 'bg-amber-600 text-slate-950 font-bold' : 'text-slate-400'}`}
              title="Sunset"
            >
              🌅 Sunset
            </button>
            <button
              onClick={() => { sfx.playClick(); setTimeOfDay('night'); }}
              className={`px-2.5 py-1 rounded-lg transition ${timeOfDay === 'night' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              title="Nighttime"
            >
              <Moon className="w-3.5 h-3.5 inline" /> Night
            </button>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              setWeather((w) => (w === 'clear' ? 'rain' : w === 'rain' ? 'magic' : 'clear'));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5 font-bold"
          >
            {weather === 'clear' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {weather === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-400" />}
            {weather === 'magic' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
            <span className="capitalize">{weather} Weather</span>
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Element */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 relative">
        <canvas
          ref={canvasRef}
          width={760}
          height={380}
          className="w-full h-auto block image-rendering-pixelated"
        />
        
        {/* Banner Overlay */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-slate-950/85 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-3">
          {activeRaidMonster ? (
            <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> 🚨 {activeRaidMonster.name} ATTACKING CITADEL WALL! (-5 HP/1.5 sec)
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              🛡️ Kingdom Peaceful | Citadel Wall HP: {wallHp}/100
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
