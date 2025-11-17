/**
 * Watermark utility for adding "AI Enhanced" watermark to images
 */

export interface WatermarkOptions {
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export async function addWatermark(
  imageUrl: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const {
    text = 'AI Enhanced',
    position = 'bottom-right',
    opacity = 0.5,
    fontSize = 24,
    fontFamily = 'Arial, sans-serif',
    color = '#FFFFFF',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Set watermark style
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;

        // Measure text for positioning
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        // Calculate position
        let x = 0;
        let y = 0;
        const padding = 20;

        switch (position) {
          case 'top-left':
            x = padding;
            y = padding + textHeight;
            break;
          case 'top-right':
            x = canvas.width - textWidth - padding;
            y = padding + textHeight;
            break;
          case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            break;
          case 'bottom-right':
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
            break;
          case 'center':
            x = (canvas.width - textWidth) / 2;
            y = canvas.height / 2;
            break;
        }

        // Add semi-transparent background for better readability
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 10, y - textHeight - 5, textWidth + 20, textHeight + 15);

        // Draw watermark text
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);

        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

export async function downloadImageWithWatermark(
  imageUrl: string,
  filename: string = 'edited-image.png',
  addWatermarkFlag: boolean = true
): Promise<void> {
  try {
    let downloadUrl = imageUrl;

    if (addWatermarkFlag) {
      downloadUrl = await addWatermark(imageUrl);
    }

    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL if watermark was added
    if (addWatermarkFlag && downloadUrl !== imageUrl) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}
