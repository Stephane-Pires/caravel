# Cabin music

The `/cabin` theme is composed in code, rendered with sampled instruments, measured, and published as five looping layers (`public/cabin/audio/`: ambience, percussion, bass, chords, melody).

## One-time setup

- `brew install fluid-synth ffmpeg`, and Python 3 with `numpy`
- Download the **GeneralUser GS** SoundFont (`GeneralUser-GS.sf2`, 32 MB) from https://github.com/mrbumpy409/GeneralUser-GS. It isn't committed. Its license allows its sounds in your own music, private or commercial, without restriction.

## Render, check, publish

```sh
python3 render.py path/to/GeneralUser-GS.sf2 /tmp/cabin-music --publish ../../public/cabin/audio
python3 analyze.py /tmp/cabin-music
```

- `render.py` writes the MIDI per layer, renders it with FluidSynth, folds the reverb tail onto the start (seamless loop), sets the loudness to about −20 LUFS, and exports Opus (`.opus`) and AAC (`.m4a`) per layer.
- `analyze.py` is the listening proxy: loudness and true peak, energy per frequency band, what survives on laptop speakers, chord match per bar, tempo, loop-seam jump, plus a spectrogram and waveforms to look at.

Targets the theme was tuned to: about −20 LUFS, peaks below −1.5 dBTP, bass band under ~35 % of the energy, loop seam jump close to the typical frame-to-frame change, chord match above 0.7.

The music is an original composition (D minor, 100 BPM, 40 bars, 96 s). The cabin loops each layer over exactly 96 s and quiets the percussion, bass and melody at night.
