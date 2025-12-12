const BLOB_DOWNLOAD_EXTENSIONS = ["jpeg", "jpg", "png", "gif", "webp", "svg", "tiff", "bmp", "heic", "ico", "pdf"];

function shouldUseBlobDownload(filename: string): boolean {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    return BLOB_DOWNLOAD_EXTENSIONS.includes(extension);
}

export default async function downloadFileFromUrl(url: string, name: string) {
    if (shouldUseBlobDownload(name)) {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    } else {
        const newWindow = window.open(url, "_blank");
        if (newWindow) {
            setTimeout(() => {
                newWindow.close();
            }, 1000);
        }
    }
}
