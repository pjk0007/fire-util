export default function isImageFile(file: File) {
    const ImageFileTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/tiff',
        'image/bmp',
        'image/heic',
    ];
    return ImageFileTypes.includes(file.type);
}
