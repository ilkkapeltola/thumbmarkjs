import { componentInterface, includeComponent } from '../../factory'
import { hash } from '../../utils/hash'

/**
 * A simple canvas finger printing function
 * 
 * @returns a CanvasInfo JSON object
 */

const _WIDTH = 280;
const _HEIGHT = 20;

export default function generateCanvasFingerprint(): Promise<componentInterface> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    return new Promise((resolve) => {

        /**
         * Since some browsers fudge with the canvas pixels to prevent fingerprinting, the following
         * creates the canvas three times and getCommonPixels picks the most common byte for each
         * channel of each pixel.
         */
        const imageDatas: ImageData[] = Array.from({length: 3}, () => generateCanvasImageData() );
        const commonImageData = getCommonPixels(imageDatas);

        resolve(
            {
                'commonImageDataHash': hash(commonImageData.data.toString()).toString()
            }
        )
    });
}

function generateCanvasImageData(): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return new ImageData(1,1);
    }

    // Set canvas dimensions
    canvas.width = _WIDTH;
    canvas.height = _HEIGHT;

    // Create rainbow gradient for the background rectangle
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1/6, "orange");
    gradient.addColorStop(2/6, "yellow");
    gradient.addColorStop(3/6, "green");
    gradient.addColorStop(4/6, "blue");
    gradient.addColorStop(5/6, "indigo");
    gradient.addColorStop(1, "violet");

    // Draw background rectangle with the rainbow gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some random text
    const randomText = 'Random Text WMwmil10Oo';
    ctx.font = '23.123px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(randomText, -5, 15);

    // Draw the same text with an offset, different color, and slight transparency
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.fillText(randomText, -3.3, 17.7);

    // Draw a line crossing the image at an arbitrary angle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width * 2/7, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Return data URL of the canvas
    return imageData;
}

function getMostFrequent(arr: number[]): number {
    if (arr.length === 0) {
      return 0; // Handle empty array case
    }
  
    const frequencyMap: { [key: number]: number } = {};
    
    // Count occurrences of each number in the array
    for (const num of arr) {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    }
  
    let mostFrequent: number = arr[0];
    
    // Find the number with the highest frequency
    for (const num in frequencyMap) {
      if (frequencyMap[num] > frequencyMap[mostFrequent]) {
        mostFrequent = parseInt(num, 10);
      }
    }
  
    return mostFrequent;
  }

export function getCommonPixels(images: ImageData[], width = _WIDTH, height = _HEIGHT ): ImageData {
    let finalData: number[] = [];
    for (let i = 0; i < images[0].data.length; i++) {
        let indice: number[] = [];
        for (let u = 0; u < images.length; u++) {
            indice.push(images[u].data[i]);
        }
        finalData.push(getMostFrequent(indice));
    }

    const pixelData = finalData;
    const pixelArray = new Uint8ClampedArray(pixelData);
    return new ImageData(pixelArray, width, height);
}

includeComponent('canvas', generateCanvasFingerprint);