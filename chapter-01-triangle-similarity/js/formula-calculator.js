export class FormulaCalculator {
  constructor(knownWidth = 1.8, focalLength = 800, safeLimit = 30.0) {
    this.W = knownWidth;      // 1.8 ແມັດ
    this.F = focalLength;     // 800 Pixels
    this.safeLimit = safeLimit; // 30.0 ແມັດ
  }

  /**
   * ຄິດໄລ່ຫາຄວາມກວ້າງ Pixel (P) ເມື່ອຮູ້ໄລຍະຫ່າງ (D)
   * ສູດ: P = (W * F) / D
   */
  getPixelWidthFromDistance(distance) {
    return (this.W * this.F) / distance;
  }

  /**
   * ຄິດໄລ່ຫາໄລຍະຫ່າງ (D) ເມື່ອຮູ້ຄວາມກວ້າງ Pixel (P)
   * ສູດ: D = (W * F) / P
   */
  getDistanceFromPixels(pixelWidth) {
    return (this.W * this.F) / pixelWidth;
  }

  /**
   * ກວດສອບວ່າໄລຍະຫ່າງປອດໄພ ຫຼື ອັນຕະລາຍ (< 30m)
   */
   evaluateSafety(distance) {
    return {
      distance: distance,
      pixelWidth: this.getPixelWidthFromDistance(distance),
      isDanger: distance < this.safeLimit
    };
  }
}