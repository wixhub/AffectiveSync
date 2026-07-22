import { Injectable, signal } from '@angular/core';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { EmotionFrame } from '../models/affective-sync.models';

@Injectable({
  providedIn: 'root',
})
export class VideoProcessorService {
  public isReady = signal<boolean>(false);
  public isProcessing = signal<boolean>(false);
  public progress = signal<number>(0);

  private landmarker: FaceLandmarker | null = null;

  constructor() {}

  /**
   * Lazy initializes the MediaPipe FaceLandmarker instance.
   * Prevents blocking application startup by loading WASM assets on demand.
   */
  public async initMediaPipe(): Promise<void> {
    if (this.landmarker) return;

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    this.landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode: 'IMAGE',
    });

    this.isReady.set(true);
  }

  /**
   * Processes input video file frame-by-frame and calculates facial expression weights.
   */
  public async processVideo(file: File, stepSeconds: number = 0.2): Promise<EmotionFrame[]> {
    // Ensure ML models are loaded prior to video processing
    await this.initMediaPipe();

    if (!this.landmarker) throw new Error('MediaPipe not initialized');

    this.isProcessing.set(true);
    this.progress.set(0);

    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    await new Promise((res) => (video.onloadedmetadata = res));

    const duration = video.duration;
    const results: EmotionFrame[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    let currentTime = 0;

    while (currentTime <= duration) {
      video.currentTime = currentTime;
      await new Promise((res) => (video.onseeked = res));

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Perform detection on current canvas frame
      const detection = this.landmarker.detect(canvas);
      const categories = detection.faceBlendshapes[0]?.categories || [];

      results.push(this.parseBlendshapes(categories, currentTime));

      currentTime += stepSeconds;
      this.progress.set(Math.min(100, Math.round((currentTime / duration) * 100)));
    }

    URL.revokeObjectURL(video.src);
    this.isProcessing.set(false);
    return results;
  }

  /**
   * Maps MediaPipe blendshape coefficients into high-level emotion categories.
   */
  private parseBlendshapes(
    categories: Array<{ categoryName: string; score: number }>,
    timestamp: number,
  ): EmotionFrame {
    const getScore = (name: string) => categories.find((c) => c.categoryName === name)?.score || 0;

    const joy = (getScore('mouthSmileLeft') + getScore('mouthSmileRight')) / 2;
    const surprise = (getScore('browInnerUp') + getScore('jawOpen')) / 2;
    const anger =
      (getScore('browDownLeft') + getScore('browDownRight') + getScore('noseSneerLeft')) / 3;
    const sadness =
      (getScore('mouthFrownLeft') + getScore('mouthFrownRight') + getScore('browOuterUpLeft')) / 3;

    return {
      timestamp: Number(timestamp.toFixed(1)),
      joy: Number(joy.toFixed(2)),
      surprise: Number(surprise.toFixed(2)),
      anger: Number(anger.toFixed(2)),
      sadness: Number(sadness.toFixed(2)),
    };
  }
}
