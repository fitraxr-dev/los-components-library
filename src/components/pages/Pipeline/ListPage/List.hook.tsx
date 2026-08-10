'use client';
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE, roles } from '@/configs/constants';
import { accessid, pipeline } from '@/configs/constants/pathname';
import { PIPELINE_STATUS } from '@/configs/constants/pipeline';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteBucket from '@/components/pages/Pipeline/ListPage/hooks/useDeleteBucket';


import useGetParameterList from '../../../../hooks/services/useGetParameterList';

import { tableHeaderConstants } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();

  const [{ currentRole }] = useApp();
  const { setViewOnly } = useViewOnly();
  const isSuperAdminMaker = currentRole.includes(roles.MAKER);
  const isSuperAdminChecker = currentRole.includes(roles.CHECKER);
  const isRM = currentRole.includes(roles.RM);

  const canViewPipeline = useCheckAccess(accessid.PIPELINE_VIEW);
  const canDeletePipeline = useCheckAccess(accessid.PIPELINE_DELETE);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- PARAMETER ---
  // Get Pipeline division filter options
  const { data: divisionOptions } = useGetParameterList('division');

  // Get Pipeline division filter options
  const { data: statusOption } = useGetParameterList('status');

  // Get Pipeline search by options
  const { data: searchByOptions } = useGetParameterList('searchByPipeline', { label: 'value1', value: 'value2' });

  // Get Pipeline sort by options
  const { data: sortByOptions } = useGetParameterList('sortByPipeline', { label: 'value1', value: 'value2' });

  // --- END OF PARAMETER ---

  const defaultStatuses = (() => {
    if (isSuperAdminChecker) return ['WAITING_APPROVAL_KADIV', 'WAITING_APPROVAL_CHECKER'];
    return [];
  })();

  const filteredStatuses = (() => {
    const statuses = filter?.filter?.status ?? defaultStatuses;
    if (isSuperAdminMaker) {
      if (Array.isArray(statuses) && statuses.length > 0) {
        return statuses.filter((status) => status !== 'WAITING_APPROVAL_CHECKER');
      }
      return Object.values(PIPELINE_STATUS).filter((status) => status !== 'WAITING_APPROVAL_CHECKER');
    }
    return statuses;
  })();
  // Get pipeline list
  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...(filter?.filter ?? {}),
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      status: filteredStatuses,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? {},
  }, {
    staleTime: ONE_MINUTE,
  });

  // Record activity when pipeline list data is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline list',
      });
    }
  }, [data, page, pageSize, recordActivity]);

  // Delete
  const { mutate: deletePipeline, isPending: isDeleteLoading } = useDeleteBucket({
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          queryClient.invalidateQueries({ queryKey: ['pipelines']});
        },
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const shouldRenderForm = (status) => {
    if (status === PIPELINE_STATUS.APPROVED_PIPELINE) {
      return false;
    }

    if (currentRole.includes(roles.RM)) {
      return status === PIPELINE_STATUS.PIPELINE_CREATION
        || status === PIPELINE_STATUS.RETURN_TO_STAFF;
    }

    if (currentRole.includes(roles.TL)) {
      return status === PIPELINE_STATUS.WAITING_APPROVAL_TL;
    }

    return false;
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderConstants,
    {
      key: 'action',
      label: 'Action',
      options: isRM || isSuperAdminMaker ? [
        ...(canViewPipeline ? [{
          iconName: 'detail', onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'view pipeline detail from list',
            });

            router.push(
              replacePath(
                pipeline.DETAIL_PAGE,
                {
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
        ...(canDeletePipeline ? [{
          iconName: 'delete',
          isDisabled: (data) => isDeleteLoading || data.status === 'APPROVED_PIPELINE' || data.status === 'WAITING_APPROVAL_TL' || data.status === 'PROCESS_TO_NEXT_STAGES' ||
           data.status === 'CANCELED' || data.status === 'REJECTED' || data.status === 'RETURN_TO_STAFF' || data.status === 'WAITING_APPROVAL_CHECKER' || data.status === 'RETURN_TO_MAKER',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                recordActivity({
                  activity: ActivityType.DELETE,
                  bucketProcessId: data.bucketProcessId || '',
                  changeAfter: JSON.stringify({ status: 'deleted' }),
                  changeBefore: JSON.stringify({
                    bucketProcessId: data.bucketProcessId,
                    debtorName: data.debtorName,
                    status: data.status,
                  }),
                  menuCode: 'pipeline',
                  module: TypeModule.PIPELINE,
                  process: TypeProcess.PIPELINE,
                  remarks: 'delete pipeline from list',
                });
                deletePipeline({ id: data.bucketProcessId });
              },
              submitText: 'Ya',
              type: 'warning',
            });
          },
        }] : []),
      ] : [
        ...(canViewPipeline ? [{
          iconName: 'detail',
          onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'view pipeline detail from list',
            });

            setViewOnly(!shouldRenderForm(data?.status));

            router.push(
              replacePath(
                pipeline.DETAIL_PAGE,
                {
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
      ],
      sx: {
        minWidth: '9vw',
      },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOption,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
