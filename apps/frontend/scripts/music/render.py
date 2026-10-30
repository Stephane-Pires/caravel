"""Caravel cabin theme: compose (MIDI), render with real sampled instruments (FluidSynth +
GeneralUser GS), loop seamlessly, loudness-normalize, export stems and a mix.

Original composition: a lazy island groove in D minor, 100 BPM, 40 bars (~96 s).
Usage: python3 render.py <soundfont.sf2> <out_dir> [--publish <public/cabin/audio>]
"""
import json
import random
import struct
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SF2, OUT = Path(sys.argv[1]), Path(sys.argv[2])
PUBLISH = Path(sys.argv[sys.argv.index("--publish") + 1]) if "--publish" in sys.argv else None
OUT.mkdir(parents=True, exist_ok=True)
SR, BPM, BARS, PPQ = 44100, 100, 40, 480
BEAT = 60 / BPM
LOOP_SECONDS = BARS * 4 * BEAT
TAIL_SECONDS = 4.0  # reverb tail rendered past the loop end, folded back onto the start
SWING = 0.08        # off-beat eighths land a little late: the lazy feel
random.seed(7)


# ---------- a tiny Standard MIDI File writer ----------
def vlq(n):
    out = [n & 0x7F]
    n >>= 7
    while n:
        out.insert(0, (n & 0x7F) | 0x80)
        n >>= 7
    return bytes(out)


def write_midi(path, events, end_beats):
    """events: (beat, kind, channel, a, b); kind in note_on, note_off, program, cc."""
    order = {"program": 0, "cc": 1, "note_off": 2, "note_on": 3}
    events = sorted(events, key=lambda e: (e[0], order[e[1]]))
    track, last = bytearray(), 0
    tempo = int(60_000_000 / BPM)
    track += vlq(0) + b"\xff\x51\x03" + tempo.to_bytes(3, "big")
    for beat, kind, ch, a, b in events:
        tick = max(0, round(beat * PPQ))
        track += vlq(tick - last)
        last = tick
        if kind == "note_on":
            track += bytes([0x90 | ch, a, b])
        elif kind == "note_off":
            track += bytes([0x80 | ch, a, 0])
        elif kind == "program":
            track += bytes([0xC0 | ch, a])
        elif kind == "cc":
            track += bytes([0xB0 | ch, a, b])
    track += vlq(max(0, round(end_beats * PPQ) - last)) + b"\xff\x2f\x00"
    header = b"MThd" + struct.pack(">IHHH", 6, 0, 1, PPQ)
    path.write_bytes(header + b"MTrk" + struct.pack(">I", len(track)) + bytes(track))


class Part:
    def __init__(self, channel, program=None, volume=100, reverb=40, pan=64, chorus=0):
        self.ch, self.events = channel, []
        if program is not None:
            self.events.append((0, "program", channel, program, 0))
        for cc, val in ((7, volume), (91, reverb), (10, pan), (93, chorus)):
            self.events.append((0, "cc", channel, cc, val))

    def note(self, bar, beat, pitch, dur, vel, swing=True, human=True, gate=0.95):
        t = bar * 4 + beat
        if swing and abs((beat % 1) - 0.5) < 1e-6:
            t += SWING
        if human:
            t += random.uniform(-0.012, 0.012)
            vel = max(1, min(127, vel + random.randint(-6, 6)))
        self.events.append((t, "note_on", self.ch, pitch, vel))
        self.events.append((t + dur * gate, "note_off", self.ch, pitch, 0))


# ---------- harmony ----------
VOICING = {
    "Dm7": [62, 65, 69, 72], "G9": [59, 62, 65, 69], "Bbmaj7": [58, 62, 65, 69], "A7": [61, 64, 67, 69],
    "A7sus": [62, 64, 67, 69], "Fmaj7": [60, 64, 65, 69], "C": [60, 64, 67, 72], "Gm7": [58, 62, 65, 67],
    "Am7": [60, 64, 67, 69],
}
ROOT = {"Dm7": 38, "G9": 43, "Bbmaj7": 46, "A7": 45, "A7sus": 45, "Fmaj7": 41, "C": 36, "Gm7": 43, "Am7": 45}
FIFTH = {"Dm7": 45, "G9": 50, "Bbmaj7": 41, "A7": 40, "A7sus": 40, "Fmaj7": 48, "C": 43, "Gm7": 50, "Am7": 40}

INTRO = [["Dm7"], ["G9"], ["Dm7"], ["A7"]]
A = [["Dm7"], ["G9"], ["Dm7"], ["Bbmaj7", "A7"], ["Dm7"], ["G9"], ["Bbmaj7"], ["A7sus", "A7"]]
B = [["Fmaj7"], ["C"], ["Gm7"], ["Dm7"], ["Fmaj7"], ["C"], ["Bbmaj7"], ["A7"]]
BRIDGE = [["Bbmaj7"], ["Am7"], ["Gm7"], ["A7"]] * 2
SECTIONS = [("intro", INTRO), ("A", A), ("B", B), ("A2", A), ("bridge", BRIDGE), ("outro", INTRO)]
CHART, SECTION_OF = [], []
for name, bars in SECTIONS:
    CHART += bars
    SECTION_OF += [name] * len(bars)
assert len(CHART) == BARS

# ---------- melodies (original): (beat, MIDI note, beats) per bar ----------
D4, E4, F4, G4, A4, Bb4, B4, C5, Cs5, D5, E5, F5, G5, A5 = 62, 64, 65, 67, 69, 70, 71, 72, 73, 74, 76, 77, 79, 81
MEL_A = [
    [(0.5, A4, .5), (1, D5, 1), (2.5, C5, .5), (3, A4, 1)],
    [(0.5, G4, .5), (1, A4, .5), (1.5, B4, 1), (3, D5, 1)],
    [(0, F5, 1.5), (1.5, E5, .5), (2, D5, 1), (3, C5, .5), (3.5, A4, .5)],
    [(0, D5, 1), (1, F5, 1), (2, E5, 1), (3, Cs5, 1)],
    [(0.5, A4, .5), (1, D5, 1), (2.5, F5, .5), (3, G5, 1)],
    [(0, A5, 1.5), (1.5, G5, .5), (2, F5, .5), (2.5, E5, .5), (3, D5, 1)],
    [(0, F5, 1), (1, D5, .5), (1.5, Bb4, .5), (2, C5, 1), (3, D5, 1)],
    [(0, E5, 2), (2, Cs5, 1), (3, A4, 1)],
]
MEL_B = [
    [(0, C5, 1), (1, F5, 1.5), (2.5, E5, .5), (3, C5, 1)],
    [(0, E5, 2), (2, D5, .5), (2.5, C5, .5), (3, G4, 1)],
    [(0, Bb4, 1), (1, D5, 1), (2, F5, 1), (3, E5, .5), (3.5, D5, .5)],
    [(0, A4, 3)],
    [(0, C5, 1), (1, F5, 1), (2, A5, 1.5), (3.5, G5, .5)],
    [(0, G5, 1), (1, E5, 1), (2, C5, 1), (3, E5, 1)],
    [(0, F5, 1), (1, D5, 1), (2, F5, .5), (2.5, G5, .5), (3, A5, 1)],
    [(0, G5, 1), (1, E5, 1), (2, Cs5, 2)],
]


def chord_at(bar, beat):
    names = CHART[bar]
    return names[0] if len(names) == 1 or beat < 2 else names[1]


def next_root(bar):
    return ROOT[CHART[(bar + 1) % BARS][0]]


# ---------- parts ----------
GM = {"steel": 114, "flute": 73, "marimba": 12, "nylon": 24, "organ": 16, "bass": 32, "seashore": 122, "bird": 123}

melody = Part(0, GM["steel"], volume=96, reverb=55, pan=58)
flute = Part(1, GM["flute"], volume=78, reverb=60, pan=74)
marimba = Part(2, GM["marimba"], volume=82, reverb=50, pan=48)
guitar = Part(3, GM["nylon"], volume=74, reverb=35, pan=80)
organ = Part(4, GM["organ"], volume=46, reverb=40, pan=44)
bass = Part(5, GM["bass"], volume=108, reverb=15, pan=64)
drums = Part(9, None, volume=92, reverb=30)
sea = Part(6, GM["seashore"], volume=70, reverb=0)
birds = Part(7, GM["bird"], volume=40, reverb=60, pan=90)

for bar in range(BARS):
    sec, local = SECTION_OF[bar], (bar - 4) % 8
    # melody: steel drums on A, flute on B, both on A2, marimba arpeggios in the bridge
    if sec in ("A", "A2"):
        for beat, p, d in MEL_A[local]:
            melody.note(bar, beat, p, d, 92)
            if sec == "A2":
                flute.note(bar, beat, p, d, 70, human=False)
    elif sec == "B":
        for beat, p, d in MEL_B[local]:
            flute.note(bar, beat, p, d, 84)
        if local in (3, 7):  # steel drums answer at the end of each phrase
            for beat, p in ((2, A4), (2.5, C5), (3, D5)):
                melody.note(bar, beat, p, .5, 72)
    elif sec == "bridge":
        for i in range(8):
            v = VOICING[chord_at(bar, i / 2)]
            marimba.note(bar, i / 2, v[[0, 1, 2, 3, 2, 1, 2, 3][i]] + 12, .45, 62 + (8 if i % 2 == 0 else 0))
    # harmony: guitar chops on 2 and 4, organ bubble on the off-beats (not in the intro/outro tails)
    for beat in (1, 3):
        for p in VOICING[chord_at(bar, beat)]:
            guitar.note(bar, beat, p, .22, 70 if sec not in ("intro", "outro") else 52)
    if sec in ("A", "B", "A2", "bridge"):
        for beat in (0.5, 1.5, 2.5, 3.5):
            for p in VOICING[chord_at(bar, beat)][:3]:
                organ.note(bar, beat, p, .3, 44)
    # bass: syncopated, leaves beat 3 open (one-drop), walks into the next chord
    if True:
        c = chord_at(bar, 0)
        r, f = ROOT[c], FIFTH[c]
        for beat, p, d, v in ((0, r, .9, 96), (1.5, r, .4, 80), (2.5, f, .4, 84), (3, r + 12, .4, 70), (3.5, next_root(bar) - 1, .4, 76)):
            if len(CHART[bar]) == 2 and beat >= 2:
                p = {2.5: ROOT[CHART[bar][1]], 3: FIFTH[CHART[bar][1]], 3.5: next_root(bar) - 1}.get(beat, p)
            bass.note(bar, beat, p, d, v)
    # drums: one-drop (kick + rim on beat 3), shaker eighths, congas, a fill every 8 bars
    full = sec in ("A", "B", "A2")
    for i in range(8):
        drums.note(bar, i / 2, 70, .2, 72 if i % 2 else 50)  # maracas / shaker
    if sec != "bridge":
        drums.note(bar, 2, 37, .2, 74 if full else 56)  # side stick
    if full:
        drums.note(bar, 2, 36, .3, 96)  # kick
        for beat in (0.5, 1.5, 2.5, 3.5):
            drums.note(bar, beat, 42, .15, 34)
    if sec in ("A", "B", "A2", "bridge"):
        drums.note(bar, 1.5, 64, .2, 58)
        drums.note(bar, 3.5, 63, .2, 52)
    if full and local == 7:
        for k, beat in enumerate((3, 3.25, 3.5, 3.75)):
            drums.note(bar, beat, 65 if k < 2 else 66, .15, 60 + k * 6, swing=False)

# ambience: the sea all the way through, a few birds
for k in range(0, BARS * 4 + 8, 6):  # waves breathe in and out, overlapping
    sea.note(0, k, random.choice([57, 60, 62]), 10, random.randint(55, 80), swing=False, human=False, gate=1.0)
for bar in (2, 9, 17, 26, 33):
    for k in range(random.randint(2, 4)):
        birds.note(bar, random.choice([0.5, 1, 1.5, 2.5]) + k * 0.3, random.choice([72, 74, 76, 79]), .25, random.randint(40, 70), swing=False)

STEMS = {
    "ambience": [sea, birds],
    "percussion": [drums],
    "bass": [bass],
    "chords": [guitar, organ],
    "melody": [melody, flute, marimba],
}
GAIN_DB = {"ambience": 6, "percussion": 3, "bass": -4, "chords": 5, "melody": 2}  # mix balance, tuned by ear-proxies in analyze.py


# ---------- render ----------
def render(name, parts):
    mid, wav = OUT / f"{name}.mid", OUT / f"{name}_raw.wav"
    write_midi(mid, [e for p in parts for e in p.events], BARS * 4 + TAIL_SECONDS / BEAT)
    subprocess.run(["fluidsynth", "-ni", "-q", "-g", "0.5", "-r", str(SR), "-O", "s16", "-T", "wav", "-F", str(wav), str(SF2), str(mid)],
                   check=True, capture_output=True)
    with wave.open(str(wav)) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32).reshape(-1, w.getnchannels()) / 32768
    n_loop, n_tail = round(LOOP_SECONDS * SR), round(TAIL_SECONDS * SR)
    x = np.pad(x, ((0, max(0, n_loop + n_tail - len(x))), (0, 0)))
    looped = x[:n_loop].copy()
    looped[:n_tail] += x[n_loop:n_loop + n_tail]  # fold the reverb tail onto the start: seamless loop
    wav.unlink()
    return looped


def write_wav(path, x):
    y = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())


def bass_eq(x):
    """high-pass ~40 Hz and -3 dB low shelf under 100 Hz: keeps the line, loses the boom."""
    spec = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(len(x), 1 / SR)[:, None]
    g = 1 / np.sqrt(1 + (40 / np.maximum(f, 1)) ** 8) * np.where(f < 100, 10 ** (-3 / 20), 1.0)
    return np.fft.irfft(spec * g, len(x), axis=0)


stems = {name: render(name, parts) * 10 ** (GAIN_DB[name] / 20) for name, parts in STEMS.items()}
stems["bass"] = bass_eq(stems["bass"])
mix = sum(stems.values())

# loudness: measure the mix with ffmpeg's EBU R128 meter, then apply one gain to the mix and every stem
write_wav(OUT / "_probe.wav", mix / max(1e-9, np.abs(mix).max()) * 0.5)
probe = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(OUT / "_probe.wav"), "-af", "loudnorm=print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
measured = json.loads(probe[probe.rindex("{"):probe.rindex("}") + 1])
TARGET_LUFS, CEILING_DBTP = -20.0, -1.5
gain_db = TARGET_LUFS - float(measured["input_i"])
peak_after = float(measured["input_tp"]) + gain_db
if peak_after > CEILING_DBTP:
    gain_db -= peak_after - CEILING_DBTP
scale = 0.5 / max(1e-9, np.abs(mix).max()) * 10 ** (gain_db / 20)
(OUT / "_probe.wav").unlink()

for name, x in stems.items():
    write_wav(OUT / f"stem-{name}.wav", x * scale)
write_wav(OUT / "mix.wav", mix * scale)
for f in ["mix"] + [f"stem-{n}" for n in STEMS]:
    src = OUT / f"{f}.wav"
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-c:a", "libopus", "-b:a", "128k", str(OUT / f"{f}.opus")], check=True)
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-c:a", "aac", "-b:a", "160k", str(OUT / f"{f}.m4a")], check=True)

(OUT / "layout.json").write_text(json.dumps({"bpm": BPM, "bars": BARS, "loop_seconds": LOOP_SECONDS,
                                             "sections": [[n, len(b)] for n, b in SECTIONS], "chart": CHART}, indent=1))
print(f"rendered {len(STEMS)} stems + mix, loop {LOOP_SECONDS:.1f}s, gain {gain_db:+.1f} dB")
if PUBLISH:  # the layers the cabin streams: <layer>.opus, with <layer>.m4a for browsers without Opus
    PUBLISH.mkdir(parents=True, exist_ok=True)
    for name in STEMS:
        for ext in ("opus", "m4a"):
            (PUBLISH / f"{name}.{ext}").write_bytes((OUT / f"stem-{name}.{ext}").read_bytes())
    print(f"published {len(STEMS)} layers to {PUBLISH}")
