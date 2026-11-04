import { AudioController } from './audio-controller.js';
import { UIComponents } from './ui-components.js';
import { VideoSimulator } from './video-stream.js';

document.addEventListener('DOMContentLoaded', () => {
  const SAFE_DISTANCE = 30.0;

  const audio = new AudioController(3000); // ຫຼິ້ນສຽງ ລະວັງລົດທາງໜ້າ.mp3 ທຸກໆ 3 ວິນາທີ
  const ui = new UIComponents(SAFE_DISTANCE);
  const slider = document.getElementById('manualDistanceSlider');

  const simulator = new VideoSimulator('roadCanvas', (currentDistance, inLane) => {
    ui.updateStatus(currentDistance);
    
    if (slider && !simulator.manualMode) {
      slider.value = currentDistance.toFixed(1);
    }

    // ດັງສຽງເຕືອນສະເພາະເມື່ອລົດຢູ່ໃນເຂດເລນທີ່ເຮົາກຳນົດ ແລະ ໃກ້ກວ່າ 30 ແມັດ
    if (inLane && currentDistance < SAFE_DISTANCE) {
      audio.playAlert();
    }
  });

  simulator.start();

  const toggleSimBtn = document.getElementById('toggleSimBtn');
  toggleSimBtn?.addEventListener('click', () => {
    const running = simulator.togglePause();
    toggleSimBtn.textContent = running ? '⏸️ ຢຸດຊົ່ວຄາວ' : '▶️ ຫຼິ້ນຕໍ່';
  });

  const toggleAudioBtn = document.getElementById('toggleAudioBtn');
  toggleAudioBtn?.addEventListener('click', () => {
    const enabled = audio.toggleAudio();
    toggleAudioBtn.textContent = enabled
      ? '🔊 ສຽງ: ລະວັງລົດທາງໜ້າ (ON)'
      : '🔇 ສຽງ: ປິດຢູ່ (OFF)';
  });

  // ປຸ່ມກົດກຳນົດເຂດເລນໃໝ່ 4 ຈຸດດ້ວຍເມົ້າສ໌
  const setCustomLaneBtn = document.getElementById('setCustomLaneBtn');
  setCustomLaneBtn?.addEventListener('click', () => {
    simulator.startCustomLaneSelection();
  });

  // ປຸ່ມຣີເຊັດເຂດເລນກັບຄືນຄ່າເລີ່ມຕົ້ນ
  const resetLaneBtn = document.getElementById('resetLaneBtn');
  resetLaneBtn?.addEventListener('click', () => {
    simulator.resetDefaultLane();
  });

  slider?.addEventListener('input', (e) => {
    simulator.setManualDistance(e.target.value);
  });
});