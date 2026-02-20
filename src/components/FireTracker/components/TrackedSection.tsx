import { ReactNode } from 'react';
import { useSectionTracker } from '@/components/FireTracker/hooks/useSectionTracker';

export interface TrackedSectionProps {
    /** 섹션 고유 ID (예: "hero-1") */
    id: string;
    /** 컴포넌트명 (예: "HeroSection1") */
    name: string;
    /** 섹션 카테고리 (예: "hero") */
    category: string;
    /** 버전 (예: "v1") */
    version: string;
    /** 페이지 내 순서 */
    order: number;
    /** 추적 활성화 여부 */
    enabled?: boolean;
    /** 자식 컴포넌트 */
    children: ReactNode;
    /** 추가 className */
    className?: string;
}

/**
 * 섹션 뷰 추적 래퍼 컴포넌트
 * 자식 컴포넌트를 감싸서 뷰포트 진입/이탈 시 이벤트를 추적
 */
export default function TrackedSection({
    id,
    name,
    category,
    version,
    order,
    enabled = true,
    children,
    className = '',
}: TrackedSectionProps) {
    const { ref } = useSectionTracker({
        sectionId: id,
        sectionName: name,
        sectionCategory: category,
        version,
        order,
        enabled,
    });

    return (
        <div ref={ref} className={className} data-section-id={id}>
            {children}
        </div>
    );
}
