import { LabSimulator } from './lab-simulator.js';
import { PythonCodeGenerator } from './python-generator.js';

document.addEventListener('DOMContentLoaded', () => {
  const simulator = new LabSimulator(30.0);
  const codeGen = new PythonCodeGenerator();

  const sliderW = document.getElementById('sliderW');
  const sliderF = document.getElementById('sliderF');
  const sliderP = document.getElementById('sliderP');

  const labelW = document.getElementById('labelW');
  const labelF = document.getElementById('labelF');
  const labelP = document.getElementById('labelP');

  const resultDistance = document.getElementById('resultDistance');
  const pixelAt30m = document.getElementById('pixelAt30m');
  const statusBadge = document.getElementById('statusBadge');
  const bboxPreview = document.getElementById('bboxPreview');
  const bboxLabel = document.getElementById('bboxLabel');
  const pythonCodeDisplay = document.getElementById('pythonCodeDisplay');
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const vehicleBtns = document.querySelectorAll('.vehicle-btn');

  function updateLab() {
    const W = parseFloat(sliderW.value);
    const F = parseInt(sliderF.value, 10);
    const P = parseInt(sliderP.value, 10);

    const state = simulator.calculate(W, F, P);

    // ອັບເດດປ້າຍຕົວເລກ Slider
    labelW.textContent = `${W.toFixed(1)} ແມັດ`;
    labelF.textContent = `${F}`;
    labelP.textContent = `${P} Pixels`;

    // ອັບເດດຜົນລັບໄລຍະຫ່າງ
    resultDistance.textContent = `${state.distance.toFixed(1)} ແມັດ`;
    pixelAt30m.innerHTML = `💡 ທີ່ໄລຍະ 30m ກ່ອງລົດຈະກວ້າງປະມານ <strong>${state.expectedPixelAt30m.toFixed(1)} px</strong>`;

    // ອັບເດດຂະໜາດກ່ອງຕົວຢ່າງ Bounding Box
    const previewW = Math.min(155, Math.max(24, P));
    const previewH = Math.round(previewW * 0.75);
    bboxPreview.style.width = `${previewW}px`;
    bboxPreview.style.height = `${previewH}px`;
    bboxLabel.textContent = `${P}px`;

    // ປ່ຽນສີຕາມເກນ 30 ແມັດ
    if (state.isDanger) {
      resultDistance.style.color = 'var(--danger)';
      statusBadge.textContent = '⚠️ ອັນຕະລາຍ (< 30m)';
      statusBadge.className = 'badge badge-danger';
      bboxPreview.style.borderColor = 'var(--danger)';
      bboxPreview.style.background = 'rgba(239, 68, 68, 0.15)';
    } else {
      resultDistance.style.color = 'var(--safe)';
      statusBadge.textContent = '✅ ປອດໄພ (≥ 30m)';
      statusBadge.className = 'badge badge-safe';
      bboxPreview.style.borderColor = 'var(--safe)';
      bboxPreview.style.background = 'rgba(34, 197, 94, 0.12)';
    }

    // ສ້າງໂຄ້ດ Python ໃໝ່ທັນທີ
    pythonCodeDisplay.textContent = codeGen.generateSnippet(state);
  }

  // Event Listeners ສຳລັບ Sliders
  [sliderW, sliderF, sliderP].forEach(el => el?.addEventListener('input', updateLab));

  // ປຸ່ມເລືອກປະເພດລົດ (ລົດເກັງ, ກະບະ, ບັນທຸກ)
  vehicleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vehicleBtns.forEach(b => b.className = 'btn btn-outline vehicle-btn');
      btn.className = 'btn btn-primary vehicle-btn';
      sliderW.value = btn.getAttribute('data-width');
      updateLab();
    });
  });

  // ປຸ່ມກ໊ອບປີ້ໂຄ້ດ Python
  copyCodeBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(pythonCodeDisplay.textContent);
    copyCodeBtn.textContent = '✅ ກ໊ອບປີ້ແລ້ວ!';
    setTimeout(() => { copyCodeBtn.textContent = '📋 ກ໊ອບປີ້ໂຄ້ດ'; }, 2000);
  });

  updateLab();
});