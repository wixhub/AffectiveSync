/// <reference lib="webworker" />

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import {
  EmotionFrame,
  WorkerInputMessage,
  WorkerOutputMessage,
} from './models/affective-sync.models';

let faceLandmarker: FaceLandmarker | null = null;

function sendToMain(message: WorkerOutputMessage) {
  postMessage(message);
}

// Initialize MediaPipe Face Landmarker safely inside ES Module Worker
async function initMediaPipe() {
  try {
    // CDN path for WASM runtime loader
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'CPU', // Using CPU delegate inside worker guarantees max stability across browsers
      },
      outputFaceBlendshapes: true,
      runningMode: 'IMAGE',
    });

    sendToMain({ type: 'READY' });
  } catch (err) {
    sendToMain({ type: 'ERROR', payload: 'Failed to initialize MediaPipe: ' + String(err) });
  }
}

function parseBlendshapes(
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

addEventListener('message', async ({ data }: { data: WorkerInputMessage }) => {
  if (data.type === 'INIT') {
    await initMediaPipe();
    return;
  }

  if (data.type === 'PROCESS_FRAME') {
    if (!faceLandmarker) return;

    const { imageBitmap, timestamp } = data.payload;

    try {
      const result = faceLandmarker.detect(imageBitmap);
      imageBitmap.close(); // Clean memory immediately

      const blendshapes = result.faceBlendshapes[0]?.categories || [];
      const frameData = parseBlendshapes(blendshapes, timestamp);

      sendToMain({
        type: 'FRAME_PROCESSED',
        payload: frameData,
      });
    } catch (err) {
      imageBitmap.close();
      sendToMain({ type: 'ERROR', payload: 'Frame processing error: ' + String(err) });
    }
  }
});
