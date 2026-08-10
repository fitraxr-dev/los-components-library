import { useEffect, useState } from 'react';

import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import useGetAllProcess from '../../hooks/useGetAllProces';
import useGetInquiryDataList from '../../hooks/useGetInquiryDataList';
import useGetStatusByProcess from '../../hooks/useGetStatusByProcess';

import { TABLE_HEADER_LIST } from './InquiryData.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { InquiryDataResponseDto } from '@/services/openapi/loan-service';


export const useInquiryData = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('inquiry-dashboard', {
    filter: { module: '', process: '', status: []},
  });

  const [initialInquirySearch, setInitialInquirySearch] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [allStatus, setAllStatus] = useState(null);

  const [selectedProcess, setSelectedProcess] = useState(null);

  const routeHandler = (props: InquiryDataResponseDto & { url: string }) => {
    if (props.url) {
      router.push(setPreviewPage(props.url, 'dashboard'));
    } else {
      showNiceModalV2({
        title: 'URL tidak ditemukan!',
        type: 'error',
      });
    }
  };

  const { data: filterInquiryDataList } = useGetParameterList(Modules.SEARCH_INQUIRY_DATA,
    {
      label: 'value1',
      value: 'value2',
    }
  );
  const { data: sortByInquiryDataList } = useGetParameterList(Modules.SORT_INQUIRY_DATA,
    {
      label: 'value1',
      value: 'value2',
    }
  );
  const { data: bucketProcessList } = useGetAllProcess();

  const allProcess = bucketProcessList?.contents.map((data) => ({
    label: data?.label,
    value: data?.process,
  }));

  const { data: statusList } = useGetStatusByProcess({
    module: selectedProcess?.module,
    process: selectedProcess?.process,
  });

  useEffect(() => {
    const temp = bucketProcessList?.contents?.find((dt) => dt.process === filter?.filter?.process);
    setSelectedProcess({
      module: temp?.module,
      process: temp?.process,
    });

  }, [filter?.filter?.process, bucketProcessList]);

  useEffect(() => {
    setAllStatus(statusList?.contents.map((data) => ({
      label: data.statusLabel,
      value: data.status,
    })));
  }, [statusList]);

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      key: 'action',
      label: 'Action',
      options: [{ iconName: 'detail', onClick: (props) => routeHandler(props) }],
      type: 'action',
    },
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByInquiryDataList,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'process',
      label: 'Process',
      options: allProcess ?? [],
      type: 'autocomplete',
      watch: (value: any) => {
        const getData = bucketProcessList?.contents?.find((dt) => dt.process === value);
        setFilter((prev) => ({ ...prev, filter: { ...prev?.filter, status: []} }));
        setSelectedProcess(
          getData ??
          { module: null, process: null }
        );
      },
    },
    {
      isDisabled: selectedProcess?.module === null,
      key: 'status',
      label: 'Status',
      options: allStatus,
      type: 'multiple-autocomplete',
    }
  ];

  useEffect(() => {
    if (!initialInquirySearch && (filter?.searchDetail?.value || filter?.filter !== undefined)) {
      setInitialInquirySearch(true);
    }
  }, [filter, initialInquirySearch]);

  const { data: inquiryData, isLoading } = useGetInquiryDataList({
    filter: {
      ...filter?.filter,
      module: bucketProcessList?.contents?.find((dt) => dt.process === filter?.filter?.process)?.module,
      status: filter?.filter?.status?.flatMap((item) => item?.split('|')),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  }, { enabled: initialInquirySearch });

  return {
    filter,
    filterContentList,
    filterInquiryDataList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: inquiryData?.contents,
    tableHeader,
    totalPage: inquiryData?.page?.totalPage,
  };
};
