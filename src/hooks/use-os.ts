import { useEffect, useState } from 'react';

const macosPattern =
    /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)|(iPhone)|(iPad)|(iPod)/i;

const windowsPattern = /(Win32)|(Win64)|(Windows)|(WinCE)/i;

const getOS = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const { userAgent } = window.navigator;

    if (macosPattern.test(userAgent)) {
        return 'macos';
    }
    if (windowsPattern.test(userAgent)) {
        return 'windows';
    }

    return null;
};

const useOs = () => {
    const [os, setOs] = useState<'macos' | 'windows' | null>(null);

    useEffect(() => {
        setOs(getOS);
    }, []);

    return os;
};

export default useOs;
