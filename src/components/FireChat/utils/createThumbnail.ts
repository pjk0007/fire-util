import isImageFile from "@/lib/FireUtil/isImageFile";

export default async function createThumbnail(
    file: File,
    maxSize = 200
): Promise<string> {
    const fileType = file.type;
    if (!isImageFile(file)) {
        throw new Error('Not an image file');
    }
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(
                maxSize / img.width,
                maxSize / img.height,
                1
            );
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Canvas error');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL(fileType, 0.7)); // 썸네일 base64 반환
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
