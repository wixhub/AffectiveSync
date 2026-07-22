import { Component, ElementRef, OnInit, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { VideoProcessorService } from '../../core/services/video-processor.service';
import { TimelineSyncService } from '../../core/services/timeline-sync.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  public processor = inject(VideoProcessorService);
  public sync = inject(TimelineSyncService);

  ngOnInit(): void {
    // Triggers non-blocking background loading of MediaPipe models right after component mounts
    this.processor.initMediaPipe().catch((err: unknown) => {
      console.error('Failed to preload ML models:', err);
    });
  }

  // Compute ECharts option dynamically based on processed dataset and video position
  public chartOption = computed<EChartsOption>(() => {
    const dataset = this.sync.dataset();
    const currentTime = this.sync.currentTime();

    const timestamps = dataset.map((d) => d.timestamp.toFixed(1) + 's');
    const joyData = dataset.map((d) => d.joy);
    const surpriseData = dataset.map((d) => d.surprise);
    const angerData = dataset.map((d) => d.anger);
    const sadnessData = dataset.map((d) => d.sadness);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        top: '2%',
        right: '2%',
        data: ['Joy', 'Surprise', 'Anger', 'Sadness'],
        textStyle: { color: '#e2e8f0' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLabel: { color: '#94a3b8' },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: { color: '#94a3b8' },
      },
      series: [
        { name: 'Joy', type: 'line', smooth: true, data: joyData, itemStyle: { color: '#22c55e' } },
        {
          name: 'Surprise',
          type: 'line',
          smooth: true,
          data: surpriseData,
          itemStyle: { color: '#eab308' },
        },
        {
          name: 'Anger',
          type: 'line',
          smooth: true,
          data: angerData,
          itemStyle: { color: '#ef4444' },
        },
        {
          name: 'Sadness',
          type: 'line',
          smooth: true,
          data: sadnessData,
          itemStyle: { color: '#3b82f6' },
        },
      ],
    };
  });

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.sync.setVideoSource(file);

    try {
      // Process video frames via Web Worker
      const frames = await this.processor.processVideo(file, 0.2);
      this.sync.setDataset(frames);
    } catch (err) {
      console.error('Failed to process video file:', err);
    }
  }

  public onTimeUpdate(): void {
    if (this.videoPlayer?.nativeElement) {
      this.sync.updateTime(this.videoPlayer.nativeElement.currentTime);
    }
  }
}
