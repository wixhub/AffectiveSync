import { Injectable, signal } from '@angular/core';
import { EmotionFrame } from '../models/affective-sync.models';

@Injectable({
  providedIn: 'root',
})
export class TimelineSyncService {
  // Parsed emotion dataset
  public dataset = signal<EmotionFrame[]>([]);

  // Current playback timestamp from video element
  public currentTime = signal<number>(0);

  // Video source URL for the main video player
  public videoUrl = signal<string | null>(null);

  public setVideoSource(file: File): void {
    if (this.videoUrl()) {
      URL.revokeObjectURL(this.videoUrl()!);
    }
    this.videoUrl.set(URL.createObjectURL(file));
  }

  public setDataset(data: EmotionFrame[]): void {
    this.dataset.set(data);
  }

  public updateTime(time: number): void {
    this.currentTime.set(time);
  }
}
