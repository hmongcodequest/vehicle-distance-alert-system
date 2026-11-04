export class YoloBBoxSimulator {
  constructor(canvasId, roiFilter, onUpdateCallback) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.roiFilter = roiFilter;
    this.onUpdateCallback = onUpdateCallback;

    // ຈຳລອງລົດ 3 ຄັນເທິງໜ້າຈໍ
    this.vehicles = [
      { id: 1, clsName: 'car (2)', knownW: 1.8, centerX: 360, distance: 24.5, color: '#38bdf8' },   // ເລນກາງ (ໃກ້ກວ່າ 30m)
      { id: 2, clsName: 'car (2)', knownW: 1.8, centerX: 145, distance: 21.0, color: '#a1a1aa' },   // ເລນຊ້າຍ (ໃກ້ ແຕ່ຢູ່ນອກເລນ)
      { id: 3, clsName: 'truck (7)', knownW: 2.4, centerX: 575, distance: 38.0, color: '#a1a1aa' }  // ເລນຂວາ (ໄກ)
    ];

    this.draggingVehicle = null;
    this.initMouseEvents();
  }

  getBoundingBox(v) {
    const focalLength = 800;
    const pixelWidth = Math.round((v.knownW * focalLength) / v.distance);
    const pixelHeight = Math.round(pixelWidth * 0.8);

    // ຄິດໄລ່ແກນ Y ຕາມໄລຍະຫ່າງ (ຍິ່ງໃກ້ ຍິ່ງຢູ່ລຸ່ມຂອງຈໍ)
    const centerY = Math.round(145 + (60 - v.distance) * 3.6);
    const x1 = Math.round(v.centerX - pixelWidth / 2);
    const y1 = Math.round(centerY - pixelHeight / 2);
    const x2 = x1 + pixelWidth;
    const y2 = y1 + pixelHeight;

    return { x1, y1, x2, y2, pixelWidth, pixelHeight, centerY };
  }

  initMouseEvents() {
    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      for (let i = this.vehicles.length - 1; i >= 0; i--) {
        const v = this.vehicles[i];
        const box = this.getBoundingBox(v);
        if (pos.x >= box.x1 && pos.x <= box.x2 && pos.y >= box.y1 && pos.y <= box.y2) {
          this.draggingVehicle = v;
          break;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.draggingVehicle) return;
      const pos = getMousePos(e);
      this.draggingVehicle.centerX = Math.max(50, Math.min(this.canvas.width - 50, pos.x));
      
      // ແປງຕຳແໜ່ງແກນ Y ກັບເປັນໄລຍະຫ່າງ (12m ຫາ 55m)
      const mappedDist = 60 - (pos.y - 145) / 3.6;
      this.draggingVehicle.distance = Math.max(12.0, Math.min(55.0, mappedDist));
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.draggingVehicle = null;
    });
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. ພື້ນຫຼັງຖະໜົນ
    ctx.fillStyle = '#070709';
    ctx.fillRect(0, 0, w, h);

    // ແຕ້ມເສັ້ນຂອບຟ້າ
    ctx.strokeStyle = '#27272a';
    ctx.beginPath();
    ctx.moveTo(0, 130);
    ctx.lineTo(w, 130);
    ctx.stroke();

    // 2. ແຕ້ມເຂດ ROI (ເລນຂອງເຮົາ)
    const { leftX, rightX } = this.roiFilter.getBounds();
    if (this.roiFilter.enabled) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.fillRect(leftX, 130, rightX - leftX, h - 130);

      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(leftX, 130);
      ctx.lineTo(leftX, h);
      ctx.moveTo(rightX, 130);
      ctx.lineTo(rightX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px Inter, Noto Sans Lao';
      ctx.fillText('ເຂດກວດຈັບເລນທາງໜ້າ (Ego Lane ROI)', leftX + 10, 150);
    }

    // 3. ประมวลผลລົດແຕ່ລະຄັນ
    const results = [];
    let egoLaneDanger = false;

    this.vehicles.forEach((v) => {
      const box = this.getBoundingBox(v);
      const inLane = this.roiFilter.isVehicleInEgoLane(v.centerX);
      const isDanger = inLane && v.distance < 30.0;

      if (isDanger) egoLaneDanger = true;

      // ກຳນົດສີກ່ອງ Bounding Box
      let strokeColor = '#71717a'; // ລົດນອກເລນ (ສີເທົາ)
      if (inLane) {
        strokeColor = isDanger ? '#ef4444' : '#22c55e';
      }

      // ແຕ້ມຕົວລົດຈຳລອງ
      ctx.fillStyle = '#18181b';
      ctx.fillRect(box.x1 + 4, box.y1 + 4, box.pixelWidth - 8, box.pixelHeight - 8);

      // ແຕ້ມກ່ອງ YOLOv8 Bounding Box
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(box.x1, box.y1, box.pixelWidth, box.pixelHeight);

      // ແຕ້ມຈຸດກາງລົດ (center_x)
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(v.centerX, box.centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // ແຕ້ມປ້າຍ Label ເທິງກ່ອງ
      const label = `#${v.id} ${v.clsName} | ${v.distance.toFixed(1)}m`;
      ctx.font = 'bold 12px Inter';
      const textW = ctx.measureText(label).width;
      ctx.fillRect(box.x1, box.y1 - 20, textW + 10, 20);
      ctx.fillStyle = '#09090b';
      ctx.fillText(label, box.x1 + 5, box.y1 - 6);

      results.push({
        ...v,
        ...box,
        inLane,
        isDanger
      });
    });

    this.onUpdateCallback(results, egoLaneDanger);
  }
}