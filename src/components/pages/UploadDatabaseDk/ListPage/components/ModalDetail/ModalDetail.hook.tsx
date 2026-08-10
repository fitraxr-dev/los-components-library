import { useMemo, useState } from 'react';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDetail = ({ detailData }: { detailData: any }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'rowNumber',
      label: 'Row Number',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'errorMessage',
      label: 'Error Message',
      sx: { minWidth: '40vw' },
    },
  ];

  const parsedErrorMessages = useMemo(() => {
    if (!detailData?.errorMessages || !Array.isArray(detailData.errorMessages)) {
      return [];
    }

    const messages: Array<{ rowNumber: string; errorMessage: string }> = [];

    detailData.errorMessages.forEach((messageBlock: string | null) => {
      if (!messageBlock || messageBlock === 'null') return;

      const lines = messageBlock.split('\n').filter((line) => line.trim());

      lines.forEach((line) => {
        const match = line.match(/^Row\s+(\d+):\s*(.+)$/i);

        if (match) {
          messages.push({
            errorMessage: match[2].trim(),
            rowNumber: match[1],
          });
        } else {
          messages.push({
            errorMessage: line.trim(),
            rowNumber: '-',
          });
        }
      });
    });

    return messages;
  }, [detailData]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return parsedErrorMessages.slice(startIndex, endIndex);
  }, [parsedErrorMessages, page, pageSize]);

  const totalPage = Math.ceil(parsedErrorMessages.length / pageSize);

  return {
    isLoading: false,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData: paginatedData,
    tableHeader,
    totalPage,
  };
};
