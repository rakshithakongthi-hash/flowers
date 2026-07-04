/**
 * Utility functions to detect hand gestures from MediaPipe landmarks.
 * MediaPipe provides 21 landmarks for a hand.
 * Key landmarks:
 * 0: Wrist
 * 4: Thumb tip
 * 8: Index finger tip
 * 12: Middle finger tip
 * 16: Ring finger tip
 * 20: Pinky tip
 */

const calculateDistance = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2)
  );
};

export const detectGesture = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return "none";

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  // Calculate distances from tips to wrist
  const indexDist = calculateDistance(indexTip, wrist);
  const middleDist = calculateDistance(middleTip, wrist);
  const ringDist = calculateDistance(ringTip, wrist);
  const pinkyDist = calculateDistance(pinkyTip, wrist);

  // Distance between thumb and index for pinch
  const pinchDist = calculateDistance(thumbTip, indexTip);

  // Thresholds (these may need tuning based on z-depth/camera distance)
  const isPinching = pinchDist < 0.05;
  const isIndexOpen = indexDist > 0.35;
  const isMiddleOpen = middleDist > 0.35;
  const isRingOpen = ringDist > 0.35;
  const isPinkyOpen = pinkyDist > 0.35;
  
  const isIndexClosed = indexDist < 0.2;
  const isMiddleClosed = middleDist < 0.2;
  const isRingClosed = ringDist < 0.2;
  const isPinkyClosed = pinkyDist < 0.2;

  if (isPinching) {
    return "pinch";
  }

  if (isIndexOpen && isMiddleOpen && isRingOpen && isPinkyOpen) {
    return "open_palm";
  }

  if (isIndexClosed && isMiddleClosed && isRingClosed && isPinkyClosed) {
    return "closed_fist";
  }

  if (isIndexOpen && isMiddleClosed && isRingClosed && isPinkyClosed) {
    return "pointing";
  }

  return "none";
};
