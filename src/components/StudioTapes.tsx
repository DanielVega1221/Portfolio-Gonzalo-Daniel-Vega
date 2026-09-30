import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { useT } from '../i18n/useT';
import { ui } from '../i18n/translations';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { studioTapes, Tape } from '../data/studioTapes';
import { safeGet, safeSet, safeRemove } from '../lib/safeStorage';

// Procedural Analog Sound Synthesizer for buttons, tapes, and ambient warm tape hiss
class AnalogSynth {
  private ctx: AudioContext | null = null;
  private hissSource: AudioBufferSourceNode | null = null;
  private hissGain: GainNode | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) this.ctx = new AudioCtor();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch { /* ignore */ }
  }

  playHeavyClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch { /* ignore */ }
  }

  playInsert() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      
      // Spring mechanical click
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(95, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.14);
      
      osc2.frequency.setValueAtTime(180, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.09);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    } catch { /* ignore */ }
  }

  playEject() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch { /* ignore */ }
  }

  startHiss() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      if (this.hissSource) return;
      
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(450, ctx.currentTime);
      bpf.Q.setValueAtTime(0.4, ctx.currentTime);
      
      this.hissGain = ctx.createGain();
      this.hissGain.gain.setValueAtTime(0.003, ctx.currentTime); // subtle, ambient
      
      noiseNode.connect(filter);
      filter.connect(bpf);
      bpf.connect(this.hissGain);
      this.hissGain.connect(ctx.destination);
      
      noiseNode.start();
      this.hissSource = noiseNode;
    } catch { /* ignore */ }
  }

  stopHiss() {
    if (this.hissSource) {
      try {
        this.hissSource.stop();
      } catch { /* ignore */ }
      this.hissSource = null;
      this.hissGain = null;
    }
  }

  dispose() {
    try {
      if (this.hissSource) {
        this.hissSource.stop();
        this.hissSource = null;
        this.hissGain = null;
      }
      if (this.ctx) {
        void this.ctx.close();
        this.ctx = null;
      }
    } catch { /* ignore */ }
  }
}

// Module-level: createMediaElementSource can only bind to a given <audio> element once.
// Track the element we wired so a genuine remount (new element) is wired again.
let _wiredElement: HTMLAudioElement | null = null;

// Global single instance of our synthesizer
const synth = new AnalogSynth();

export default function StudioTapes() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTape, setActiveTape] = useState<Tape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState(false);

  // Drag overlap alert
  const [isOverSlot, setIsOverSlot] = useState(false);
  const [isInserting, setIsInserting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const insertTimerRef = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const { lang } = useLanguage();
  const t = useT();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close the drawer with Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Clear insertion timer on unmount
  useEffect(() => {
    return () => {
      if (insertTimerRef.current !== null) {
        window.clearTimeout(insertTimerRef.current);
      }
    };
  }, []);

  // Load state from localStorage on init
  useEffect(() => {
    const savedTapeId = safeGet('st_tape_id');
    const savedTime = safeGet('st_time');
    const savedVolume = safeGet('st_volume');

    if (savedTapeId) {
      const tape = studioTapes.find(t => t.id === savedTapeId);
      if (tape) {
        setActiveTape(tape);
      }
    }
    if (savedTime) {
      setCurrentTime(parseFloat(savedTime));
    }
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Persist values on change
  useEffect(() => {
    if (activeTape) {
      safeSet('st_tape_id', activeTape.id);
    } else {
      safeRemove('st_tape_id');
    }
  }, [activeTape]);

  useEffect(() => {
    safeSet('st_time', currentTime.toString());
  }, [currentTime]);

  useEffect(() => {
    safeSet('st_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Wire an AudioContext + MediaElementSource to the <audio> once. The element guard
  // skips already-wired elements (Strict Mode dev remount) and re-wires new elements
  // after a genuine remount, then tears everything down on unmount.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || _wiredElement === audio) return;

    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    try {
      const ctx = new AudioCtor();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      sourceRef.current = source;
      analyserRef.current = analyser;
      _wiredElement = audio;
    } catch {
      // Strict Mode dev remount: element already connected. Native audio works fine.
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const ctx = audioCtxRef.current;
      if (ctx) {
        void ctx.close();
        audioCtxRef.current = null;
        sourceRef.current = null;
        analyserRef.current = null;
        _wiredElement = null;
      }
      synth.dispose();
    };
  }, []);

  // Visualizer draw loop: starts/stops with playback
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx = audioCtxRef.current;

    if (!isPlaying || !activeTape || audioError || !canvas || !analyser || !ctx) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const canvasCtx = canvas?.getContext('2d');
      if (canvas && canvasCtx) canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvasCtx = canvas.getContext('2d')!;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      canvasCtx.clearRect(0, 0, width, height);

      const barCount = 20;
      const barWidth = (width / barCount) * 0.7;
      const gap = width / barCount / 3;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] || 0;
        }
        const avg = sum / step / 255;
        const barHeight = Math.max(2, avg * height * 0.9);
        const x = i * (barWidth + gap) + gap;
        const y = height - barHeight;

        const gradient = canvasCtx.createLinearGradient(x, y, x, height);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.15)');

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, activeTape, audioError]);
  useEffect(() => {
    if (!isPlaying || !activeTape || !audioError) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1;
        if (next >= activeTape.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, activeTape, audioError]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && activeTape) {
      synth.startHiss();
      if (audio.src !== activeTape.audioFile) {
        audio.src = activeTape.audioFile;
        audio.load();
      }
      audio.volume = volume;
      if (currentTime > 0.5) {
        audio.currentTime = currentTime;
      }
      audio.play().catch(() => setAudioError(true));
    } else {
      synth.stopHiss();
      audio.pause();
    }
    // Intentional: volume/currentTime restore only on (re)start, not on every timeupdate/volume change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, activeTape]);

  // Action Handlers
  const handleInsertTape = (tape: Tape) => {
    if (isInserting) return;
    setIsInserting(true);
    synth.playInsert();
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
    insertTimerRef.current = window.setTimeout(() => {
      setActiveTape(tape);
      setCurrentTime(0);
      setAudioDuration(tape.durationSeconds);
      setAudioError(false);
      setIsInserting(false);
    }, 400);
  };

  const handlePlay = () => {
    if (!activeTape) return;
    synth.playHeavyClick();
    setAudioError(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    synth.playClick();
    setIsPlaying(false);
    // save current position
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleStop = () => {
    synth.playHeavyClick();
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleEject = () => {
    if (!activeTape) return;
    synth.playEject();
    setIsPlaying(false);
    setActiveTape(null);
    setCurrentTime(0);
    setAudioDuration(0);
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
  };

  // Convert seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Drag logic
  const handleDragEnd = (info: PanInfo, tape: Tape) => {
    setIsOverSlot(false);
    const slotElement = document.getElementById('cassette-slot');
    if (!slotElement) return;

    const rect = slotElement.getBoundingClientRect();
    const x = info.point.x;
    const y = info.point.y;

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      handleInsertTape(tape);
    }
  };

  const handleDragUpdate = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const slotElement = document.getElementById('cassette-slot');
    if (!slotElement) return;

    const rect = slotElement.getBoundingClientRect();
    const x = info.point.x;
    const y = info.point.y;

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      setIsOverSlot(true);
    } else {
      setIsOverSlot(false);
    }
  };

  return (
    <>
      {/* Hidden audio tag */}
      <audio 
        ref={audioRef} 
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setAudioError(true);
          if (import.meta.env.DEV) console.warn('[StudioTapes] Audio file not found or unplayable');
        }}
        preload="none"
      />

      {/* 1. BOTTOM RIGHT FLOATING BUTTON */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => {
            synth.playClick();
            setIsOpen(!isOpen);
          }}
          className="relative flex items-center gap-2 md:gap-2.5 bg-[#f9f7f2] hover:bg-[#fffef0] border border-[#e5e2de] hover:border-[#1a1a1a]/20 px-2.5 md:px-3.5 py-2 md:py-2.5 rounded-sm shadow-xs transition-all duration-300 group"
          aria-label="Abrir Studio Tapes"
          id="studio-tapes-trigger"
        >
          {/* Subtle spinning indicator when playing */}
          <div className="relative w-3.5 md:w-4 h-2 md:h-2.5 flex items-center justify-between border border-[#1a1a1a]/60 px-0.5 rounded-[1px]">
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-1 h-1 rounded-full border-t border-r border-[#1a1a1a]/60"
            />
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-1 h-1 rounded-full border-t border-r border-[#1a1a1a]/60"
            />
          </div>
          
          <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-[#1a1a1a] font-medium">
            {isPlaying ? t(ui.studioTapes.playing) : t(ui.studioTapes.tapes)}
          </span>

          {activeTape && (
            <span className="hidden md:inline font-serif text-[10px] italic text-[#a84432] border-l border-[#1a1a1a]/10 pl-2 max-w-[120px] truncate">
              {activeTape.subtitle}
            </span>
          )}
        </button>
      </div>

      {/* 2. SLIDING DRAWER PANEL (From bottom of viewport, looking like a physical desk drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 130 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#f9f7f2] border-t border-[#e5e2de] shadow-xl overflow-hidden"
            id="studio-tapes-drawer"
            style={{ maxHeight: '85vh' }}
            role="dialog"
            aria-modal="true"
            aria-label="Studio Tapes"
          >
            {/* Wooden top-lip or paper craft border accent */}
            <div className="h-1 bg-[#a84432]" />

            <div className="max-w-5xl mx-auto p-3 md:p-5 space-y-3 md:space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 4px)' }}>
              
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b border-[#1a1a1a]/10 pb-2 md:pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a84432]" />
                    <h3 className="font-serif text-sm md:text-lg font-light tracking-tight text-[#1a1a1a]">
                      STUDIO TAPES
                    </h3>
                  </div>
                  <p className="hidden md:block font-mono text-[8px] text-[#777] uppercase tracking-widest">
                    {t(ui.studioTapes.subtitle)}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() => {
                      synth.playClick();
                      setIsOpen(false);
                    }}
                    aria-label={t(ui.a11y.close)}
                    autoFocus
                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#666] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 text-[9px] md:text-[10px] transition-all"
                    id="close-drawer-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Grid content: Player Deck on top for mobile, side-by-side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Mobile-first: Player Deck first (so drop target is visible) */}
                <div className="md:col-span-5 md:order-last space-y-3.5">
                  <span className="font-mono text-[9px] text-[#a84432] font-semibold tracking-wider block">
                    {t(ui.studioTapes.player)}
                  </span>

                  {/* Physical Walkman/Deck Body */}
                  <div className="bg-[#161513] text-[#f9f7f2] p-4 md:p-5 rounded-xs border border-[#2b2724] shadow-xl space-y-3 md:space-y-4 relative overflow-hidden">
                    {/* Metal sheen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* Display window */}
                    <div className="bg-[#0b0a09] border border-[#2d2824] p-2.5 md:p-3 rounded-sm font-mono text-[10px] text-amber-400 space-y-1.5 md:space-y-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.95)] relative">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,13,0)_95%,rgba(0,0,0,0.35)_95%)] bg-[size:100%_4px] pointer-events-none rounded-sm" />
                      
                      <div className="flex justify-between items-center text-[8px] text-amber-600/60 uppercase tracking-widest font-semibold">
                        <span>SIGNAL SYSTEM</span>
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]' : 'bg-neutral-800'}`} />
                          {isPlaying ? t(ui.studioTapes.play) : t(ui.studioTapes.standby)}
                        </span>
                      </div>
                      
                      {activeTape ? (
                        <div className="space-y-1">
                          <div className="text-amber-300 font-bold uppercase truncate tracking-wide text-xs">
                            {activeTape.subtitle}
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-amber-500/80 pt-0.5 border-t border-amber-950/40">
                            <span className="opacity-70 font-sans tracking-wide">Tape: {activeTape.title}</span>
                            <span className="font-mono bg-amber-950/30 px-1 py-0.5 rounded-[1px] text-amber-400 font-bold tracking-widest">
                              {formatTime(currentTime)}
                            </span>
                          </div>
                          {audioError && (
                            <div className="text-[8px] text-red-400 font-mono uppercase tracking-wider mt-1">
                              ⚠ {t(ui.studioTapes.noFile)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-amber-700/40 py-2 uppercase tracking-widest text-[9px] font-bold">
                            {t(ui.studioTapes.noTape)}
                        </div>
                      )}

                      {/* Visualizer canvas */}
                      <canvas
                        ref={canvasRef}
                        width={280}
                        height={40}
                        className="w-full h-10 rounded-[2px] opacity-80"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>

                    {/* Cassette Entry Slot */}
                    <div 
                      id="cassette-slot"
                      className={`relative h-16 md:h-20 rounded-xs border transition-all duration-300 flex items-center justify-center overflow-hidden ${
                        isOverSlot 
                          ? 'border-[#a84432] bg-[#a84432]/10 scale-102 shadow-[0_0_12px_rgba(168,68,50,0.2)]' 
                          : activeTape 
                            ? 'border-[#2d2d2d] bg-[#0c0b0a]' 
                            : 'border-dashed border-[#3a3530] bg-[#11100f] hover:bg-[#151413]'
                      }`}
                    >
                      {activeTape && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/30 to-transparent blur-[1px]" />
                      )}

                      <AnimatePresence mode="wait">
                        {isInserting ? (
                          <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="text-[#a84432] font-mono text-[10px] uppercase font-bold tracking-widest"
                          >
                            {t(ui.studioTapes.inserting)}
                          </motion.div>
                        ) : activeTape ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-1.5 md:inset-2 rounded-xs border border-white/5 p-2 flex items-center justify-between shadow-inner"
                            style={{ 
                              backgroundColor: activeTape.coverColor,
                              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' 
                            }}
                          >
                            <div className="text-left pl-1">
                              <span className="font-mono text-[7px] text-white/50 block tracking-widest uppercase font-semibold">
                                {activeTape.title}
                              </span>
                              <span className="font-serif text-[10px] font-bold text-white tracking-tight leading-none block truncate max-w-[100px] md:max-w-[130px] mt-0.5">
                                {activeTape.subtitle}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3.5 mr-0.5 md:mr-1">
                              <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full border border-black/30 bg-black/50 flex items-center justify-center">
                                <motion.div 
                                  animate={isPlaying ? { rotate: 360 } : {}}
                                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                                  className="w-4 md:w-5 h-4 md:h-5 rounded-full border-t border-r border-b border-dashed border-white/30"
                                />
                                <div className="absolute inset-2 md:inset-2.5 bg-[#0c0b0a] rounded-full border border-white/10" />
                              </div>
                              <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full border border-black/30 bg-black/50 flex items-center justify-center">
                                <motion.div 
                                  animate={isPlaying ? { rotate: 360 } : {}}
                                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                                  className="w-4 md:w-5 h-4 md:h-5 rounded-full border-t border-r border-b border-dashed border-white/30"
                                />
                                <div className="absolute inset-2 md:inset-2.5 bg-[#0c0b0a] rounded-full border border-white/10" />
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center space-y-1 text-[#666] select-none px-2">
                            <p className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-amber-600/30 font-bold">
                              {t(ui.studioTapes.slot)}
                            </p>
                            <p className="text-[8px] md:text-[9px] font-sans text-neutral-500 italic">
                              {t(ui.studioTapes.slotHint)}
                            </p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    {activeTape && (
                      <div className="space-y-1 pt-0.5 md:pt-1">
                        <div className="flex justify-between font-mono text-[7px] md:text-[8px] text-neutral-500 tracking-wider">
                          <span>{t(ui.studioTapes.timeElapsed)}</span>
                          <span>{t(ui.studioTapes.timeRemaining)}</span>
                        </div>
                        <div className="relative h-1 bg-[#1c1a18] rounded-full overflow-hidden border border-neutral-900 shadow-inner">
                          <div 
                            className="h-full bg-amber-500 shadow-[0_0_6px_#f59e0b] transition-all duration-300"
                            style={{ width: `${((audioDuration > 0 ? currentTime / audioDuration : currentTime / activeTape.durationSeconds) * 100) || 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between font-mono text-[8px] md:text-[9px] text-amber-500/90 font-bold">
                          <span>{formatTime(currentTime)}</span>
                          <span>-{formatTime(Math.max(0, (audioDuration > 0 ? audioDuration : activeTape.durationSeconds) - currentTime))}</span>
                        </div>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 md:gap-2 pt-1 md:pt-1.5">
                      <button onClick={handlePlay} disabled={!activeTape || isPlaying}
                        className={`py-1.5 md:py-2 px-1.5 md:px-2.5 rounded-xs font-mono text-[8px] md:text-[9px] font-semibold tracking-wider border uppercase transition-all flex items-center justify-center gap-0.5 md:gap-1 ${
                          isPlaying ? 'bg-amber-950/60 text-amber-400 border-amber-600/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] translate-y-0.5 font-bold' 
                          : activeTape ? 'bg-[#282522] text-[#e5e2de] border-[#3d3732] hover:bg-[#332e2a] hover:border-[#4d443b] active:translate-y-0.5 shadow-md hover:text-white' 
                          : 'bg-[#151413] text-neutral-700 border-[#1c1a19] cursor-not-allowed'
                        }`}
                      ><span className={`text-[7px] md:text-[8px] ${isPlaying ? 'text-amber-400' : 'text-[#a84432]'}`}>▲</span> {t(ui.studioTapes.playBtn)}</button>

                      <button onClick={handlePause} disabled={!activeTape || !isPlaying}
                        className={`py-1.5 md:py-2 px-1.5 md:px-2.5 rounded-xs font-mono text-[8px] md:text-[9px] font-semibold tracking-wider border uppercase transition-all flex items-center justify-center gap-0.5 md:gap-1 ${
                          !isPlaying && activeTape && currentTime > 0 ? 'bg-amber-950/60 text-amber-400 border-amber-600/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] translate-y-0.5 font-bold' 
                          : activeTape && isPlaying ? 'bg-[#282522] text-[#e5e2de] border-[#3d3732] hover:bg-[#332e2a] hover:border-[#4d443b] active:translate-y-0.5 shadow-md hover:text-white'
                          : 'bg-[#151413] text-neutral-700 border-[#1c1a19] cursor-not-allowed'
                        }`}
                      ><span className="text-[7px] md:text-[8px] text-amber-500">❚❚</span> {t(ui.studioTapes.pauseBtn)}</button>

                      <button onClick={handleStop} disabled={!activeTape}
                        className={`py-1.5 md:py-2 px-1.5 md:px-2.5 rounded-xs font-mono text-[8px] md:text-[9px] font-semibold tracking-wider border uppercase transition-all flex items-center justify-center gap-0.5 md:gap-1 ${
                          activeTape ? 'bg-[#282522] text-[#e5e2de] border-[#3d3732] hover:bg-[#332e2a] hover:border-[#4d443b] active:translate-y-0.5 shadow-md hover:text-white' 
                          : 'bg-[#151413] text-neutral-700 border-[#1c1a19] cursor-not-allowed'
                        }`}
                      ><span className="text-[6px] md:text-[7px]">■</span> {t(ui.studioTapes.stopBtn)}</button>

                      <button onClick={handleEject} disabled={!activeTape}
                        className={`py-1.5 md:py-2 px-1.5 md:px-2.5 rounded-xs font-mono text-[8px] md:text-[9px] font-semibold tracking-wider border uppercase transition-all flex items-center justify-center gap-0.5 md:gap-1 ${
                          activeTape ? 'bg-[#3a1a16] text-[#ffa399] border-[#5d2b22] hover:bg-[#4d211c] hover:border-[#703328] active:translate-y-0.5 shadow-md' 
                          : 'bg-[#151413] text-neutral-700 border-[#1c1a19] cursor-not-allowed'
                        }`}
                      ><span className="text-[7px] md:text-[8px]">⏏</span> {t(ui.studioTapes.ejectBtn)}</button>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-2 md:gap-4 pt-2 md:pt-3 border-t border-[#23201d]">
                      <span className="font-mono text-[7px] md:text-[8px] text-neutral-500 tracking-widest uppercase font-bold whitespace-nowrap">VOL</span>
                      <div className="flex-1 flex items-center gap-1.5 md:gap-2">
                        <span className="font-mono text-[7px] md:text-[8px] text-neutral-600 font-bold">0</span>
                        <input type="range" min="0" max="1" step="0.05" value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="flex-1 h-1 bg-[#1e1c1a] rounded-full appearance-none cursor-pointer accent-[#a84432]"
                        />
                        <span className="font-mono text-[7px] md:text-[8px] text-neutral-600 font-bold">10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tray of cassettes (below player on mobile, side on desktop) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#a84432] font-semibold tracking-wider">
                      <span className="hidden md:inline">{t(ui.studioTapes.tray)}</span>
                      <span className="md:hidden">{t(ui.studioTapes.trayMobile)}</span>
                    </span>
                    <span className="font-mono text-[8px] text-[#888]">
                      {studioTapes.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 bg-[#fffef0] border border-[#e5e2de] p-2 md:p-3 rounded-sm">
                    {studioTapes.map((tape) => {
                      const isActive = activeTape?.id === tape.id;
                      return (
                        <div
                          key={tape.id}
                          onClick={() => handleInsertTape(tape)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleInsertTape(tape);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${t(ui.a11y.insertTape)}: ${tape.subtitle}`}
                          className={`relative p-3 md:p-4 rounded-sm border transition-all duration-300 select-none cursor-pointer ${
                            isActive 
                              ? 'border-[#a84432]/40 opacity-50 bg-[#1a1a1a]/5' 
                              : 'border-[#e5e2de] hover:border-[#1a1a1a]/20 shadow-2xs hover:shadow-xs'
                          }`}
                          style={{ backgroundColor: tape.coverColor + '10' }}
                          id={`tape-${tape.id}`}
                        >
                          <div className="flex flex-col h-full justify-between space-y-2 md:space-y-3">
                            <div className="flex justify-between items-start gap-3 md:gap-4">
                              <div>
                                <span className="font-mono text-[8px] md:text-[9px] opacity-60 uppercase block">
                                  {tape.title}
                                </span>
                                <h4 className="font-serif text-xs md:text-sm font-semibold text-[#1a1a1a] mt-0.5 line-clamp-1">
                                  {tape.subtitle}
                                </h4>
                              </div>
                              <span className="font-mono text-[9px] md:text-[10px] bg-[#1a1a1a]/5 px-1 md:px-1.5 py-0.5 rounded-xs whitespace-nowrap">
                                {tape.duration}
                              </span>
                            </div>

                            {/* Little physical cassettes visualization - Draggable on desktop, clickable always */}
                            <motion.div 
                              drag={!isMobile}
                              dragSnapToOrigin
                              onDragStart={() => synth.playClick()}
                              onDrag={handleDragUpdate}
                              onDragEnd={(e, info) => handleDragEnd(info, tape)}
                              whileDrag={!isMobile ? { 
                                rotate: 4, 
                                scale: 1.08, 
                                zIndex: 50,
                                boxShadow: "0 15px 35px rgba(0,0,0,0.25)"
                              } : undefined}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInsertTape(tape);
                              }}
                              className="h-8 md:h-10 border border-[#e5e2de] rounded-xs relative overflow-hidden flex items-center justify-center cursor-pointer hover:brightness-105 active:scale-95 transition-all touch-manipulation"
                              style={{ backgroundColor: tape.coverColor }}
                            >
                              {/* Central white sticker */}
                              <div className="absolute inset-x-1.5 md:inset-x-2 inset-y-1 md:inset-y-1.5 bg-[#f9f7f2] rounded-xs flex items-center justify-around px-1.5 md:px-2 border border-[#1a1a1a]/10 pointer-events-none">
                                {/* Left Reel */}
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-[#1a1a1a]/20 bg-[#fffef0] flex items-center justify-center">
                                  <motion.div 
                                    animate={isPlaying && isActive ? { rotate: 360 } : {}}
                                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                                    className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full border-t border-b border-l border-[#1a1a1a]/50"
                                  />
                                </div>
                                <span className="font-mono text-[6px] md:text-[7px] text-[#555] tracking-tighter">
                                  STEREO
                                </span>
                                {/* Right Reel */}
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-[#1a1a1a]/20 bg-[#fffef0] flex items-center justify-center">
                                  <motion.div 
                                    animate={isPlaying && isActive ? { rotate: 360 } : {}}
                                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                                    className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full border-t border-b border-l border-[#1a1a1a]/50"
                                  />
                                </div>
                              </div>
                            </motion.div>

                            <p className="text-[9px] md:text-[10px] text-[#555] font-light leading-snug italic">
                              {lang === 'en' && tape.descriptionEn ? tape.descriptionEn : tape.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
