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

  /**
   * Sets the video source from either a File object or a static URL string.
   * Automatically cleans up existing object URLs to prevent memory leaks.
   */
  public setVideoSource(file: File | string): void {
    const currentUrl = this.videoUrl();

    // Revoke object URL only if it was created dynamically via Blob/File
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }

    if (typeof file === 'string') {
      // Direct path (e.g. 'sample.mp4')
      this.videoUrl.set(file);
    } else {
      // Dynamic File uploaded by the user
      this.videoUrl.set(URL.createObjectURL(file));
    }
  }

  public setDataset(data: EmotionFrame[]): void {
    this.dataset.set(data);
  }

  public updateTime(time: number): void {
    this.currentTime.set(time);
  }
}
