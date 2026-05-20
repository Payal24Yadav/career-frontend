"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import toast from "react-hot-toast";

type AudioQuestionData = {
  _id: string;
  question: string;
  options: string[];
  audioUrl?: string;
  audioInstructions?: string;
  allowReplay?: boolean;
};

export default function AudioQuestion({
  question,
  selectedAnswer,
  onAnswer,
}: {
  question: AudioQuestionData;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
}) {
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const handleAudioEnded = () => {
    optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div>
      {question.audioInstructions && (
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-950 animate-fadeIn">
          <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-1">Audio Instructions</div>
          <p className="leading-relaxed whitespace-pre-wrap">{question.audioInstructions}</p>
        </div>
      )}

      <AudioPlayer 
        key={question._id} 
        src={question.audioUrl || ""} 
        allowReplay={Boolean(question.allowReplay)} 
        onEnded={handleAudioEnded}
      />

      <h2 className="mt-6 text-lg sm:text-xl font-bold text-navy leading-relaxed whitespace-pre-wrap">{question.question}</h2>

      <div ref={optionsRef} className="mt-8 space-y-3 scroll-mt-6">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            onClick={() => onAnswer(optionIndex)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex gap-3 items-start ${
              selectedAnswer === optionIndex
                ? "border-primary bg-primary/5 text-navy shadow-sm"
                : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
              selectedAnswer === optionIndex ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {String.fromCharCode(65 + optionIndex)}
            </span>
            <span className="text-sm leading-relaxed">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AudioPlayer({
  src,
  allowReplay = true,
  onEnded,
}: {
  src: string;
  allowReplay?: boolean;
  onEnded?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Synchronous control refs to block race conditions instantly
  const hasPlayedRef = useRef(false);
  const isStartingPlayRef = useRef(false);
  const isMountedRef = useRef(false);
  const maxTimeReachedRef = useRef(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // States
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [maxTimeReached, setMaxTimeReached] = useState(0);
  
  // Production Polish States
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isStartingPlayback, setIsStartingPlayback] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sync volume with audio element when volume state or ref changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Clean up and stop playback on unmount safely to prevent interrupted promise exceptions
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      const playPromise = playPromiseRef.current;
      const cleanup = async () => {
        if (playPromise) {
          try {
            await playPromise;
          } catch {
            // Ignore interrupted startup while the question unmounts.
          }
        }
        if (!audio) return;
        try {
          audio.pause();
        } catch {
          // Ignore media cleanup errors.
        }
      };
      cleanup();
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      toast.error("Audio player is not ready yet");
      return;
    }

    if (!src) {
      toast.error("Audio failed to load. Please check the source file.");
      return;
    }

    // Capture and block duplicate plays in strict listening mode synchronously.
    if (!allowReplay && (hasPlayedRef.current || isStartingPlayRef.current)) {
      toast("This audio can only be played once.");
      return;
    }

    if (playing) {
      if (!allowReplay) {
        toast("This audio can only be played once.");
        return;
      }

      try {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        audio.pause();
        if (isMountedRef.current) {
          setPlaying(false);
        }
      } catch {
        // Ignore pause races.
      }
      return;
    }

    try {
      if (!allowReplay) {
        isStartingPlayRef.current = true;
      }
      if (isMountedRef.current) {
        setIsStartingPlayback(true);
        setIsLoading(true);
      }

      audio.volume = volume;
      const playPromise = audio.play();
      playPromiseRef.current = playPromise;
      
      playPromise.catch((error: DOMException) => {
        if (error.name !== "AbortError") {
          console.error("Audio playback error:", error);
        }
      });

      await playPromise;

      if (!isMountedRef.current) return;

      setIsLoading(false);
      setPlaying(true);
      if (!allowReplay) {
        hasPlayedRef.current = true;
        setHasPlayed(true);
      }
    } catch (error: unknown) {
      if (isMountedRef.current) {
        setIsLoading(false);
        setPlaying(false);
      }
      const errorName = error instanceof DOMException ? error.name : "";
      if (errorName !== "AbortError") {
        toast.error("Audio playback failed. Please try again.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsStartingPlayback(false);
      }
      if (!allowReplay) {
        isStartingPlayRef.current = false;
      }
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !allowReplay) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    const audio = audioRef.current;
    setVolume(value);
    if (audio) audio.volume = value;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!allowReplay) {
      if (
        event.key === " " || 
        event.key === "Spacebar" || 
        event.key === "ArrowLeft" || 
        event.key === "ArrowRight" || 
        event.key === "ArrowUp" || 
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const getStatusText = () => {
    if (!src) return "Audio Unavailable";
    if (isLoading || isStartingPlayback) return "Loading audio...";
    if (isBuffering) return "Buffering...";
    if (!hasPlayed) return "Ready to Listen";
    if (playing) return "Listening...";
    return "Audio Completed";
  };

  const showDisabledLook = !src || (!allowReplay && hasPlayed) || isStartingPlayback;

  return (
    <div 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
      className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm select-none transition-all duration-300"
    >
      <audio
        ref={audioRef}
        src={src || undefined}
        preload="none"
        playsInline
        controlsList="nodownload noplaybackrate"
        onLoadedMetadata={(event) => {
          if (isMountedRef.current) {
            setDuration(event.currentTarget.duration || 0);
            setIsLoading(false);
          }
        }}
        onCanPlay={() => {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        }}
        onWaiting={() => {
          if (isMountedRef.current) {
            setIsBuffering(true);
          }
        }}
        onPlaying={() => {
          if (isMountedRef.current) {
            setIsLoading(false);
            setIsBuffering(false);
          }
        }}
        onTimeUpdate={(event) => {
          if (!isMountedRef.current) return;

          const time = event.currentTarget.currentTime || 0;
          if (!allowReplay) {
            if (time < maxTimeReachedRef.current) {
              event.currentTarget.currentTime = maxTimeReachedRef.current;
              return;
            }
            maxTimeReachedRef.current = time;
            setMaxTimeReached(time);
          }
          setCurrentTime(time);
        }}
        onSeeking={(event) => {
          if (!allowReplay && Math.abs(event.currentTarget.currentTime - maxTimeReachedRef.current) > 0.25) {
            event.currentTarget.currentTime = maxTimeReachedRef.current;
          }
        }}
        onPause={(event) => {
          if (!isMountedRef.current) return;

          if (!allowReplay) {
            const audio = event.currentTarget;
            const durationValue = audio.duration || 0;

            // If paused externally/internally before completion, resume playback immediately
            if (audio.currentTime < durationValue - 0.1 && hasPlayedRef.current) {
              const resumePromise = audio.play();
              playPromiseRef.current = resumePromise;
              resumePromise.catch(() => {});
            }
            return;
          }

          if (isMountedRef.current) {
            setPlaying(false);
          }
        }}
        onPlay={() => {
          if (!isMountedRef.current) return;

          setIsLoading(false);
          setPlaying(true);
          if (!allowReplay) {
            hasPlayedRef.current = true;
            setHasPlayed(true);
          }
        }}
        onEnded={() => {
          if (isMountedRef.current) {
            setIsLoading(false);
            setIsBuffering(false);
            setPlaying(false);
          }
          if (onEnded) {
            onEnded();
          }
        }}
        onError={() => {
          if (isMountedRef.current) {
            setIsLoading(false);
            setIsBuffering(false);
          }
        }}
      />

      {!allowReplay && (
        <div className="mb-3 flex items-center justify-between border-b border-gray-50 pb-2.5">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Listening Exam Mode</span>
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full transition-all duration-300 ${
            !hasPlayed 
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
              : playing 
              ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse" 
              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
          }`}>
            {getStatusText()}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!src}
          className={`w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-all ${
            showDisabledLook
              ? "opacity-50 cursor-not-allowed bg-indigo-500"
              : "hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-md shadow-indigo-200"
          }`}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing && allowReplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          {allowReplay ? (
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              disabled={!duration || !src}
              className="w-full accent-indigo-600 cursor-pointer"
              aria-label="Audio seek"
            />
          ) : (
            /* Strict listening mode: Visual-only unclickable progress track */
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-3 mb-2 relative">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${duration ? (maxTimeReached / duration) * 100 : 0}%` }}
              />
            </div>
          )}
          <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>

        {allowReplay && (
          <label className="flex items-center gap-2 text-gray-500">
            <Volume2 className="w-4 h-4" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              className="w-24 accent-indigo-600 cursor-pointer"
              aria-label="Audio volume"
            />
          </label>
        )}
      </div>

      {!allowReplay && hasPlayed && (
        <div className="mt-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 text-center">
          <p className="text-[11px] font-bold text-indigo-800 leading-relaxed">
            Strict Listening Mode: This audio has completed and cannot be replayed.
          </p>
        </div>
      )}
      {!src && (
        <p className="mt-3 text-xs font-bold text-red-600">Audio is not available for this question.</p>
      )}
    </div>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
