import { Service, signal } from '@angular/core';
import { EmotionFrame } from '../models/affective-sync.models';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

@Service()
export class VideoProcessorService {
  public readonly isReady = signal<boolean>(false);
  public readonly isProcessing = signal<boolean>(false);
  public readonly progress = signal<number>(0);

  public async initialize(): Promise<void> {
    await this.initMediaPipe();
  }

  private faceLandmarker: FaceLandmarker | null = null;

  constructor() {
    this.initMediaPipe();
  }

  private async initMediaPipe(): Promise<void> {
    if (this.faceLandmarker) return;

    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'CPU',
        },
        outputFaceBlendshapes: true,
        runningMode: 'IMAGE',
      });

      this.isReady.set(true);
    } catch (err) {
      console.error('Failed to initialize MediaPipe:', err);
    }
  }

  public async processVideo(file: File, stepSeconds: number = 0.2): Promise<EmotionFrame[]> {
    if (!this.faceLandmarker) {
      await this.initMediaPipe();
    }
    if (!this.faceLandmarker) throw new Error('MediaPipe not initialized');

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

      const imageBitmap = await createImageBitmap(canvas);
      const timestamp = Number(currentTime.toFixed(1));

      try {
        const result = this.faceLandmarker.detect(imageBitmap);
        imageBitmap.close();

        const blendshapes = result.faceBlendshapes[0]?.categories || [];
        const frameData = this.parseBlendshapes(blendshapes, timestamp);
        results.push(frameData);
      } catch (err) {
        imageBitmap.close();
        console.error('Frame processing failed at time:', timestamp, err);
      }

      currentTime += stepSeconds;
      this.progress.set(Math.min(100, Math.round((currentTime / duration) * 100)));
    }

    URL.revokeObjectURL(video.src);
    this.isProcessing.set(false);
    return results;
  }

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
      timestamp,
      joy: Number(joy.toFixed(2)),
      surprise: Number(surprise.toFixed(2)),
      anger: Number(anger.toFixed(2)),
      sadness: Number(sadness.toFixed(2)),
    };
  }
}
