import { FormulaCalculator } from './formula-calculator.js';
import { DiagramRenderer } from './diagram-renderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const calculator = new FormulaCalculator(1.8, 800, 30.0);
  const renderer = new DiagramRenderer('triangleCanvas');

  const slider = document.getElementById('distanceSlider');
  const distanceLabel = document.getElementById('distanceLabel');
  const safetyBadge = document.getElementById('safetyBadge');

  const mathP = document.getElementById('mathP');
  const descP = document.getElementById('descP');
  const mathResult = document.getElementById('mathResult');
  const presetButtons = document.querySelectorAll('.preset-buttons button');

  const ch1PythonCode = document.getElementById('ch1PythonCode');
  const copyCh1PyBtn = document.getElementById('copyCh1PyBtn');

  function updatePythonSnippet(pixelWidth, distance) {
    if (!ch1PythonCode) return;
    ch1PythonCode.textContent = `# =====================================================================
# ບົດທີ 1: ການຂຽນສູດສາມແຈຄ້າຍຄືໃນພາສາ Python (triangle_math.py)
# =====================================================================

KNOWN_WIDTH = 1.8    # W: ຄວາມກວ້າງຕົວຈິງຂອງລົດເກັງ (ແມັດ)
FOCAL_LENGTH = 800.0 # F: ຄ່າຄວາມຍາວໂຟກັສຂອງກ້ອງ (Pixels)
SAFE_DISTANCE = 30.0 # ເກນແຈ້ງເຕືອນໄລຍະຫ່າງ (30 ແມັດ)

def calculate_distance(pixel_width: float) -> float:
    """ສູດສາມແຈຄ້າຍຄື: D = (W * F) / P"""
    return (KNOWN_WIDTH * FOCAL_LENGTH) / pixel_width

# ທົດສອບດ້ວຍຄ່າ Pixel ທີ່ເຈົ້າກຳລັງເລືອກຢູ່ເທິງແຜນວາດ (${distance.toFixed(1)}m):
pixel_p = ${pixelWidth.toFixed(1)}
distance_d = calculate_distance(pixel_p)

print(f"ຄວາມກວ້າງໃນພາບ P = {pixel_p:.1f} px -> ໄລຍະຫ່າງ D = {distance_d:.1f} ແມັດ")
if distance_d < SAFE_DISTANCE:
    print("⚠️ WARNING: ລົດຄັນໜ້າຢູ່ໃກ້ກວ່າ 30 ແມັດ!")
else:
    print("✅ SAFE: ໄລຍະຫ່າງປອດໄພ (>= 30 ແມັດ)")`;
  }

  function updateLessonState(distanceValue) {
    const dist = parseFloat(distanceValue);
    const state = calculator.evaluateSafety(dist);

    // 1. ອັບເດດຕົວເລກເທິງໜ້າເວັບ
    distanceLabel.textContent = `${state.distance.toFixed(1)} ແມັດ`;
    mathP.textContent = `${state.pixelWidth.toFixed(1)} px`;
    descP.textContent = state.pixelWidth.toFixed(1);
    mathResult.textContent = `${state.distance.toFixed(1)} m`;

    // 2. ປ່ຽນສີສະຖານະຕາມເກນ 30 ແມັດ
    if (state.isDanger) {
      safetyBadge.textContent = '⚠️ ອັນຕະລາຍ (< 30m)';
      safetyBadge.className = 'badge badge-danger';
      mathResult.style.color = 'var(--danger)';
      distanceLabel.style.color = 'var(--danger)';
    } else {
      safetyBadge.textContent = '✅ ປອດໄພ (≥ 30m)';
      safetyBadge.className = 'badge badge-safe';
      mathResult.style.color = 'var(--safe)';
      distanceLabel.style.color = 'var(--accent-blue)';
    }

    // 3. ແຕ້ມແຜນວາດສາມແຈຄ້າຍຄືໃໝ່ & ອັບເດດໂຄ້ດ Python
    renderer.draw(state.distance, state.pixelWidth, state.isDanger);
    updatePythonSnippet(state.pixelWidth, state.distance);
  }

  slider?.addEventListener('input', (e) => {
    updateLessonState(e.target.value);
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetDist = btn.getAttribute('data-dist');
      slider.value = targetDist;
      updateLessonState(targetDist);
    });
  });

  copyCh1PyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(ch1PythonCode.textContent);
    copyCh1PyBtn.textContent = '✅ ກ໊ອບປີ້ແລ້ວ!';
    setTimeout(() => { copyCh1PyBtn.textContent = '📋 ກ໊ອບປີ້ໂຄ້ດ Python'; }, 2000);
  });

  updateLessonState(30.0);
});