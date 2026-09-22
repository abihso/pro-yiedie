import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Volume2 } from "lucide-react";
import type { Socket } from "socket.io-client";
import { useCalls } from "../../../features/calls/call-context";
import { api } from "../../../lib/api";
import type { CallRoom as CallRecord } from "../../../lib/api";
import { createCallClient } from "../../../lib/webrtc-client";
import type { CallClient } from "../../../lib/webrtc-client";

type Phase = "loading" | "joining" | "waiting" | "active" | "ended" | "error";
type RemoteMedia = { socketId: string; stream: MediaStream };

function waitForConnection(socket: Socket, signal: AbortSignal) {
  if (socket.connected) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      socket.off("connect", connected);
      signal.removeEventListener("abort", cancelled);
    };
    const connected = () => { cleanup(); resolve(); };
    const cancelled = () => { cleanup(); reject(new Error("Joining the call was cancelled.")); };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Unable to connect to the call server. Check your connection and try again."));
    }, 15_000);
    socket.on("connect", connected);
    signal.addEventListener("abort", cancelled, { once: true });
    if (signal.aborted) cancelled();
  });
}

function mediaError(error: unknown, video: boolean) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return `Allow access to your microphone${video ? " and camera" : ""} in your browser, then start a new call.`;
    }
    if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
      return `No working microphone${video ? " or camera" : ""} was found. Connect your device and start a new call.`;
    }
    if (error.name === "NotReadableError") {
      return "Your microphone or camera is in use by another app. Close that app and start a new call.";
    }
  }
  return error instanceof Error ? error.message : "The call could not connect. Please try again.";
}

function Media({ stream, video, muted = false, className = "" }: {
  stream: MediaStream; video: boolean; muted?: boolean; className?: string;
}) {
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  useEffect(() => {
    const element = mediaRef.current;
    if (!element) return;
    let cancelled = false;
    element.srcObject = stream;
    void element.play().then(() => {
      if (!cancelled) setPlaybackBlocked(false);
    }).catch(() => {
      if (!cancelled && !muted) setPlaybackBlocked(true);
    });
    return () => {
      cancelled = true;
      element.srcObject = null;
    };
  }, [stream, muted]);

  return <>
    {video ? (
      <video ref={mediaRef} autoPlay playsInline muted={muted} className={className} />
    ) : (
      <audio ref={mediaRef} autoPlay muted={muted} />
    )}
    {playbackBlocked && (
      <button
        type="button"
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg"
        onClick={() => {
          void mediaRef.current?.play().then(() => setPlaybackBlocked(false)).catch(() => setPlaybackBlocked(true));
        }}
      >
        <Volume2 size={18} /> Enable call audio
      </button>
    )}
  </>;
}

function CallSession({ callId }: { callId: string }) {
  const { socket, connected } = useCalls();
  const navigate = useNavigate();
  const location = useLocation();
  const peerName = typeof location.state?.peerName === "string" ? location.state.peerName : "Your contact";
  const initials = peerName.split(/\s+/).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase();
  const [room, setRoom] = useState<CallRecord | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [status, setStatus] = useState("Preparing your call…");
  const [error, setError] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remote, setRemote] = useState<RemoteMedia | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [ending, setEnding] = useState(false);
  const clientRef = useRef<CallClient | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!socket) return;
    const abort = new AbortController();
    let cancelled = false;
    let ended = false;
    let validated = false;
    let client: CallClient | null = null;
    let stream: MediaStream | null = null;
    let video = false;
    const active = () => !cancelled && !ended;
    const release = () => {
      stream?.getTracks().forEach((track) => track.stop());
      if (client) void client.destroy().catch(() => {});
    };
    const stop = () => {
      ended = true;
      abort.abort();
      release();
    };
    stopRef.current = stop;

    const onEnded = (event: { callId: string; reason?: string }) => {
      if (event.callId !== callId || cancelled || ended) return;
      ended = true;
      abort.abort();
      release();
      setLocalStream(null);
      setRemote(null);
      setPhase("ended");
      setStatus(event.reason?.startsWith("disconnected") || event.reason === "connection_error"
        ? "Your connection was lost. Return to messages to start a new call."
        : "This call has ended.");
    };
    // Listen before media access: the other person can hang up while this
    // browser is still showing its microphone/camera permission prompt.
    socket.on("call:ended", onEnded);

    async function start() {
      try {
        const { call } = await api.call(callId);
        if (!active()) return;
        setRoom(call);
        video = call.mode === "video";
        if (call.endedAt) {
          onEnded({ callId });
          return;
        }
        validated = true;
        const { iceServers } = await api.callIce();
        if (!active()) return;
        await waitForConnection(socket!, abort.signal);
        if (!active()) return;
        if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === "undefined") {
          throw new Error("Calling needs a supported browser on HTTPS or localhost.");
        }
        setStatus(`Allow microphone${video ? " and camera" : ""} access to join the call.`);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
        if (!active()) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        setLocalStream(stream);
        setPhase("joining");
        setStatus("Connecting your call…");
        client = createCallClient({
          socket: socket!, localStream: stream, iceServers,
          onRemoteStream: (media) => {
            if (!active()) return;
            setRemote(media);
            setPhase("active");
            setStatus("You are connected");
          },
          onPeerLeft: ({ socketId }) => {
            if (!active()) return;
            setRemote((current) => current?.socketId === socketId ? null : current);
            setPhase("waiting");
            setStatus("The other person has left. Waiting for them to reconnect…");
          },
          onError: (failure) => {
            if (active()) setError(failure.message);
          },
          onEnded,
        });
        clientRef.current = client;
        await client.join(callId);
        if (!active()) return;
        setPhase((current) => current === "active" ? current : "waiting");
        setStatus((current) => current === "You are connected" ? current : "Waiting for the other person to join…");
      } catch (failure) {
        if (!active()) return;
        release();
        setLocalStream(null);
        setRemote(null);
        setError(mediaError(failure, video));
        setPhase("error");
        setStatus("Unable to join the call");
        // A failed setup must not leave the other person waiting or marked busy.
        if (validated) {
          ended = true;
          void api.endCall(callId).catch(() => {
            if (socket?.connected) socket.emit("call:leave", { callId });
          });
        }
      }
    }
    void start();

    return () => {
      cancelled = true;
      abort.abort();
      socket.off("call:ended", onEnded);
      release();
      if (validated && !client && socket.connected) socket.emit("call:leave", { callId });
      if (clientRef.current === client) clientRef.current = null;
      if (streamRef.current === stream) streamRef.current = null;
      if (stopRef.current === stop) stopRef.current = null;
    };
  }, [socket, callId]);

  async function endCall() {
    if (ending) return;
    setEnding(true);
    stopRef.current?.();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void clientRef.current?.destroy().catch(() => {});
    setLocalStream(null);
    setRemote(null);
    try {
      await api.endCall(callId);
      navigate("/dashboard/messages");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to end the call. Please try again.");
      setPhase("error");
      setStatus("Your microphone and camera have been turned off.");
      setEnding(false);
    }
  }

  function toggleMicrophone() {
    const next = !muted;
    localStream?.getAudioTracks().forEach((track) => { track.enabled = !next; });
    setMuted(next);
  }

  function toggleCamera() {
    const next = !cameraOff;
    localStream?.getVideoTracks().forEach((track) => { track.enabled = !next; });
    setCameraOff(next);
  }

  const terminal = phase === "ended" || phase === "error";
  const video = room?.mode === "video";
  const canControl = Boolean(localStream) && !terminal && !ending;

  return (
    <main className="flex min-h-dvh flex-col bg-[#f3f7ff] px-4 py-5 text-slate-900 sm:px-8 sm:py-7">
      <header className="mx-auto mb-5 flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" aria-label="Return to messages" onClick={() => navigate("/dashboard/messages")} className="rounded-full bg-white p-3 shadow-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold sm:text-2xl">{peerName}</h1>
            <p className="text-sm text-slate-500">{room ? (video ? "Video call" : "Audio call") : "Call room"}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-slate-600 sm:text-sm">
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`} />
          {connected ? "Online" : "Connecting…"}
        </span>
      </header>

      <section aria-label="Call participants" className="relative mx-auto flex min-h-[52dvh] w-full max-w-6xl flex-1 items-center justify-center overflow-hidden rounded-3xl bg-slate-950 shadow-xl sm:min-h-[60dvh]">
        {remote && !terminal && (
          <Media stream={remote.stream} video={video} className="absolute inset-0 h-full w-full object-contain" />
        )}
        {(!video || !remote || terminal) && (
          <div className="relative z-10 flex max-w-lg flex-col items-center gap-5 px-6 py-14 text-center text-white">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/25 text-3xl font-bold text-indigo-100 ring-8 ring-white/5 sm:h-32 sm:w-32 sm:text-4xl">
              {initials || <Phone size={40} />}
            </div>
            <div>
              <p className="text-xl font-semibold sm:text-2xl">{peerName}</p>
              <p role="status" className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-300">
                {!terminal && phase !== "active" && <LoaderCircle size={17} className="shrink-0 animate-spin" />}
                {status}
              </p>
            </div>
          </div>
        )}
        {remote && video && !terminal && (
          <p role="status" className="absolute left-4 top-4 rounded-xl bg-black/50 px-3 py-2 text-sm text-white">{peerName} · Connected</p>
        )}
        {localStream && video && !terminal && (
          <div className="absolute bottom-4 right-4 z-10 aspect-video w-32 overflow-hidden rounded-2xl border border-white/25 bg-slate-800 shadow-lg sm:w-52">
            <Media stream={localStream} video muted className={`h-full w-full -scale-x-100 object-cover ${cameraOff ? "invisible" : ""}`} />
            {cameraOff && <div className="absolute inset-0 flex items-center justify-center text-slate-300"><VideoOff size={25} /></div>}
            <span className="absolute bottom-1 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white">You {muted ? "· Muted" : ""}</span>
          </div>
        )}
      </section>

      {error && <p role="alert" className="mx-auto mt-4 w-full max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>}

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 pt-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {!terminal && <>
            <button type="button" onClick={toggleMicrophone} disabled={!canControl} aria-label={muted ? "Unmute microphone" : "Mute microphone"} aria-pressed={muted} className={`rounded-full p-4 shadow-sm transition disabled:opacity-40 ${muted ? "bg-slate-800 text-white" : "bg-white hover:bg-slate-100"}`}>
              {muted ? <MicOff size={23} /> : <Mic size={23} />}
            </button>
            {video && <button type="button" onClick={toggleCamera} disabled={!canControl} aria-label={cameraOff ? "Turn camera on" : "Turn camera off"} aria-pressed={cameraOff} className={`rounded-full p-4 shadow-sm transition disabled:opacity-40 ${cameraOff ? "bg-slate-800 text-white" : "bg-white hover:bg-slate-100"}`}>
              {cameraOff ? <VideoOff size={23} /> : <Video size={23} />}
            </button>}
          </>}
          {phase !== "ended" && room && !room.endedAt && (
            <button type="button" onClick={() => void endCall()} disabled={ending} className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-4 font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60">
              {ending ? <LoaderCircle size={21} className="animate-spin" /> : <PhoneOff size={21} />}
              {ending ? "Ending…" : "End call"}
            </button>
          )}
          {terminal && <button type="button" onClick={() => navigate("/dashboard/messages")} className="rounded-full bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-700">Back to messages</button>}
        </div>
        {!terminal && <p className="text-center text-xs text-slate-500">{muted ? "Your microphone is muted" : video ? "Microphone and camera controls" : "Audio call · Your camera is off"}</p>}
      </footer>
    </main>
  );
}

export default function CallRoom() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const callId = params.get("callId")?.toLowerCase() ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(callId)) {
    return <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f3f7ff] px-6 text-center">
      <PhoneOff className="text-slate-400" size={40} />
      <h1 className="text-2xl font-bold text-slate-900">No active call to join</h1>
      <p className="text-slate-600">Start a call from a conversation or accept an incoming call.</p>
      <button type="button" onClick={() => navigate("/dashboard/messages")} className="rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white">Back to messages</button>
    </main>;
  }
  return <CallSession key={callId} callId={callId} />;
}
