"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import toast from "react-hot-toast";

type VideoQuestionData = {
  _id: string;
  question: string;
  options: string[];
  videoUrl?: string;
  videoInstructions?: string;
  allowReplay?: boolean;
};

export default function VideoQuestion({
  question,
  selectedAnswer,
  onAnswer,
}: {
  question: VideoQuestionData;
  selectedAnswer: number | null;
  onAnswer: (answer: number) => void;
}) {
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const handleVideoEnded = () => {
    optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div>
      {question.videoInstructions && (
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-950">
          <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-1">Video Instructions</div>
          <p className="leading-relaxed whitespace-pre-wrap">{question.videoInstructions}</p>
        </div>
      )}

      <VideoPlayer
        key={question._id}
        src={question.videoUrl || ""}
        allowReplay={Boolean(question.allowReplay)}
        onEnded={handleVideoEnded}
      />

      <h2 className="mt-6 text-lg sm:text-xl font-bold text-navy leading-relaxed whitespace-pre-wrap">{question.question}</h2>

      <div ref={optionsRef} className="mt-8 space-y-3 scroll-mt-6">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            type="button"
            onClick={() => onAnswer(optionIndex)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex gap-3 items-start ${
              selectedAnswer === optionIndex
                ? "border-primary bg-primary/5 text-navy shadow-sm"
                : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
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

export function VideoPlayer({
  src,
  allowReplay = true,
  onEnded,
}: {
  src: string;
  allowReplay?: boolean;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasPlayedRef = useRef(false);
  const isStartingPlayRef = useRef(false);
  const isMountedRef = useRef(false);
  const maxTimeReachedRef = useRef(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [maxTimeReached, setMaxTimeReached] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isStartingPlayback, setIsStartingPlayback] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;

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

        if (!video) return;

        try {
          video.pause();
        } catch {
          // Ignore media cleanup errors.
        }
      };

      cleanup();
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) {
      toast.error("Video player is not ready yet");
      return;
    }

    if (!src) {
      toast.error("Video failed to load. Please check the source file.");
      return;
    }

    if (!allowReplay && (hasPlayedRef.current || isStartingPlayRef.current)) {
      toast("This video can only be played once.");
      return;
    }

    if (playing) {
      if (!allowReplay) {
        toast("This video can only be played once.");
        return;
      }

      try {
        if (playPromiseRef.current) await playPromiseRef.current;
        video.pause();
        if (isMountedRef.current) setPlaying(false);
      } catch {
        // Ignore pause races with browser playback startup.
      }
      return;
    }

    try {
      if (!allowReplay) isStartingPlayRef.current = true;
      if (isMountedRef.current) {
        setIsStartingPlayback(true);
        setIsLoading(true);
      }

      video.volume = volume;
      const playPromise = video.play();
      playPromiseRef.current = playPromise;
      playPromise.catch(() => {});

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
        toast.error("Video playback failed. Please try again.");
      }
    } finally {
      if (isMountedRef.current) setIsStartingPlayback(false);
      if (!allowReplay) isStartingPlayRef.current = false;
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video || !allowReplay) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    setVolume(value);
    if (video) video.volume = value;
  };

  const blockStrictInput = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!allowReplay) {
      const blockedKeys = [" ", "Spacebar", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  const statusText = (() => {
    if (!src) return "Video Unavailable";
    if (isLoading || isStartingPlayback) return "Loading video...";
    if (isBuffering) return "Buffering...";
    if (!hasPlayed) return "Ready to Watch";
    if (playing) return "Watching...";
    return "Video Completed";
  })();

  const badgeHue = (() => {
    if (!src) return 0;
    if (isLoading || isBuffering || isStartingPlayback) return 42;
    if (playing) return 224;
    if (hasPlayed) return 152;
    return 245;
  })();

  const showDisabledLook = !src || (!allowReplay && hasPlayed) || isStartingPlayback;

  return (
    <div
      onKeyDown={blockStrictInput}
      onContextMenu={(event) => {
        if (!allowReplay) event.preventDefault();
      }}
      tabIndex={0}
      className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm select-none transition-all duration-300"
    >
      {!allowReplay && (
        <div className="mb-3 flex items-center justify-between border-b border-gray-50 pb-2.5">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Video Exam Mode</span>
          <span
            className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all duration-300"
            style={{
              backgroundColor: `hsl(${badgeHue} 88% 96%)`,
              borderColor: `hsl(${badgeHue} 70% 88%)`,
              color: `hsl(${badgeHue} 62% 32%)`,
            }}
          >
            {statusText}
          </span>
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          src={src || undefined}
          preload="none"
          playsInline
          controls={allowReplay}
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          className="block w-full aspect-video bg-black"
          onLoadedMetadata={(event) => {
            if (isMountedRef.current) {
              setDuration(event.currentTarget.duration || 0);
              setIsLoading(false);
            }
          }}
          onCanPlay={() => {
            if (isMountedRef.current) setIsLoading(false);
          }}
          onWaiting={() => {
            if (isMountedRef.current) setIsBuffering(true);
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
              const video = event.currentTarget;
              const durationValue = video.duration || 0;

              if (video.currentTime < durationValue - 0.1 && hasPlayedRef.current) {
                const resumePromise = video.play();
                playPromiseRef.current = resumePromise;
                resumePromise.catch(() => {});
              }
              return;
            }

            setPlaying(false);
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
            onEnded?.();
          }}
          onError={() => {
            if (isMountedRef.current) {
              setIsLoading(false);
              setIsBuffering(false);
            }
          }}
        />

        {!allowReplay && (
          <button
            type="button"
            onClick={togglePlay}
            disabled={!src}
            className={`absolute inset-0 flex items-center justify-center text-white transition-all ${
              playing ? "bg-black/0" : "bg-black/35"
            }`}
            aria-label={playing ? "Video is playing" : "Play video"}
          >
            {!playing && (
              <span className={`w-16 h-16 rounded-full bg-white/95 text-indigo-700 flex items-center justify-center shadow-lg transition-all ${
                showDisabledLook ? "opacity-70" : "hover:scale-105"
              }`}>
                <Play className="w-7 h-7 ml-1" />
              </span>
            )}
          </button>
        )}

        {(isLoading || isBuffering || isStartingPlayback) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-extrabold uppercase tracking-widest">{statusText}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!src}
          className={`w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-all ${
            showDisabledLook
              ? "opacity-50 cursor-not-allowed bg-indigo-500"
              : "hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-md shadow-indigo-200"
          }`}
          aria-label={playing ? "Pause video" : "Play video"}
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
              aria-label="Video seek"
            />
          ) : (
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
              aria-label="Video volume"
            />
          </label>
        )}
      </div>

      {!allowReplay && hasPlayed && !playing && (
        <div className="mt-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 text-center">
          <p className="text-[11px] font-bold text-indigo-800 leading-relaxed">
            Strict Video Mode: This video has completed and cannot be replayed.
          </p>
        </div>
      )}
      {!src && (
        <p className="mt-3 text-xs font-bold text-red-600">Video is not available for this question.</p>
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
