import type { IAnnotationElement } from '../types';

/**
 * 이미지 URL을 로드하여 Image 객체로 반환
 */
async function loadImage(imageUrl: string): Promise<HTMLImageElement> {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
    });

    return img;
}

/**
 * 어노테이션 엘리먼트를 캔버스에 그리기
 */
function drawElement(
    ctx: CanvasRenderingContext2D,
    element: IAnnotationElement,
    width: number,
    height: number
): void {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const startX = element.startX * width;
    const startY = element.startY * height;
    const endX = (element.endX ?? element.startX) * width;
    const endY = (element.endY ?? element.startY) * height;

    switch (element.tool) {
        case 'pencil':
            if (element.path && element.path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(element.path[0].x * width, element.path[0].y * height);
                element.path.forEach((point) => {
                    ctx.lineTo(point.x * width, point.y * height);
                });
                ctx.stroke();
            }
            break;
        case 'rect':
            ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            break;
        case 'circle':
            const rx = Math.abs(endX - startX) / 2;
            const ry = Math.abs(endY - startY) / 2;
            const cx = Math.min(startX, endX) + rx;
            const cy = Math.min(startY, endY) + ry;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
            ctx.stroke();
            break;
        case 'text':
            if (element.text) {
                ctx.font = 'bold 32px system-ui, sans-serif';
                ctx.fillText(element.text, startX, startY);
            }
            break;
    }
}

/**
 * 이미지에 어노테이션을 그려서 Blob으로 반환
 */
export async function captureAnnotatedImage(
    imageUrl: string,
    elements: IAnnotationElement[]
): Promise<Blob> {
    // 1. 이미지 로드
    const img = await loadImage(imageUrl);

    // 2. 캔버스 생성 및 이미지 그리기
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context error');

    ctx.drawImage(img, 0, 0);

    // 3. 어노테이션 요소들 그리기
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    elements.forEach((element) => {
        drawElement(ctx, element, width, height);
    });

    // 4. Blob으로 변환
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to create blob'));
            }
        }, 'image/png', 1.0);
    });
}
