export type SoundName =
    | "click"
    | "select"
    | "ready"
    | "tick"
    | "go"
    | "stop"
    | "reveal"
    | "round"
    | "win"
    | "keypress"
    | "error";

// Files live in /public/sounds. A missing file is fine — that one sound
// just stays silent, nothing crashes.
const SOUND_FILES: Record<SoundName, string> = {
    click: "/sounds/click.wav",
    select: "/sounds/select.wav",
    ready: "/sounds/ready.wav",
    tick: "/sounds/tick.ogg",
    go: "/sounds/go.wav",
    stop: "/sounds/stop.ogg",
    reveal: "/sounds/reveal.wav",
    round: "/sounds/round.wav",
    win: "/sounds/win.wav",
    error: "/sounds/error.wav",
    keypress : "/sounds/keypress.wav"
};

const STORAGE_KEY = "playhub-sound";
const MASTER_VOLUME = 0.6;

let context: AudioContext | null = null;
let preloading: Promise<void> | null = null;
const buffers = new Map<SoundName, AudioBuffer>();

/* ------------------------------------------------------------------ */
/* On/off state — a tiny external store so React can subscribe to it    */
/* ------------------------------------------------------------------ */

let enabled = true;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
        enabled = localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
        // storage blocked (private mode etc.) — stay enabled for the session
    }
}

export function subscribeSound(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function getSoundEnabled() {
    hydrate();
    return enabled;
}

export function setSoundEnabled(value: boolean) {
    hydrate();
    enabled = value;
    try {
        localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    } catch {}
    listeners.forEach((listener) => listener());
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

async function preload(ctx: AudioContext) {
    await Promise.all(
        (Object.entries(SOUND_FILES) as [SoundName, string][]).map(
            async ([name, url]) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) return;
                    const data = await response.arrayBuffer();
                    buffers.set(name, await ctx.decodeAudioData(data));
                } catch {
                    // missing or undecodable file — that sound stays silent
                }
            },
        ),
    );
}

/**
 * Browsers only allow audio after a user gesture. Call this from the first
 * pointerdown/keydown (SoundProvider does it for you). Safe to call many times.
 */
export async function unlockAudio() {
    if (typeof window === "undefined") return;

    if (!context) {
        const Ctor =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext;
        if (!Ctor) return;
        context = new Ctor();
    }

    if (context.state === "suspended") await context.resume();

    preloading ??= preload(context);
    await preloading;
}

export function playSound(
    name: SoundName,
    options: { volume?: number; rate?: number } = {},
) {
    hydrate();
    // Before the first user gesture `context` is null, so this is a quiet no-op.
    if (!enabled || !context) return;

    const buffer = buffers.get(name);
    if (!buffer) return;

    if (context.state === "suspended") void context.resume();

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = options.rate ?? 1;

    const gain = context.createGain();
    gain.gain.value = (options.volume ?? 1) * MASTER_VOLUME;

    source.connect(gain).connect(context.destination);
    source.start();
}
