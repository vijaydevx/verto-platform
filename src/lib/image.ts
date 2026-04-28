const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1080;
const OUTPUT_TYPE = "image/webp";
const TARGET_SIZE_BYTES = 500 * 1024;
const MIN_QUALITY = 0.55;
const QUALITY_STEP = 0.08;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the selected image."));
    };

    image.src = objectUrl;
  });
}

function calculateDimensions(width: number, height: number) {
  if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
    return { width, height };
  }

  const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        resolve(blob);
      },
      OUTPUT_TYPE,
      quality,
    );
  });
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  const image = await loadImage(file);
  const { width, height } = calculateDimensions(image.width, image.height);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Your browser does not support image processing.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  let quality = 0.92;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > TARGET_SIZE_BYTES && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    blob = await canvasToBlob(canvas, quality);
  }

  const fileName = file.name.replace(/\.[^.]+$/, "") || "upload";

  return new File([blob], `${fileName}.webp`, {
    type: OUTPUT_TYPE,
    lastModified: Date.now(),
  });
}

export function createObjectPreview(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeObjectPreview(previewUrl: string) {
  URL.revokeObjectURL(previewUrl);
}

