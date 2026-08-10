import { useState, useMemo } from 'react';

import { useTheme } from '@mui/material';

import { TABLE_HEADER } from '../../Detail.constants';
import useGetDetailDocument from '../../hooks/useGetDetailDocument';


const useTabDppspm = (uploadId: number) => {
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const payload = useMemo(() => ({
    filter: {
      category: 'DPPSPM',
      uploadId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  }), [uploadId, page, pageSize]);

  const { data, isLoading } = useGetDetailDocument(payload);

  const tableData = useMemo(() => {
    if (!data?.data?.contents) return [];

    return data.data.contents.map((item) => ({
      ...item,
      birthDate: item.birthDate === 'null' || !item.birthDate ? null : item.birthDate,
    }));
  }, [data]);

  const tableHeader = TABLE_HEADER;

  return {
    isLoading,
    page,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    theme,
    totalPage: data?.data?.page?.totalPage || 1,
  };
};

export default useTabDppspm;
