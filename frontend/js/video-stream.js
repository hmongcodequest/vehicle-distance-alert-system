export class VideoSimulator {
  constructor(canvasId, onFrameCallback) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.onFrameCallback = onFrameCallback;
    
    this.isRunning = true;
    this.distance = 34.0;
    this.direction = -0.07;
    this.manualMode = false;

    // ຄ່າເລີ່ມຕົ້ນກ່ອນໂຫຼດໄຟລ໌ ../videos/lane_config.json
    this.configWidth = 800;
    this.configHeight = 450;
    this.laneTopY = 200;
    this.lanePoints = [
      [304, 200],
      [496, 200],
      [680, 425],
      [120, 425]
    ];

    this.loadLaneJsonConfig();

    // ໂຫຼດວິດີໂອແທ້ ../videos/dome.mp4
    this.videoEl = document.createElement('video');
    this.videoEl.src = '../videos/dome.mp4';
    this.videoEl.muted = true;
    this.videoEl.loop = true;
    this.videoEl.playsInline = true;
    this.videoReady = false;

    this.videoEl.addEventListener('loadeddata', () => {
      this.videoReady = true;
      this.videoEl.play().catch(() => {});
    });
  }

  async loadLaneJsonConfig() {
    try {
      const res = await fetch('../videos/lane_config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('ຍັງບໍ່ມີໄຟລ໌ lane_config.json');
      const data = await res.json();

      // ປັບສັດສ່ວນພິກັດຈາກຂະໜາດວິດີໂອແທ້ໃນ JSON ໃຫ້ກົງກັບຂະໜາດ Canvas (800x450)
      const scaleX = this.canvas.width / (data.frame_width || this.canvas.width);
      const scaleY = this.canvas.height / (data.frame_height || this.canvas.height);

      this.laneTopY = Math.round(data.lane_top_y * scaleY);
      this.lanePoints = data.lane_points.map(pt => [
        Math.round(pt[0] * scaleX),
        Math.round(pt[1] * scaleY)
      ]);
      console.log('✅ ໂຫຼດໄຟລ໌ ../videos/lane_config.json ສຳເລັດ:', data);
    } catch (err) {
      console.warn('ℹ️ ໃຊ້ຄ່າເຂດເລນມາດຕະຖານ (ສາມາດລັນ select_lane_roi.py ເພື່ອສ້າງ lane_config.json):', err.message);
    }
  }

  isPointInPolygon(x, y, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1];
      const xj = pts[j][0], yj = pts[j][1];
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return y >= this.laneTopY && inside;
  }

  start() {
    if (!this.ctx) return;
    const loop = () => {
      if (this.isRunning) {
        this.updatePhysics();
        this.drawScene();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setManualDistance(val) {
    this.manualMode = true;
    this.distance = parseFloat(val);
    this.drawScene();
  }

  togglePause() {
    this.isRunning = !this.isRunning;
    this.manualMode = false;
    if (this.videoReady) {
      if (this.isRunning) this.videoEl.play();
      else this.videoEl.pause();
    }
    return this.isRunning;
  }

  updatePhysics() {
    if (this.manualMode) return;
    this.distance += this.direction;
    if (this.distance <= 18.0) this.direction = 0.07;
    else if (this.distance >= 46.0) this.direction = -0.07;
  }
drawScene() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.videoReady) {
      ctx.drawImage(this.videoEl, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);
    }

    // (ເຊື່ອງເສັ້ນ lane_top_y ແລ້ວ — ສະແດງສະເພາະກອບເຂດເລນ lane_points ຈາກໄຟລ໌ JSON)
    if (this.lanePoints.length === 4) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(this.lanePoints[0][0], this.lanePoints[0][1]);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(this.lanePoints[i][0], this.lanePoints[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // ຄຳນວນໄລຍະຫ່າງ 30m ຕົວຈິງ
    const pixelWidth = (1.8 * 800) / this.distance;
    const pixelHeight = pixelWidth * 0.82;
    const centerX = w / 2;
    const centerY = h * 0.58;

    const x1 = centerX - pixelWidth / 2;
    const y1 = centerY - pixelHeight / 2;
    const bottomCenterY = y1 + pixelHeight;

    const inLane = this.isPointInPolygon(centerX, bottomCenterY, this.lanePoints);
    const isDanger = inLane && this.distance < 30.0;
    const boxColor = !inLane ? '#a1a1aa' : (isDanger ? '#ef4444' : '#22c55e');

    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, pixelWidth, pixelHeight);

    const label = !inLane
      ? `ນອກເຂດເລນ: ${this.distance.toFixed(1)}m`
      : (isDanger ? `ລະວັງລົດທາງໜ້າ! ${this.distance.toFixed(1)}m` : `ປອດໄພ: ${this.distance.toFixed(1)}m`);

    ctx.font = 'bold 14px Inter, Noto Sans Lao';
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = boxColor;
    ctx.fillRect(x1, y1 - 26, textWidth + 14, 26);

    ctx.fillStyle = '#09090b';
    ctx.fillText(label, x1 + 7, y1 - 8);

    if (this.onFrameCallback) {
      this.onFrameCallback(this.distance, inLane);
    }
  }
}