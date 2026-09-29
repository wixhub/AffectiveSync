import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';

import { VideoProcessorService } from '../../core/services/video-processor.service';
import { TimelineSyncService } from '../../core/services/timeline-sync.service';
import { MarkLineOptions } from '../../core/models/affective-sync.models';
import { BASE_CHART_CONFIG, buildChartSeries } from './dashboard-chart.config';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  public processor = inject(VideoProcessorService);
  public sync = inject(TimelineSyncService);

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  public chartOption = computed(() => {
    const timestamps = this.sync.chartTimestamps();
    const currentTimeFormatted = `${this.sync.currentTime().toFixed(1)}s`;
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
          joy: this.sync.seriesJoy(),
          surprise: this.sync.seriesSurprise(),
          anger: this.sync.seriesAnger(),
          sadness: this.sync.seriesSadness(),
        },
        markLine,
      ),
    };
  });

  ngOnInit(): void {
    this.sync.loadDemoInitialState(() => {
      this.playVideoSafely();
    });

    this.processor.initialize().catch((err) => {
      console.error('Failed to pre-initialize MediaPipe models:', err);
    });
  }

  ngAfterViewInit(): void {
    this.playVideoSafely();
  }

  private playVideoSafely(): void {
    setTimeout(() => {
      if (this.videoPlayer?.nativeElement) {
        this.videoPlayer.nativeElement.muted = true;
        this.videoPlayer.nativeElement.play().catch((error) => {
          console.warn('Browser autoplay prevented or interrupted:', error);
        });
      }
    }, 150);
  }

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.sync.clearChartData();
      this.sync.setVideoSource(file);

      try {
        // 1. Wait for frame-by-frame ML processing to finish
        const frames = await this.processor.processVideo(file);

        // 2. Update chart metrics with processed data
        this.sync.updateChartFromEmotionFrames(frames, file.name);

        // 3. Trigger playback right after analysis completes successfully
        this.playVideoSafely();
      } catch (error) {
        console.error('Failed to process video file:', error);
        this.sync.errorMessage.set('Failed to analyze facial expressions from the selected video.');
      }
    }
  }

  public onTimeUpdate(): void {
    if (this.videoPlayer?.nativeElement) {
      this.sync.updateTime(this.videoPlayer.nativeElement.currentTime);
    }
  }

  private createCurrentTimeMarkLine(
    timestamps: string[],
    currentFormattedTime: string,
  ): MarkLineOptions | undefined {
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
