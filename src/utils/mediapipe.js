import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let handLandmarkerInstance = null;

/**
 * Initializes and returns a singleton instance of the MediaPipe HandLandmarker.
 * @returns {Promise<HandLandmarker>} The initialized HandLandmarker instance.
 */
export const initializeHandLandmarker = async () => {
  if (handLandmarkerInstance) {
    return handLandmarkerInstance;
  }

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    
    handLandmarkerInstance = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return handLandmarkerInstance;
  } catch (error) {
    console.error("Error initializing MediaPipe HandLandmarker:", error);
    throw error;
  }
};
