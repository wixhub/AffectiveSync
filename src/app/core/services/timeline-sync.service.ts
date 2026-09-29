import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmotionFrame, DemoMockData } from '../models/affective-sync.models';

@Service()
export class TimelineSyncService {
  private http = inject(HttpClient);

  // Core App States
  public dataset = signal<EmotionFrame[]>([]);
  public currentTime = signal<number>(0);
  public videoUrl = signal<string | null>(null);
  public currentFileName = signal<string>('sample.mp4');
  public errorMessage = signal<string | null>(null);

  // ECharts Time-Series Signals
  public chartTimestamps = signal<string[]>([]);
  public seriesJoy = signal<number[]>([]);
  public seriesSurprise = signal<number[]>([]);
  public seriesAnger = signal<number[]>([]);
  public seriesSadness = signal<number[]>([]);

  public loadDemoInitialState(onLoaded?: () => void): void {
    this.errorMessage.set(null);
    this.http.get<DemoMockData>('sample-data.json').subscribe({
      next: (demoData) => {
        if (demoData) {
          this.currentFileName.set(demoData.fileName || 'sample.mp4');
          this.setVideoSource('sample.mp4');

          this.chartTimestamps.set(demoData.timestamps);
          this.seriesJoy.set(demoData.series.joy);
          this.seriesSurprise.set(demoData.series.surprise);
          this.seriesAnger.set(demoData.series.anger);
          this.seriesSadness.set(demoData.series.sadness);

          if (onLoaded) {
            onLoaded();
          }
        }
      },
      error: (err) => {
        console.error('Failed to load initial demo JSON file:', err);
        this.errorMessage.set(
          'Failed to load demo dataset. Please check your network or upload a custom file.',
        );
      },
    });
  }

  public setVideoSource(file: File | string): void {
    const currentUrl = this.videoUrl();
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }

    if (typeof file === 'string') {
      this.videoUrl.set(file);
    } else {
      this.videoUrl.set(URL.createObjectURL(file));
      this.currentFileName.set(file.name);
    }
  }

  public updateChartFromEmotionFrames(frames: EmotionFrame[], fileName?: string): void {
    if (fileName) {
      this.currentFileName.set(fileName);
    }

    const timestamps: string[] = [];
    const joy: number[] = [];
    const surprise: number[] = [];
    const anger: number[] = [];
    const sadness: number[] = [];

    frames.forEach((frame) => {
      timestamps.push(`${frame.timestamp.toFixed(1)}s`);
      joy.push(frame.joy ?? 0);
      surprise.push(frame.surprise ?? 0);
      anger.push(frame.anger ?? 0);
      sadness.push(frame.sadness ?? 0);
    });

    this.chartTimestamps.set(timestamps);
    this.seriesJoy.set(joy);
    this.seriesSurprise.set(surprise);
    this.seriesAnger.set(anger);
    this.seriesSadness.set(sadness);
  }

  public clearChartData(): void {
    this.currentTime.set(0);
    this.chartTimestamps.set([]);
    this.seriesJoy.set([]);
    this.seriesSurprise.set([]);
    this.seriesAnger.set([]);
    this.seriesSadness.set([]);
    this.errorMessage.set(null);
  }

  public updateTime(time: number): void {
    this.currentTime.set(time);
  }
}
