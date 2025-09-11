export default async function downloadFileFromUrl(url: string, name: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = name;
    document.body.appendChild(link);
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
    });

    link.dispatchEvent(clickEvent);
    document.body.removeChild(link);
}
