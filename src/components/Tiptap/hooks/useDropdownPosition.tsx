import { useState, useRef, useEffect } from 'react';

export default function useDropdownPosition() {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const commandRef = useRef<HTMLDivElement>(null);

    const calculatePosition = () => {
        if (!buttonRef.current || !commandRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const commandRect = commandRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = buttonRect.bottom + 4; // 버튼 아래쪽에 4px 간격
        let left = buttonRect.left;

        // 오른쪽으로 벗어나는지 확인
        if (left + commandRect.width > viewportWidth) {
            // 오른쪽 정렬로 변경
            left = buttonRect.right - commandRect.width;
            if (left < 0) {
                // 여전히 벗어나면 화면 왼쪽 가장자리에 고정
                left = 8;
            }
        }

        // 아래쪽으로 벗어나는지 확인
        if (top + commandRect.height > viewportHeight) {
            // 버튼 위쪽에 표시
            top = buttonRect.top - commandRect.height - 4;
            if (top < 0) {
                // 여전히 벗어나면 화면에 맞게 조정
                top = 8;
            }
        }

        setPosition({ top, left });
    };

    useEffect(() => {
        calculatePosition();
    }, [open]);

    return {
        open,
        setOpen,
        position,
        buttonRef,
        commandRef,
    };
}
