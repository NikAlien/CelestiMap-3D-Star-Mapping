import { useState } from 'react';

const usePagination = (initialPage = 0, initialSize = 12) => {
    const [pagination, setPagination] = useState({
        page: initialPage,
        size: initialSize,
        totalPages: 0,
        totalElements: 0,
    });

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const updateMeta = (totalPages, totalElements) => {
        setPagination((prev) => ({ ...prev, totalPages, totalElements }));
    };

    return [pagination, handlePageChange, updateMeta];
};

export default usePagination;
