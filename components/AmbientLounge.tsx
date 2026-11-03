"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Volume2, VolumeX, Sparkles, X } from "lucide-react";

type Soundscape = "rain" | "fire" | "cafe";

export default function AmbientLounge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundscape, setSoundscape] = useState<Soundscape>("rain");
  const [volume, setVolume] = useState(0.25);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Initialize or stop audio
  function toggleAudio() {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(soundscape, volume);
    }
  }

  function startAudio(type: Soundscape, vol: number) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Stop previous
      stopAudioNodes();

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate noise buffer based on soundscape
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "rain") {
          // Pink/Rain noise: filtered white noise
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === "fire") {
          // Fireplace: brown noise with occasional crackle
          lastOut = (lastOut + 0.015 * white) / 1.015;
          data[i] = lastOut * 4;
          if (Math.random() < 0.003) {
            data[i] += (Math.random() - 0.5) * 0.7; // subtle crackle pop
          }
        } else {
          // Cafe murmur: warm low-frequency noise
          lastOut = (lastOut + 0.01 * white) / 1.01;
          data[i] = lastOut * 3;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      if (type === "rain") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else if (type === "fire") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, ctx.currentTime);
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
      gainNodeRef.current = gainNode;

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      noiseNodeRef.current = noiseSource;
      setIsPlaying(true);
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  function stopAudioNodes() {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
        noiseNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      noiseNodeRef.current = null;
    }
  }

  function stopAudio() {
    stopAudioNodes();
    setIsPlaying(false);
  }

  function handleSoundscapeChange(newType: Soundscape) {
    setSoundscape(newType);
    if (isPlaying) {
      startAudio(newType, volume);
    }
  }

  function handleVolumeChange(newVol: number) {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  }

  useEffect(() => {
    return () => {
      stopAudioNodes();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-2xl transition-all duration-300 backdrop-blur-md ${
            isPlaying
              ? "bg-emerald-600 text-white shadow-emerald-600/30 animate-pulse"
              : "bg-surface border border-line text-ink-soft hover:text-ink hover:border-brand shadow-lg"
          }`}
          title="Open Reading Ambience Lounge"
        >
          <Headphones size={15} className={isPlaying ? "animate-bounce" : ""} />
          <span>{isPlaying ? "Lounge Playing" : "Reading Ambience"}</span>
        </button>
      )}

      {/* Expanded Audio Control Card */}
      {isOpen && (
        <div className="relative w-72 rounded-3xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-xl animate-scale-up space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-blue-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-ink">
                Reading Atmosphere
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-faint hover:text-ink transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Soundscapes Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rain", label: "🌧️ Rain" },
              { id: "fire", label: "🔥 Fireplace" },
              { id: "cafe", label: "☕ Café" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSoundscapeChange(s.id as Soundscape)}
                className={`rounded-xl py-2 px-1 text-[11px] font-bold transition-all text-center ${
                  soundscape === s.id
                    ? "bg-ink text-surface shadow-md"
                    : "border border-line bg-paper/60 text-ink-soft hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Volume Slider & Play/Pause */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={toggleAudio}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold transition-all ${
                isPlaying ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" : "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              }`}
            >
              {isPlaying ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-ink-soft">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-1.5 rounded-lg bg-line cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
