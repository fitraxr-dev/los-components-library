import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';


import { mip, analyst, pipeline } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import useGetTodoList from '../../hooks/useGetTodoList';


import type { TodolistResponseDto } from '@/services/openapi/loan-service';


const useTodoList = () => {
  const [filter, setFilter] = useSessionStorage('todolist-dashboard', { filter: {
    debtorName: '',
    endDate: '',
    startDate: '' },
  });

  const pathname = usePathname();
  const [state, dispatch] = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useCustomRouter();

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);


  const { data, isLoading } = useGetTodoList({
    filter: {
      debtorName: filter?.filter?.debtorName || '',
      endDate: filter?.filter?.endDate || undefined,
      startDate: filter?.filter?.startDate || undefined,
    },
    page: {
      itemPerPage: pageSize,
      noPage: currentPage,
    },
  });

  const dataContents = data?.contents;
  const dataPage = data?.page;


  const onClickHandler = (item: TodolistResponseDto) => {
    router.push(item.url);
  };


  return {
    currentPage,
    data: dataContents,
    filter,
    isLoading,
    onClickHandler,
    page: dataPage,
    pageSize,
    setCurrentPage,
    setFilter,
    setPageSize,
  };
};

export default useTodoList;
