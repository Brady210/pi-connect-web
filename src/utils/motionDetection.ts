export const detectMotion = (
  prevFrame: ImageData | null,
  currentFrame: ImageData,
  threshold: number = 30,
  minPixelChange: number = 1000
): boolean => {
  if (!prevFrame) return false;

  const length = currentFrame.data.length;
  let changedPixels = 0;

  for (let i = 0; i < length; i += 4) {
    const rDiff = Math.abs(currentFrame.data[i] - prevFrame.data[i]);
    const gDiff = Math.abs(currentFrame.data[i + 1] - prevFrame.data[i + 1]);
    const bDiff = Math.abs(currentFrame.data[i + 2] - prevFrame.data[i + 2]);

    if (rDiff > threshold || gDiff > threshold || bDiff > threshold) {
      changedPixels++;
    }
  }

  return changedPixels > minPixelChange;
};