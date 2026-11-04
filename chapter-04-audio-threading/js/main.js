import { SoundSynthesizer } from './sound-synthesizer.js';
import { ThreadVisualizer } from './thread-visualizer.js';

document.addEventListener('DOMContentLoaded', () => {
  const synth = new SoundSynthesizer();

  const fpsCounter = document.getElementById('fpsCounter');
  const soundStateText = document.getElementById('soundStateText');
  const cooldownTimerText = document.getElementById('cooldownTimerText');
  const cooldownProgress = document.getElementById('cooldownProgress');

  const modeThreadBtn = document.getElementById('modeThreadBtn');
  const modeBlockBtn = document.getElementById('modeBlockBtn');
  const simDistSlider = document.getElementById('simDistSlider');
  const distValText = document.getElementById('distValText');
  const cooldownSlider = document.getElementById('cooldownSlider');
  const cooldownValText = document.getElementById('cooldownValText');
  const testSoundBtn = document.getElementById('testSoundBtn');
  const autoSoundCheck = document.getElementById('autoSoundCheck');

  const visualizer = new ThreadVisualizer('threadCanvas', synth, (status) => {
    fpsCounter.textContent = `${status.fps} FPS`;
    fpsCounter.className = status.isFrozen ? 'fps-bad' : 'fps-good';

    if (status.isSoundPlaying) {
      soundStateText.textContent = '🔊 ກຳລັງດັງສຽງເຕືອນ! (Playing Alert)';
      soundStateText.style.color = 'var(--accent-blue)';
    } else if (status.cooldownRemaining > 0) {
      soundStateText.textContent = '⏳ ຢູ່ໃນຊ່ວງພັກສຽງ (Cooldown Active)';
      soundStateText.style.color = 'var(--muted-foreground)';
    } else {
      soundStateText.textContent = '✅ ພ້ອມແຈ້ງເຕືອນຮອບຕໍ່ໄປ (Ready)';
      soundStateText.style.color = 'var(--safe)';
    }

    cooldownTimerText.textContent = `Cooldown: ${status.cooldownRemaining.toFixed(1)}s`;
    cooldownProgress.style.width = `${status.progressPercent}%`;
  });

  visualizer.start();

  // ປຸ່ມສະຫຼັບໂໝດ Threading vs Blocking
  modeThreadBtn?.addEventListener('click', () => {
    visualizer.useThreading = true;
    modeThreadBtn.className = 'btn btn-primary';
    modeBlockBtn.className = 'btn btn-outline';
  });

  modeBlockBtn?.addEventListener('click', () => {
    visualizer.useThreading = false;
    modeBlockBtn.className = 'btn btn-primary';
    modeThreadBtn.className = 'btn btn-outline';
  });

  // ປັບໄລຍະລົດ
  simDistSlider?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    visualizer.distance = val;
    if (val < 30.0) {
      distValText.textContent = `${val.toFixed(1)} ແມັດ (< 30m ອັນຕະລາຍ)`;
      distValText.style.color = 'var(--danger)';
    } else {
      distValText.textContent = `${val.toFixed(1)} ແມັດ (≥ 30m ປອດໄພ)`;
      distValText.style.color = 'var(--safe)';
    }
  });

  // ປັບເວລາ Cooldown
  cooldownSlider?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    visualizer.cooldownSec = val;
    cooldownValText.textContent = `${val.toFixed(1)} ວິນາທີ`;
  });

  // ປຸ່ມກົດທົດສອບສຽງ
  testSoundBtn?.addEventListener('click', () => {
    synth.playBeep();
  });

  autoSoundCheck?.addEventListener('change', (e) => {
    visualizer.autoSound = e.target.checked;
  });
});