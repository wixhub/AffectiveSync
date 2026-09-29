// Single data point for ECharts timeline
export interface EmotionFrame {
  timestamp: number; // Video timestamp in seconds (e.g., 1.4)
  joy: number; // Joy / Smile intensity (0.0 to 1.0)
  surprise: number; // Surprise level (0.0 to 1.0)
  anger: number; // Anger / Eyebrow furrow (0.0 to 1.0)
  sadness: number; // Sadness level (0.0 to 1.0)
}

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

export interface MarkLineOptions {
  symbol: string[];
  label: { show: boolean };
  lineStyle: {
    color: string;
    type: string;
    width: number;
  };
  data: Array<{ xAxis: string }>;
}
