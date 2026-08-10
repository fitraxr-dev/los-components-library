import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterSLAGroupDetail from '../../hooks/useGetParameterSLAGroupDetail';
import useGetParameterSLASubmissionDetail from '../../hooks/useGetParameterSLASubmissionDetail';

import { MODAL, TABLE_HEADER } from './TabProcess.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabProcess = () => {
  const { isViewOnly, processId, isBucketProcessId } = useMasterParameter();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const parameterSLAGroupDetail = useGetParameterSLAGroupDetail({
    module: String(processId),
  });
  const parameterSLASubmissionDetail = useGetParameterSLASubmissionDetail({
    bucketProcessId: processId,
  }, { enabled: isBucketProcessId });
  const { data: parameterSLADetailData, isFetching: isLoading } =
    isBucketProcessId
      ? parameterSLASubmissionDetail
      : parameterSLAGroupDetail;

  const actionColumn: TableHeader[] = !isViewOnly ? [
    {
      key: 'action',
      label: 'Action',
      options: (row) => [
        {
          iconName: 'edit',
          isDisabled: !row?.isEditable,
          onClick: () => {
            NiceModal.show(MODAL.EDIT_PROCESS_SLA_MODAL, { id: row.id });
          },
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ] : [];

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    ...actionColumn
  ];

  const tableData = isBucketProcessId ? [parameterSLADetailData?.content] : parameterSLADetailData?.contents ?? [];

  return {
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage: parameterSLADetailData?.page?.totalPage,
  };
};

export default useTabProcess;
