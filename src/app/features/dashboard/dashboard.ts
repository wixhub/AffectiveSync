import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { VideoProcessorService } from '../../core/services/video-processor.service';
import { TimelineSyncService } from '../../core/services/timeline-sync.service';
import { DemoMockData, EmotionFrame } from '../../core/models/affective-sync.models';
import { BASE_CHART_CONFIG, buildChartSeries } from './dashboard-chart.config';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public processor = inject(VideoProcessorService);
  public sync = inject(TimelineSyncService);
  private http = inject(HttpClient);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // Signal state management
  public currentFileName = signal<string>('sample.mp4');
  public currentTime = signal<number>(0);

  // ECharts data signals
  private chartTimestamps = signal<string[]>([]);
  private seriesJoy = signal<number[]>([]);
  private seriesSurprise = signal<number[]>([]);
  private seriesAnger = signal<number[]>([]);
  private seriesSadness = signal<number[]>([]);

  /**
   * Reactive ECharts configuration based on Signals state
   */
  public chartOption = computed(() => {
    const timestamps = this.chartTimestamps();
    const currentTimeFormatted = `${this.currentTime().toFixed(1)}s`;
    const markLine = this.createCurrentTimeMarkLine(timestamps, currentTimeFormatted);

    return {
      ...BASE_CHART_CONFIG,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' },
      },
      series: buildChartSeries(
        {
          joy: this.seriesJoy(),
          surprise: this.seriesSurprise(),
          anger: this.seriesAnger(),
          sadness: this.seriesSadness(),
        },
        markLine,
      ),
    };
  });

  ngOnInit(): void {
    // 1. Load static demo state instantly
    this.loadDemoInitialState();

    // 2. Pre-load ML models in background so processor.isReady becomes true
    this.processor.initMediaPipe().catch((err) => {
      console.error('Failed to pre-initialize MediaPipe models:', err);
    });
  }

  /**
   * Load initial sample state from JSON mock without running ML model
   */
  private loadDemoInitialState(): void {
    const demoJsonPath = 'sample-data.json';
    const sampleVideoPath = 'sample.mp4';

    this.http.get<DemoMockData>(demoJsonPath).subscribe({
      next: (demoData) => {
        this.currentFileName.set(demoData.fileName || 'sample.mp4');
        this.sync.setVideoSource(sampleVideoPath);

        // Populate initial timeline chart metrics
        this.chartTimestamps.set(demoData.timestamps);
        this.seriesJoy.set(demoData.series.joy);
        this.seriesSurprise.set(demoData.series.surprise);
        this.seriesAnger.set(demoData.series.anger);
        this.seriesSadness.set(demoData.series.sadness);
      },
      error: (err) => {
        console.warn('Failed to load initial demo JSON file:', err);
      },
    });
  }

  /**
   * Handles user custom video file selection and triggers real-time ML processing.
   */
  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 1. Instantly clear chart and set video source
      this.clearChartData();
      this.currentFileName.set(file.name);
      this.sync.setVideoSource(file);

      try {
        // 2. Process video frame-by-frame (returns Promise<EmotionFrame[]>)
        const frames = await this.processor.processVideo(file);

        // 3. Map array of frames into ECharts timeline data arrays
        this.updateChartFromEmotionFrames(frames);
      } catch (error) {
        console.error('Failed to process video file:', error);
      }
    }
  }

  /**
   * Transforms EmotionFrame[] array into structured series for ECharts
   */
  private updateChartFromEmotionFrames(frames: EmotionFrame[]): void {
    const timestamps: string[] = [];
    const joy: number[] = [];
    const surprise: number[] = [];
    const anger: number[] = [];
    const sadness: number[] = [];

    frames.forEach((frame) => {
      // Assuming frame object contains timestamp and score properties
      // Adjust key names (e.g., frame.timestamp, frame.joy) matching your EmotionFrame interface
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

  /**
   * Clears all chart series instantly
   */
  private clearChartData(): void {
    this.currentTime.set(0);
    this.chartTimestamps.set([]);
    this.seriesJoy.set([]);
    this.seriesSurprise.set([]);
    this.seriesAnger.set([]);
    this.seriesSadness.set([]);
  }

  /**
   * Updates chart datasets after ML processing completes
   */
  private updateChartWithProcessedData(data: {
    timestamps: string[];
    series: { joy: number[]; surprise: number[]; anger: number[]; sadness: number[] };
  }): void {
    this.chartTimestamps.set(data.timestamps);
    this.seriesJoy.set(data.series.joy);
    this.seriesSurprise.set(data.series.surprise);
    this.seriesAnger.set(data.series.anger);
    this.seriesSadness.set(data.series.sadness);
  }

  /**
   * Tracks video playhead time updates
   */
  public onTimeUpdate(): void {
    if (this.videoPlayer?.nativeElement) {
      this.currentTime.set(this.videoPlayer.nativeElement.currentTime);
    }
  }

  /**
   * Renders vertical playback indicator on the chart
   */
  private createCurrentTimeMarkLine(timestamps: string[], currentFormattedTime: string) {
    if (!timestamps.length) return undefined;

    return {
      symbol: ['none', 'none'],
      label: { show: false },
      lineStyle: {
        color: '#f8fafc',
        type: 'dashed',
        width: 1.5,
      },
      data: [{ xAxis: currentFormattedTime }],
    };
  }
}
