// Single data point for ECharts timeline
export interface EmotionFrame {
  timestamp: number; // Video timestamp in seconds (e.g., 1.4)
  joy: number; // Joy / Smile intensity (0.0 to 1.0)
  surprise: number; // Surprise level (0.0 to 1.0)
  anger: number; // Anger / Eyebrow furrow (0.0 to 1.0)
  sadness: number; // Sadness level (0.0 to 1.0)
}

// Commands sent from Main Thread (Angular) to Web Worker
export type WorkerInputMessage =
  | { type: 'INIT' }
  | { type: 'PROCESS_FRAME'; payload: { imageBitmap: ImageBitmap; timestamp: number } };

// Messages sent from Web Worker back to Main Thread
export type WorkerOutputMessage =
  | { type: 'READY' }
  | { type: 'FRAME_PROCESSED'; payload: EmotionFrame }
  | { type: 'ERROR'; payload: string };

export interface DemoMockData {
  fileName: string;
  duration: number;
  timestamps: string[];
  series: {
    joy: number[];
    surprise: number[];
    anger: number[];
    sadness: number[];
  };
}
