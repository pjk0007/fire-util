import FirePostEmpty from '@/components/FirePost/FirePostEmpty';
import FirePostItem from '@/components/FirePost/FirePostItem';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { FireUser } from '@/lib/FireAuth/settings';
import { FirePost, POST_ID_FIELD, POST_IS_PINNED_FIELD, PostType } from '@/lib/FirePost/settings';
import React, { useState } from 'react';

interface FirePostListProps<U extends FireUser> {
    posts: FirePost<U>[];
    type: PostType;
    onPostClick?: (post: FirePost<U>) => void;
    itemsPerPage?: number;
}

export default function FirePostList<U extends FireUser>({
    posts,
    type,
    onPostClick,
    itemsPerPage = 10,
}: FirePostListProps<U>) {
    const [currentPage, setCurrentPage] = useState(1);

    if (posts.length === 0) {
        return <FirePostEmpty type={type} />;
    }

    // Sort: pinned first, then by created date
    const sortedPosts = [...posts].sort((a, b) => {
        if (a[POST_IS_PINNED_FIELD] !== b[POST_IS_PINNED_FIELD]) {
            return a[POST_IS_PINNED_FIELD] ? -1 : 1;
        }
        return b.time.toMillis() - a.time.toMillis();
    });

    // Pagination
    const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = sortedPosts.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of the list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {currentPosts.map((post, i) => (
                    <FirePostItem
                        key={i}
                        post={post}
                        onClick={() => onPostClick?.(post)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        총 {sortedPosts.length}개 ({currentPage} / {totalPages}{' '}
                        페이지)
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) {
                                            goToPage(currentPage - 1);
                                        }
                                    }}
                                    aria-disabled={currentPage === 1}
                                    className={
                                        currentPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    // Show first, last, current, and adjacent pages
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, idx, arr) => {
                                    // Add ellipsis
                                    const prevPage = arr[idx - 1];
                                    const showEllipsis =
                                        prevPage && page - prevPage > 1;

                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        goToPage(page);
                                                    }}
                                                    isActive={
                                                        currentPage === page
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </React.Fragment>
                                    );
                                })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) {
                                            goToPage(currentPage + 1);
                                        }
                                    }}
                                    aria-disabled={currentPage === totalPages}
                                    className={
                                        currentPage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
