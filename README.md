# Focus Quest ⚔️🏰

> **Gamified Deep-Work RPG Productivity App** based on the Pomodoro Principle.

Focus Quest turns standard Pomodoro focus sessions into an interactive pixel-art RPG quest. Complete focus sprints, earn resources (Gold, Wood, Stone & XP), construct kingdom buildings with passive yield multipliers, and defend your Citadel against distraction monster raids in real-time!

---

## 🌟 Key Features

* ⚔️ **Focus Sprints = RPG Resources:** Every 25-minute focus session awards XP, Gold, Wood, and Stone. Completing sessions levels up your hero from *Apprentice Knight* to higher ranks.
* 🚨 **Rapid Monster Raids & Citadel Wall HP:** Logging a distraction spawns an attacking monster (*Distraction Beast 👹*) that actively raids your kingdom, firing rapid fireballs that degrade Citadel Wall HP (-5 HP / 1.5s) with screen-shake animations.
* 🛡️ **Defend & Reflect:** Writing a 1-sentence action plan slays the monster, stops wall HP degradation, restores +20 Wall HP, and awards +20 Gold.
* 🔨 **Kingdom Building & Yield Multipliers:** Spend resources in the Shop to construct structures:
  * 🪵 **Lumber Mill:** Boosts Wood yield (+25%/tier)
  * 🪨 **Stone Quarry:** Boosts Stone yield (+25%/tier)
  * ⚔️ **Knight Barracks:** Boosts XP yield (+20%/tier)
  * 🧙‍♂️ **Wizard Tower:** Boosts Gold yield (+30%/tier)
  * 🏰 **Grand Citadel:** Boosts ALL yields (+50%/tier)
* 🎵 **Procedural Web Audio Soundscapes:** 100% in-browser synthesized background loops (Rain & Thunder, Cozy Tavern, Synthwave Drones, 10Hz Binaural Alpha Beats) without needing external MP3 downloads.
* 🗺️ **Interactive 2D Pixel Canvas Map:** View your realm live on a 60 FPS HTML5 Canvas featuring constructed buildings, day/sunset/night lighting cycles, weather particle effects, and a patrolling hero knight.
* 🏆 **Trophies & Focus Analytics:** Track total focus hours, sprint counts, a 7-day productivity heatmap, and a Focus Purity Score %.

---

## 🤖 Built with Antigravity AI (Human-in-the-Loop)

Focus Quest was developed in a short sprint pairing step-by-step with **Google Antigravity AI**:

* **Human-in-the-Loop (HITL) Role:** Setting the game concept, testing real-time browser UX, steering mechanics (like making monster attacks actively damage Citadel HP in real time), and refining visual polish.
* **Antigravity AI Role:** Fast technical execution—writing procedural Web Audio synthesis algorithms, coding 60 FPS HTML5 Canvas 2D math, setting up Tailwind styling, and managing React state persistence.

---

## ⚡ Tech Stack

* **Frontend Framework:** React 19 + Vite 8
* **Styling:** Tailwind CSS v4 + Lucide React Icons + Canvas Confetti
* **Audio Engine:** Pure Web Audio API (`soundscape.js` & `sfx.js`)
* **Graphics Engine:** Native HTML5 2D Canvas API (`KingdomCanvas.jsx`)
* **State Persistence:** LocalStorage

---

## 🚀 Quick Start

### Prerequisites
* Node.js (v18+)
* npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/focus-quest.git
   cd focus-quest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📜 License

MIT License. Built just for fun!
