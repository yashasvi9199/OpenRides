// * 1D Kalman Filter implementation for coordinate tracking smoothing.
export class KalmanFilter1D {
  private q: number; // Process noise covariance
  private r: number; // Measurement noise covariance
  private x: number | null = null; // Estimated value state
  private p: number = 1.0; // Estimation error covariance

  constructor(processNoise: number = 0.0001, measurementNoise: number = 0.0003) {
    this.q = processNoise;
    this.r = measurementNoise;
  }

  // * Apply Kalman updates to raw coordinates values
  public filter(measurement: number): number {
    if (this.x === null) {
      this.x = measurement;
      return measurement;
    }

    // Prediction update state equations
    this.p = this.p + this.q;

    // Measurement correction update equations
    const k = this.p / (this.p + this.r); // Kalman gain calculation
    this.x = this.x + k * (measurement - this.x);
    this.p = (1 - k) * this.p;

    return this.x;
  }

  // * Reset filter states
  public reset(): void {
    this.x = null;
    this.p = 1.0;
  }
}
