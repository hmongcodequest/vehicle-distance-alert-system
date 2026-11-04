export class LabSimulator {
  constructor(safeLimit = 30.0) {
    this.safeLimit = safeLimit;
  }

  calculate(W, F, P) {
    const distance = (W * F) / P;
    const expectedPixelAt30m = (W * F) / this.safeLimit;
    const isDanger = distance < this.safeLimit;

    return {
      W,
      F,
      P,
      distance,
      expectedPixelAt30m,
      isDanger
    };
  }
}