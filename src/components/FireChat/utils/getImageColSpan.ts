export default function getImageColSpan(total: number, index: number) {
    const remainder = total % 3;
    let colSpan = 'col-span-2';
    if (total === 1) {
        colSpan = 'col-span-6';
    } else if (remainder === 1) {
        if (index >= total - 4) {
            colSpan = 'col-span-3';
        } else {
            colSpan = 'col-span-2';
        }
    } else if (remainder === 2) {
        if (index >= total - 2) {
            colSpan = 'col-span-3';
        } else {
            colSpan = 'col-span-2';
        }
    } else {
        colSpan = 'col-span-2';
    }

    return colSpan;
}
