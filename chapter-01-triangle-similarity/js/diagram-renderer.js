export class DiagramRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  draw(distance, pixelWidth, isDanger) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerY = h / 2;

    // 1. ລ້າງໜ້າຈໍ Canvas
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, w, h);

    // ຕຳແໜ່ງຂອງຈຸດໂຟກັສກ້ອງ (Optical Center) ຢູ່ຝັ່ງຊ້າຍ
    const lensX = 140;
    const sensorX = 50; // ເຊັນເຊີຮັບພາບຢູ່ຫຼັງເລນ

    // ແປງໄລຍະຫ່າງ (10m - 60m) ເປັນພິກັດ X ໃນ Canvas
    const carX = lensX + 70 + ((distance - 10) / 50) * (w - lensX - 130);
    const carHalfHeight = 55; // ຄວາມກວ້າງຕົວຈິງຂອງລົດ W = 1.8m (ຄົງທີ່ສະເໝີ)

    // ຄິດໄລ່ຄວາມສູງຂອງພາບໃນ Sensor (ປີ້ນກັບຫົວ ຫຼື ຂະໜາດຕາມສັດສ່ວນ P)
    const sensorHalfHeight = Math.min(80, pixelWidth * 0.75);

    // 2. ແຕ້ມເສັ້ນແກນກາງ (Optical Axis)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(w - 20, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. ແຕ້ມເສັ້ນກຳນົດເຂດ 30 ແມັດ (Safety Threshold Line)
    const threshold30mX = lensX + 70 + ((30 - 10) / 50) * (w - lensX - 130);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.beginPath();
    ctx.moveTo(threshold30mX, 30);
    ctx.lineTo(threshold30mX, h - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.font = '12px Inter, Noto Sans Lao';
    ctx.fillText('ເຂດແຈ້ງເຕືອນ 30m', threshold30mX - 45, 22);

    // 4. ແຕ້ມຮູບສາມແຈຄ້າຍຄື (ເສັ້ນແສງຈາກລົດ ຜ່ານເລນກ້ອງ ໄປຫາ Sensor)
    const rayColor = isDanger ? '#ef4444' : '#38bdf8';
    ctx.strokeStyle = rayColor;
    ctx.lineWidth = 2;

    // 填充ສີພື້ນຫຼັງສາມແຈບາງໆ
    ctx.fillStyle = isDanger ? 'rgba(239, 68, 68, 0.08)' : 'rgba(56, 189, 248, 0.08)';
    ctx.beginPath();
    ctx.moveTo(lensX, centerY);
    ctx.lineTo(carX, centerY - carHalfHeight);
    ctx.lineTo(carX, centerY + carHalfHeight);
    ctx.closePath();
    ctx.fill();

    // ແຕ້ມເສັ້ນຂອບສາມແຈຝັ່ງລົດ (D ແລະ W)
    ctx.beginPath();
    ctx.moveTo(sensorX, centerY - sensorHalfHeight);
    ctx.lineTo(lensX, centerY);
    ctx.lineTo(carX, centerY - carHalfHeight);
    ctx.moveTo(sensorX, centerY + sensorHalfHeight);
    ctx.lineTo(lensX, centerY);
    ctx.lineTo(carX, centerY + carHalfHeight);
    ctx.stroke();

    // 5. ແຕ້ມເຊັນເຊີຮັບພາບ (Image Sensor - P)
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sensorX, centerY - sensorHalfHeight);
    ctx.lineTo(sensorX, centerY + sensorHalfHeight);
    ctx.stroke();

    ctx.fillStyle = '#d8b4fe';
    ctx.font = 'bold 12px Inter';
    ctx.fillText(`P = ${pixelWidth.toFixed(0)}px`, sensorX - 30, centerY - sensorHalfHeight - 10);

    // 6. ແຕ້ມຈຸດເລນກ້ອງ (Camera Lens)
    ctx.fillStyle = '#fafafa';
    ctx.beginPath();
    ctx.arc(lensX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('ເລນກ້ອງ (F)', lensX - 30, centerY + 25);

    // 7. ແຕ້ມລົດຄັນທາງໜ້າ (W = 1.8m)
    const carColor = isDanger ? '#ef4444' : '#22c55e';
    ctx.strokeStyle = carColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(carX, centerY - carHalfHeight);
    ctx.lineTo(carX, centerY + carHalfHeight);
    ctx.stroke();

    // ກ່ອງຕົວລົດຈຳລອງ
    ctx.fillStyle = '#18181b';
    ctx.fillRect(carX, centerY - carHalfHeight, 28, carHalfHeight * 2);
    ctx.strokeRect(carX, centerY - carHalfHeight, 28, carHalfHeight * 2);

    // ຂໍ້ຄວາມกำกับລົດ
    ctx.fillStyle = carColor;
    ctx.font = 'bold 13px Inter, Noto Sans Lao';
    ctx.fillText(`ລົດຄັນໜ້າ (W = 1.8m)`, carX - 45, centerY - carHalfHeight - 12);
    ctx.fillText(`ໄລຍະ D = ${distance.toFixed(1)}m`, carX - 35, centerY + carHalfHeight + 22);
  }
}