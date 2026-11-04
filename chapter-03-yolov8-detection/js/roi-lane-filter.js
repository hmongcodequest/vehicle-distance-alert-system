export class ROILaneFilter {
  constructor(canvasWidth = 720, roiWidthPercent = 44) {
    this.canvasWidth = canvasWidth;
    this.roiWidthPercent = roiWidthPercent;
    this.enabled = true;
  }

  getBounds() {
    const center = this.canvasWidth / 2;
    const halfSpan = (this.canvasWidth * (this.roiWidthPercent / 100)) / 2;
    return {
      leftX: Math.round(center - halfSpan),
      rightX: Math.round(center + halfSpan)
    };
  }

  isVehicleInEgoLane(centerX) {
    if (!this.enabled) return true; // ຖ້າປິດຕົວກັ່ນຕອງ ຈະນັບລົດທຸກຄັນໃນຈໍ
    const { leftX, rightX } = this.getBounds();
    return centerX >= leftX && centerX <= rightX;
  }
}