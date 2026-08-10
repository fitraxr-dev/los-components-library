import { useEffect, useState } from 'react';

import { maintenanceGroup } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import Button from '@/components/shared/Button';


import useGetSubmissionData from '../../hooks/useGetSubmissionList';
import { modal as MODAL } from '../../ListPage/MaintenanceGroup.constants';

import { TABLE_HEADER } from './ApprovalStatus.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { GenericBucketRequestDtoMaintenanceGroupFilterRequest } from '@/services/openapi/master-service';


const useApprovalStatusModal = () => {
  const modalId = MODAL.APPROVAL_STATUS_MODAL;
  const [contentList, setContentList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const router = useCustomRouter();

  const [filter, setFilter] = useState<SearchValue>({});

  const { recordActivity } = useRecordLog();

  // Dapatkan dropdown list untuk search & filter
  const { data: searchByOptions } = useGetParameterList('searchByDebtorGroup');
  const { data: sortByOptions } = useGetParameterList('sortByDebtorGroup');
  const { data: statusOptions } = useGetParameterList('maintenanceGroupStatus');
  const { data: industryOptions } = useGetParameterList('sector');

  // Sesuaikan search dengan respon API
  const mapSearchKey = (rawKey: string | undefined) => {
    if (!rawKey) return '';
    const k = rawKey.toLowerCase();
    if (k === 'group_name') return 'name';
    if (k === 'group_id') return 'groupCode';
    if (k === 'sector_industry') return 'sector';
    if (k === 'created_date') return 'createdDate';
    if (k === 'created_by') return 'createdBy';
    return rawKey;
  };

  // Sesuaikan filter dengan respon API
  const SORT_KEY_MAP: Record<string, string> = {
    created_by: 'createdBy',
    created_date: 'createdDate',
    group_name: 'name',
    id: 'groupCode',
    sector: 'sector',
    sector_industry: 'sector',
  };
  const mapSortKey = (rawKey?: string) => {
    if (!rawKey) return '';
    return SORT_KEY_MAP[rawKey.toLowerCase()] ?? rawKey;
  };

  const finalSortList = filter?.sortList
    ? {
      columnName: mapSortKey(filter.sortList.columnName),
      sortType: filter.sortList.sortType ?? 'ASC',
    }
    : { columnName: 'modifiedDate', sortType: 'DESC' };

  const uiFilter = filter?.filter ?? {};

  // ambil pilihan status
  const selectedStatuses = Array.isArray(uiFilter.status)
    ? uiFilter.status
    : Array.isArray(uiFilter.statuses)
      ? uiFilter.statuses
      : undefined;

  const filterRequest = {
    sectors: uiFilter.sector ?? uiFilter.sectors ?? [],
    statuses: selectedStatuses && selectedStatuses.length > 0 ? selectedStatuses : [],
  };

  const payload: GenericBucketRequestDtoMaintenanceGroupFilterRequest = {
    filter: filterRequest,
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: {
      key: mapSearchKey(filter?.searchDetail?.key),
      value: filter?.searchDetail?.value ?? '',
    },
    sortList: finalSortList,
  };

  const { data: submissionList, isFetching: isLoading } = useGetSubmissionData(payload);

  const mockDataTableModal = {
    contents: [
      {
        idGroup: 'Modal - 1',
        nameGroup: 'Akame Ga Kill',
        sektorIndustri: 'Industri Woww',
      },
      {
        idGroup: 'Modal - 2',
        nameGroup: 'Akatsukis Clan',
        sektorIndustri: 'Industri Perbankan',
      }
    ],
  };

  const submissionPage = submissionList?.page;

  useEffect(() => {
    setContentList(submissionList?.contents);
  }, [submissionList]);

  useEffect(() => {
    if (submissionList?.contents) {
      const statusBreakdown = submissionList.contents.reduce((acc, item) => {
        const status = item.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusSummary = Object.entries(statusBreakdown)
        .map(([status, count]) => `${status}: ${count}`)
        .join(', ');

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: 'view maintenance group approval status list data in modal',
      });

      setContentList(submissionList.contents);
    }
  }, [submissionList, recordActivity]);

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row?.status}
        </Button >
      ),
      sx: { minWidth: '75px', width: '75px' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            closeNiceModal(modalId);
            const isDraft = data?.status?.toUpperCase?.() === 'DRAFT';
            const isReturntoStaff = data?.status?.toUpperCase?.() === 'RETURN_TO_STAFF' ||
                                   data?.status?.toUpperCase?.() === 'RETURN TO STAFF' ||
                                   data?.status?.toUpperCase?.() === 'RETURN_TO_STAFF' ||
                                   data?.status?.includes?.('RETURN') && data?.status?.includes?.('STAFF');

            const targetPage = isDraft || isReturntoStaff ? maintenanceGroup.EDIT_PAGE : maintenanceGroup.DETAIL_PAGE;
            router.push(
              replacePath(targetPage, {
                groupId: data?.bucketProcessId,
              }) + '?from=approval-status'
            );
          },
        }
      ],
      sx: { minWidth: '50px', width: '50px' },
      type: 'action',
    }
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: industryOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
    },
  ];


  return {
    contentList,
    filter,
    filterContentList,
    filterDropdownList: searchByOptions || [],
    setFilter,
    setPage,
    setPageSize,
    submissionPage,
    tableHeader,
  };
};

export default useApprovalStatusModal;
