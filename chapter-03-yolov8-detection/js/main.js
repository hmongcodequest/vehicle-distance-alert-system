import { ROILaneFilter } from './roi-lane-filter.js';
import { YoloBBoxSimulator } from './yolo-bbox-simulator.js';

document.addEventListener('DOMContentLoaded', () => {
  const roiFilter = new ROILaneFilter(720, 44);
  const tableBody = document.getElementById('detectionTableBody');
  const overallStatus = document.getElementById('overallStatus');
  const toggleRoiCheck = document.getElementById('toggleRoiCheck');
  const roiWidthSlider = document.getElementById('roiWidthSlider');

  const simulator = new YoloBBoxSimulator('yoloCanvas', roiFilter, (detections, egoLaneDanger) => {
    // 1. ອັບເດດປ້າຍສະຖານະລວມ
    if (egoLaneDanger) {
      overallStatus.textContent = '⚠️ ແຈ້ງເຕືອນ! ລົດໃນເລນໃກ້ກວ່າ 30m';
      overallStatus.className = 'badge badge-danger';
    } else {
      overallStatus.textContent = '✅ ເລນທາງໜ້າປອດໄພ (≥ 30m)';
      overallStatus.className = 'badge badge-safe';
    }

    // 2. ອັບເດດຕາຕະລາງຂໍ້ມູນກ່ອງ YOLOv8
    tableBody.innerHTML = '';
    detections.forEach((d) => {
      const tr = document.createElement('tr');
      
      const laneBadge = d.inLane 
        ? '<span class="badge badge-safe">ໃນເລນ (In ROI)</span>'
        : '<span class="badge badge-outline">ນອກເລນ (Ignored)</span>';

      const distColor = d.isDanger ? 'var(--danger)' : (d.inLane ? 'var(--safe)' : 'var(--muted-foreground)');

      tr.innerHTML = `
        <td><strong>#${d.id}</strong> ${d.clsName}</td>
        <td><code>${d.pixelWidth} px</code> <span class="text-muted">(${d.x1},${d.x2})</span></td>
        <td>${laneBadge}</td>
        <td style="font-weight: 700; color: ${distColor};">${d.distance.toFixed(1)} m</td>
      `;
      tableBody.appendChild(tr);
    });
  });

  // ປຸ່ມເປີດ/ປິດ ROI Filter
  toggleRoiCheck?.addEventListener('change', (e) => {
    roiFilter.enabled = e.target.checked;
    simulator.render();
  });

  // ປັບຄວາມກວ້າງເຂດເລນ ROI
  roiWidthSlider?.addEventListener('input', (e) => {
    roiFilter.roiWidthPercent = parseInt(e.target.value, 10);
    simulator.render();
  });

  simulator.render();
});