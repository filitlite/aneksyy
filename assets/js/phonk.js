/* ============================================================
   phonk.js — WebAudio phonk engine (no external files)
   modes: EDIT (real edit audio) | PHONK | UNRAVEL | RIZE
   ============================================================ */
(function () {
  'use strict';

  const AW = {
    ctx: null, master: null, comp: null, delay: null, verb: null,
    playing: false, mode: 'edit', timer: null, step: 0, nextTime: 0,
    bpm: 82, analyser: null, vol: 0.65, seed: 1337,
    arp: [0, 3, 7, 10, 12, 10, 7, 3], arpIdx: 0,
    // --- edit track ---
    editEl: null, editSrc: null, editGain: null, editStartAt: 0, editOffset: 0
  };

  // ---- deterministic PRNG so the "track" is stable per loop ----
  function rnd() {
    AW.seed = (AW.seed * 1103515245 + 12345) & 0x7fffffff;
    return AW.seed / 0x7fffffff;
  }

  function N(semi) { return 55 * Math.pow(2, semi / 12); } // freq from semitone above A1

  function init() {
    if (AW.ctx) return;
    const C = window.AudioContext || window.webkitAudioContext;
    AW.ctx = new C();
    const ctx = AW.ctx;

    AW.master = ctx.createGain();
    AW.master.gain.value = AW.vol;

    AW.comp = ctx.createDynamicsCompressor();
    AW.comp.threshold.value = -14; AW.comp.ratio.value = 5; AW.comp.knee.value = 8;

    AW.analyser = ctx.createAnalyser();
    AW.analyser.fftSize = 256;

    AW.delay = ctx.createDelay(1.0);
    AW.delay.delayTime.value = 0.32;
    const fb = ctx.createGain(); fb.gain.value = 0.34;
    AW.delay.connect(fb); fb.connect(AW.delay);

    // tiny algorithmic reverb (noise burst convolver)
    AW.verb = ctx.createConvolver();
    const len = ctx.sampleRate * 1.4;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    AW.verb.buffer = buf;
    const vg = ctx.createGain(); vg.gain.value = 0.16;
    AW.verb.connect(vg);

    AW.master.connect(AW.comp);
    AW.comp.connect(AW.analyser);
    AW.analyser.connect(ctx.destination);
    AW.delay.connect(AW.master);
    vg.connect(AW.master);
  }

  // ---------- instruments ----------
  function g(t, a, d, peak) {
    const ctx = AW.ctx, gn = ctx.createGain();
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.linearRampToValueAtTime(peak, t + a);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    return gn;
  }

  function kick(t, rel) {
    const ctx = AW.ctx, o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(rel ? 36 : 44, t + 0.1);
    const gn = g(t, 0.002, rel ? 0.42 : 0.3, 1.15);
    o.connect(gn); gn.connect(AW.master);
    o.start(t); o.stop(t + 0.6);
  }

  function sub808(t, semi, dur) {
    const ctx = AW.ctx, o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(N(semi) * 2, t);
    o.frequency.exponentialRampToValueAtTime(N(semi), t + 0.06);
    const gn = g(t, 0.008, dur, 0.85);
    o.connect(gn); gn.connect(AW.master);
    o.start(t); o.stop(t + dur + 0.1);
  }

  function cowbell(t, gain) {
    const ctx = AW.ctx;
    [541, 802].forEach(f => {
      const o = ctx.createOscillator();
      o.type = 'square'; o.frequency.value = f;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 640; bp.Q.value = 2.2;
      const gn = g(t, 0.001, 0.14, (gain || 0.5) * 0.5);
      o.connect(bp); bp.connect(gn); gn.connect(AW.master);
      gn.connect(AW.delay);
      o.start(t); o.stop(t + 0.2);
    });
  }

  function hat(t, open) {
    const ctx = AW.ctx, b = ctx.createBuffer(1, 2205, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < 2205; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / 2205, 2);
    const s = ctx.createBufferSource(); s.buffer = b;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 7500;
    const gn = g(t, 0.001, open ? 0.16 : 0.045, open ? 0.4 : 0.25);
    s.connect(hp); hp.connect(gn); gn.connect(AW.master);
    s.start(t);
  }

  function snare(t) {
    const ctx = AW.ctx, b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.6);
    const s = ctx.createBufferSource(); s.buffer = b;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.8;
    const gn = g(t, 0.001, 0.16, 0.7);
    s.connect(bp); bp.connect(gn); gn.connect(AW.master); gn.connect(AW.verb);
    s.start(t);
  }

  function keys(t, semi, dur, wave, gain, pan) {
    const ctx = AW.ctx, o = ctx.createOscillator();
    o.type = wave || 'triangle';
    o.frequency.value = N(semi + 24);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 2600;
    const gn = g(t, 0.01, dur, gain || 0.3);
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (p) { p.pan.value = pan || 0; o.connect(f); f.connect(gn); gn.connect(p); p.connect(AW.master); p.connect(AW.verb); }
    else { o.connect(f); f.connect(gn); gn.connect(AW.master); gn.connect(AW.verb); }
    o.start(t); o.stop(t + dur + 0.15);
  }

  function pad(t, semis, dur) {
    semis.forEach((s, i) => keys(t, s, dur, 'sawtooth', 0.09, (i % 2 ? 0.4 : -0.4)));
  }

  function sweep(t) {
    const ctx = AW.ctx, o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(80, t);
    o.frequency.exponentialRampToValueAtTime(1800, t + 1.6);
    const gn = g(t, 0.4, 1.4, 0.12);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900;
    o.connect(f); f.connect(gn); gn.connect(AW.master); gn.connect(AW.verb);
    o.start(t); o.stop(t + 2);
  }

  // ---------- EDIT track (real edit audio, looped, routed through analyser) ----------
  function startEdit(t0) {
    stopEdit();
    const el = new Audio('assets/edit-audio.mp3');
    el.loop = true; el.crossOrigin = 'anonymous'; el.preload = 'auto';
    const src = AW.ctx.createMediaElementSource(el);
    const gn = AW.ctx.createGain(); gn.gain.value = 1.0;
    src.connect(gn); gn.connect(AW.master); gn.connect(AW.verb);
    AW.editEl = el; AW.editSrc = src; AW.editGain = gn;
    el.currentTime = AW.editOffset % (el.duration || 53.87 || 1);
    AW.editStartAt = AW.ctx.currentTime;
    // аудио-элемент <audio> подчиняетсяautoplay-политике браузера отдельно
    // от WebAudio: если он упал в паузу, дожимаем при каждом старте
    const p = el.play();
    if (p) p.catch(() => {});
  }
  function editForcePlay() {
    if (AW.playing && AW.mode === 'edit' && AW.editEl && AW.editEl.paused) {
      const p = AW.editEl.play();
      if (p) p.catch(() => {});
    }
  }
  function stopEdit() {
    if (AW.editEl) {
      AW.editOffset = (AW.editEl.currentTime || 0);
      try { AW.editEl.pause(); } catch (e) {}
      try { AW.editSrc.disconnect(); } catch (e) {}
      AW.editEl.src = ''; // free decoder
      AW.editEl = null; AW.editSrc = null; AW.editGain = null;
    }
  }

  // ---------- sequencer ----------
  const SIX = 60 / AW.bpm / 4; // sixteenth

  function schedule() {
    const ctx = AW.ctx;
    while (AW.nextTime < ctx.currentTime + 0.25) {
      const t = AW.nextTime, s = AW.step % 64;
      if (AW.mode === 'phonk') stepPhonk(t, s);
      else if (AW.mode === 'unravel') stepUnravel(t, s);
      else if (AW.mode === 'rize') stepRize(t, s);
      // mode 'edit': real audio plays via <audio>, sequencer idle
      AW.nextTime += SIX; AW.step++;
    }
  }

  function loop4() {
    if (AW.step % 256 === 0) { AW.seed = 1337; if (AW.mode === 'phonk') sweep(AW.ctx.currentTime + 0.05); }
  }

  // PHONK: half-time memphis
  function stepPhonk(t, s) {
    if (s % 16 === 0) kick(t, s === 0);
    if (s % 16 === 10) kick(t, false);
    if (s % 8 === 4) snare(t);
    if (s % 2 === 0) hat(t, s % 8 === 6);
    const cowPat = [0, 6, 10, 12, 16, 22, 26, 28, 32, 38, 42, 44, 48, 54, 58, 60];
    if (cowPat.includes(s)) cowbell(t, s % 16 === 0 ? 0.6 : 0.42);
    const roots = [-31, -31, -34, -29]; // A1 A1 C2 G1
    if (s % 16 === 0) sub808(t, roots[(s / 16) | 0], 1.9);
    if (s % 16 === 10) sub808(t, roots[(s / 16) | 0], 1.2);
    if (s % 4 === 2) { // dark arp
      const sc = [0, 3, 5, 7, 10];
      const root = roots[(s / 16) | 0] + 12;
      keys(t, root + sc[(rnd() * sc.length) | 0], 0.5, 'square', 0.14, rnd() * 1.4 - 0.7);
    }
    if (s === 0) pad(t, [-12, -8, -5, 0], 3.4);
    loop4();
  }

  // UNRAVEL: melancholic arpeggio, 6/8 feel
  const UNR = [
    [0, 7, 12, 16, 12, 7], [ -2, 5, 10, 14, 10, 5],
    [ -4, 3, 8, 12, 8, 3], [ -5, 2, 7, 11, 7, 2]
  ];
  function stepUnravel(t, s) {
    if (s % 48 === 0) kick(t, true);
    if (s % 48 === 28) kick(t, false);
    if (s % 24 === 12) snare(t);
    if (s % 4 === 2) hat(t, false);
    const bar = ((s / 12) | 0) % 4, pos = s % 12;
    if (pos < 6) {
      const chord = UNR[bar];
      keys(t, chord[pos] - 5, 0.9, 'triangle', 0.26, pos % 2 ? 0.35 : -0.35);
    }
    if (s % 48 === 0) pad(t, [-17, -10, -5], 3.8);
    if (s % 96 === 48) keys(t, 12, 2.2, 'sine', 0.2, 0); // high cry
    loop4();
  }

  // RIZE: ominous ambient, slow beats, whispers of cowbell
  function stepRize(t, s) {
    if (s % 32 === 0) kick(t, true);
    if (s % 32 === 20) kick(t, false);
    if (s % 32 === 12) snare(t);
    if (s % 8 === 4) hat(t, s % 32 === 28);
    if (s % 16 === 8) cowbell(t, 0.22);
    if (s % 32 === 0) sub808(t, -36, 3.4); // E1 drone
    if (s % 64 === 0) pad(t, [-24, -17, -12], 6.5);
    if (s % 16 === 13 && rnd() > 0.5) keys(t, -1 + [0, 1, 5][(rnd() * 3) | 0], 1.6, 'sine', 0.16, rnd() * 1.6 - 0.8);
    loop4();
  }

  function start() {
    init();
    if (AW.ctx.state === 'suspended') AW.ctx.resume();
    if (AW.playing) return;
    AW.playing = true;
    AW.nextTime = AW.ctx.currentTime + 0.08;
    if (AW.mode === 'edit') startEdit();
    AW.timer = setInterval(schedule, 60);
  }

  function stop() {
    AW.playing = false;
    stopEdit();
    if (AW.timer) clearInterval(AW.timer);
    AW.timer = null;
  }

  function setMode(m) {
    const prev = AW.mode;
    AW.mode = m;
    if (AW.playing) {
      if (m === 'edit' && prev !== 'edit') startEdit();
      if (prev === 'edit' && m !== 'edit') stopEdit();
    }
  }
  function setVol(v) { AW.vol = v; if (AW.master) AW.master.gain.value = v; }

  // ---------- SFX ----------
  function tick() { // 1000-7 counter tick
    init(); if (AW.ctx.state === 'suspended') AW.ctx.resume();
    const t = AW.ctx.currentTime;
    cowbell(t, 0.5); hat(t, false);
  }
  function glitchBurst() {
    init(); if (AW.ctx.state === 'suspended') AW.ctx.resume();
    const ctx = AW.ctx, t = ctx.currentTime;
    const b = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() > 0.86 ? 1 : 0.25) * Math.pow(1 - i / d.length, 1.2);
    const s = ctx.createBufferSource(); s.buffer = b;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.6;
    const gn = g(t, 0.001, 0.3, 0.5);
    s.connect(bp); bp.connect(gn); gn.connect(AW.master);
    s.start(t);
  }
  function kagune(type) { // rize/kagune swipe sfx
    init(); if (AW.ctx.state === 'suspended') AW.ctx.resume();
    const ctx = AW.ctx, t = ctx.currentTime, o = ctx.createOscillator();
    o.type = 'sawtooth';
    const f0 = type === 'kill' ? 90 : 600;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(type === 'kill' ? 700 : 90, t + 0.28);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 3;
    const gn = g(t, 0.004, 0.3, 0.5);
    o.connect(bp); bp.connect(gn); gn.connect(AW.master); gn.connect(AW.verb);
    o.start(t); o.stop(t + 0.4);
  }
  function scannerBeep(final) {
    init(); if (AW.ctx.state === 'suspended') AW.ctx.resume();
    const ctx = AW.ctx, t = ctx.currentTime, o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.value = final ? (880 * Math.pow(2, 5 / 12)) : 660;
    const gn = g(t, 0.004, final ? 0.5 : 0.09, 0.3);
    o.connect(gn); gn.connect(AW.master); gn.connect(AW.delay);
    o.start(t); o.stop(t + 0.6);
  }

  window.PHONK = {
    start, stop, setMode, setVol, tick, glitchBurst, kagune, scannerBeep, editForcePlay,
    get analyser() { return AW.analyser; },
    get playing() { return AW.playing; },
    get mode() { return AW.mode; },
    get ctx() { return AW.ctx; }
  };
})();
