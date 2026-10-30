"""Listening proxy for the Caravel theme: measures what an engineer checks by ear and on meters.
Usage: python3 analyze.py <render_dir>  ->  prints a report, writes report.json + spectrogram/waveform PNGs
"""
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

D = Path(sys.argv[1])
layout = json.loads((D / "layout.json").read_text())
SR, BPM, BARS = 44100, layout["bpm"], layout["bars"]
BAR_S = 4 * 60 / BPM
STEMS = ["ambience", "percussion", "bass", "chords", "melody"]


def load(name):
    with wave.open(str(D / f"{name}.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32).reshape(-1, 2) / 32768
    return x.mean(axis=1)


def r128(name):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(D / f"{name}.wav"), "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    summary = err[err.rindex("Summary:"):]
    get = lambda key: float(re.search(key + r":\s+(-?[\d.]+|-inf)", summary).group(1).replace("-inf", "-120"))
    return {"lufs": get("I"), "lra": get("LRA"), "true_peak_dbtp": get("Peak")}


def band_share(x):
    spec = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2
    f = np.fft.rfftfreq(len(x), 1 / SR)
    bands = {"sub <60": (20, 60), "bass 60-250": (60, 250), "low-mid 250-1k": (250, 1000), "mid 1-4k": (1000, 4000),
             "presence 4-12k": (4000, 12000), "air >12k": (12000, 20000)}
    total = spec[(f >= 20) & (f < 20000)].sum()
    return {k: round(100 * spec[(f >= a) & (f < b)].sum() / total, 1) for k, (a, b) in bands.items()}


def chroma(x):
    """12 pitch-class energies of a mono excerpt (simple FFT folding, 55 Hz-2 kHz)."""
    spec = np.abs(np.fft.rfft(x * np.hanning(len(x))))
    f = np.fft.rfftfreq(len(x), 1 / SR)
    keep = (f > 55) & (f < 2000)
    pc = np.round(12 * np.log2(f[keep] / 440) + 9).astype(int) % 12  # 0 = C
    c = np.bincount(pc, weights=spec[keep] ** 2, minlength=12)
    return c / (np.linalg.norm(c) + 1e-12)


CHORD_PCS = {"Dm7": [2, 5, 9, 0], "G9": [7, 11, 2, 5, 9], "Bbmaj7": [10, 2, 5, 9], "A7": [9, 1, 4, 7], "A7sus": [9, 2, 4, 7],
             "Fmaj7": [5, 9, 0, 4], "C": [0, 4, 7], "Gm7": [7, 10, 2, 5], "Am7": [9, 0, 4, 7]}
D_MINOR_SCALE = {2, 4, 5, 7, 9, 10, 0, 1, 11}  # D natural/harmonic/dorian colours used in the piece


def onset_bpm(x):
    hop = 512
    frames = np.lib.stride_tricks.sliding_window_view(x, 2048)[::hop]
    mag = np.abs(np.fft.rfft(frames * np.hanning(2048), axis=1))
    flux = np.maximum(0, np.diff(mag, axis=0)).sum(axis=1)
    flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    fps = SR / hop
    lags = np.arange(len(ac))
    valid = (lags > fps * 60 / 180) & (lags < fps * 60 / 60)
    best = lags[valid][np.argmax(ac[valid])]
    return round(60 * fps / best, 1)


def loop_seam(x):
    w = int(0.02 * SR)
    joined = np.concatenate([x[-SR:], x[:SR]])
    env = np.sqrt(np.convolve(joined ** 2, np.ones(w) / w, "valid"))[::w]
    jumps = np.abs(np.diff(20 * np.log10(env + 1e-6)))
    at = len(env) // 2
    return {"level_jump_db": round(float(jumps[at - 2:at + 2].max()), 2), "typical_jump_db": round(float(np.median(jumps)), 2),
            "p95_jump_db": round(float(np.percentile(jumps, 95)), 2)}


report = {"mix": r128("mix"), "stems": {s: r128(f"stem-{s}") for s in STEMS}}
mix = load("mix")
report["clipped_samples"] = int((np.abs(mix) > 0.999).sum())
report["band_share_pct"] = band_share(mix)
# small speakers (laptop/phone) barely reproduce below ~200 Hz: how much of the melody and the whole mix survives?
hp = lambda x: np.real(np.fft.irfft(np.fft.rfft(x) * (np.fft.rfftfreq(len(x), 1 / SR) > 200), len(x)))
mel = load("stem-melody")
report["small_speaker"] = {
    "mix_level_kept_db": round(float(10 * np.log10(np.mean(hp(mix) ** 2) / np.mean(mix ** 2))), 1),
    "melody_level_kept_db": round(float(10 * np.log10(np.mean(hp(mel) ** 2) / (np.mean(mel ** 2) + 1e-12))), 1),
}
report["tempo_bpm_detected"] = onset_bpm(load("stem-percussion") + 0.5 * load("stem-bass"))
report["loop_seam"] = loop_seam(mix)

# harmony: per bar, how well the pitched layers match the intended chord, and which bars clash
pitched = load("stem-chords") + load("stem-bass") + load("stem-melody")
melody = load("stem-melody")
bars = []
for i, names in enumerate(layout["chart"]):
    seg = pitched[int(i * BAR_S * SR):int((i + 1) * BAR_S * SR)]
    c = chroma(seg)
    template = np.zeros(12)
    for n in names:
        template[CHORD_PCS[n]] += 1
    template /= np.linalg.norm(template)
    mseg = chroma(melody[int(i * BAR_S * SR):int((i + 1) * BAR_S * SR)])
    off_scale = float(sum(mseg[p] ** 2 for p in range(12) if p not in D_MINOR_SCALE))
    bars.append({"bar": i + 1, "chord": "/".join(names), "match": round(float(c @ template), 2), "melody_off_scale": round(off_scale, 3)})
report["harmony"] = {"mean_match": round(float(np.mean([b["match"] for b in bars])), 2),
                     "weakest_bars": sorted(bars, key=lambda b: b["match"])[:4],
                     "melody_off_scale_bars": [b for b in bars if b["melody_off_scale"] > 0.05]}

# pictures I can look at
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(D / "mix.wav"),
                "-lavfi", "showspectrumpic=s=1600x600:legend=1:scale=log:fscale=log:start=40:stop=16000", str(D / "spectrogram.png")], check=True)
inputs, filt = [], []
for k, s in enumerate(STEMS):
    inputs += ["-i", str(D / f"stem-{s}.wav")]
    filt.append(f"[{k}:a]showwavespic=s=1600x120:split_channels=0:colors=0x{['6fb3d9', 'e8a33d', 'b5462f', '5aa877', 'f0c75e'][k]}[w{k}]")
filt.append("".join(f"[w{k}]" for k in range(len(STEMS))) + f"vstack=inputs={len(STEMS)}")
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt), "-frames:v", "1", str(D / "stems.png")], check=True)

(D / "report.json").write_text(json.dumps(report, indent=1))
m = report["mix"]
print(f"MIX  {m['lufs']} LUFS  LRA {m['lra']}  peak {m['true_peak_dbtp']} dBTP  clipped={report['clipped_samples']}")
print("STEMS", {s: v["lufs"] for s, v in report["stems"].items()})
print("BANDS", report["band_share_pct"])
print("SMALL SPEAKER", report["small_speaker"])
print("TEMPO", report["tempo_bpm_detected"], "bpm (target", BPM, ")")
print("LOOP SEAM", report["loop_seam"])
print("HARMONY mean match", report["harmony"]["mean_match"], "| weakest", [(b["bar"], b["chord"], b["match"]) for b in report["harmony"]["weakest_bars"]])
print("MELODY off-scale bars", [(b["bar"], b["melody_off_scale"]) for b in report["harmony"]["melody_off_scale_bars"]])
