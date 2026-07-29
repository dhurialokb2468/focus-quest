// Procedural Web Audio Ambient Soundscape Generator
// Zero external mp3 dependencies, 100% client-side synthesized

class SoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.tracks = {
      rain: { active: false, volume: 0.5, nodes: null },
      coffee: { active: false, volume: 0.4, nodes: null },
      synthwave: { active: false, volume: 0.4, nodes: null },
      binaural: { active: false, volume: 0.3, nodes: null }
    };
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 1;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  // --- 1. RAIN SYNTHESIZER ---
  startRain() {
    this.init();
    if (!this.ctx || this.tracks.rain.nodes) return;

    // Buffer for 5 seconds of pink noise
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // scale down
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Low pass filter for heavy rain rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.value = this.tracks.rain.volume;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    this.tracks.rain.nodes = { noise, filter, gain };
    this.tracks.rain.active = true;
  }

  stopRain() {
    if (this.tracks.rain.nodes) {
      try {
        this.tracks.rain.nodes.noise.stop();
        this.tracks.rain.nodes.noise.disconnect();
      } catch (e) {}
      this.tracks.rain.nodes = null;
    }
    this.tracks.rain.active = false;
  }

  setRainVolume(vol) {
    this.tracks.rain.volume = vol;
    if (this.tracks.rain.nodes && this.ctx) {
      this.tracks.rain.nodes.gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // --- 2. COFFEE SHOP AMBIANCE ---
  startCoffee() {
    this.init();
    if (!this.ctx || this.tracks.coffee.nodes) return;

    // Multi-layered low rumble + bandpass filters simulating distant murmur
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 400;
    filter1.Q.value = 1.5;

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.value = 900;

    const gain = this.ctx.createGain();
    gain.gain.value = this.tracks.coffee.volume * 0.8;

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    this.tracks.coffee.nodes = { noise, filter1, filter2, gain };
    this.tracks.coffee.active = true;
  }

  stopCoffee() {
    if (this.tracks.coffee.nodes) {
      try {
        this.tracks.coffee.nodes.noise.stop();
        this.tracks.coffee.nodes.noise.disconnect();
      } catch (e) {}
      this.tracks.coffee.nodes = null;
    }
    this.tracks.coffee.active = false;
  }

  setCoffeeVolume(vol) {
    this.tracks.coffee.volume = vol;
    if (this.tracks.coffee.nodes && this.ctx) {
      this.tracks.coffee.nodes.gain.gain.setValueAtTime(vol * 0.8, this.ctx.currentTime);
    }
  }

  // --- 3. SYNTHWAVE FOCUS DRONE ---
  startSynthwave() {
    this.init();
    if (!this.ctx || this.tracks.synthwave.nodes) return;

    // Dual detuned saw oscillators + LFO low-pass sweep
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.value = 110; // A2
    osc2.frequency.value = 110.8; // Slightly detuned for warm analog feel

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;
    filter.Q.value = 3;

    // LFO to slowly sweep filter frequency
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // 0.15 Hz slow sweep

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 200; // Sweep range

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.value = this.tracks.synthwave.volume * 0.25; // Keep gentle

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    lfo.start();

    this.tracks.synthwave.nodes = { osc1, osc2, lfo, lfoGain, filter, gain };
    this.tracks.synthwave.active = true;
  }

  stopSynthwave() {
    if (this.tracks.synthwave.nodes) {
      try {
        this.tracks.synthwave.nodes.osc1.stop();
        this.tracks.synthwave.nodes.osc2.stop();
        this.tracks.synthwave.nodes.lfo.stop();
      } catch (e) {}
      this.tracks.synthwave.nodes = null;
    }
    this.tracks.synthwave.active = false;
  }

  setSynthwaveVolume(vol) {
    this.tracks.synthwave.volume = vol;
    if (this.tracks.synthwave.nodes && this.ctx) {
      this.tracks.synthwave.nodes.gain.gain.setValueAtTime(vol * 0.25, this.ctx.currentTime);
    }
  }

  // --- 4. BINAURAL ALPHA WAVE (10 Hz Beat) ---
  startBinaural() {
    this.init();
    if (!this.ctx || this.tracks.binaural.nodes) return;

    // Stereo panner for 432 Hz Left and 442 Hz Right (10Hz Alpha Focus Difference)
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();

    oscL.type = 'sine';
    oscR.type = 'sine';

    oscL.frequency.value = 216; // 216 Hz Left
    oscR.frequency.value = 226; // 226 Hz Right (10 Hz diff)

    const panL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const panR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    if (panL && panR) {
      panL.pan.value = -1;
      panR.pan.value = 1;
    }

    const gain = this.ctx.createGain();
    gain.gain.value = this.tracks.binaural.volume * 0.2;

    if (panL && panR) {
      oscL.connect(panL);
      panL.connect(gain);
      oscR.connect(panR);
      panR.connect(gain);
    } else {
      oscL.connect(gain);
      oscR.connect(gain);
    }

    gain.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.tracks.binaural.nodes = { oscL, oscR, gain };
    this.tracks.binaural.active = true;
  }

  stopBinaural() {
    if (this.tracks.binaural.nodes) {
      try {
        this.tracks.binaural.nodes.oscL.stop();
        this.tracks.binaural.nodes.oscR.stop();
      } catch (e) {}
      this.tracks.binaural.nodes = null;
    }
    this.tracks.binaural.active = false;
  }

  setBinauralVolume(vol) {
    this.tracks.binaural.volume = vol;
    if (this.tracks.binaural.nodes && this.ctx) {
      this.tracks.binaural.nodes.gain.gain.setValueAtTime(vol * 0.2, this.ctx.currentTime);
    }
  }

  stopAll() {
    this.stopRain();
    this.stopCoffee();
    this.stopSynthwave();
    this.stopBinaural();
  }
}

export const soundscape = new SoundscapeEngine();
