'use client';
import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { GENERAL_SKU } from '@/configs/constants/sku';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetUsername from '@/hooks/services/report/useGetUsername';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import TextStyle from '@/components/shared/TextStyle';

import useGetBucketList from '../hooks/useGetBucketList';

import { TABLE_HEADER_MONITORING } from './Monitoring.constants';

import type { MonitoringItem } from './Monitoring.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMonitoring = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-reassigment-sku', null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const path = usePathname();
  const pathModule = getLastPath(path);
  const usernameSearchValue = '';
  // --- PARAMETER ---
  const { data: originRoleOptions } = useGetParameterList('roleFilterReassignmentSku', { label: 'value1', value: 'value2' });
  const { data: originDivisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: destinationRoleOptions } = useGetParameterList('roleFilterReassignmentSku', { label: 'value1', value: 'value2' });
  const { data: destinationDivisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: reasonOptions } = useGetParameterList('userReason');
  const { data: searchByOptions } = useGetParameterList('searchByReassigmentSkuList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByReassigmentSkuList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: modifiedOptions } = useGetUsername({
    value: usernameSearchValue,
  });

  const mappedModifiedOptions = modifiedOptions?.contents?.map((item: any) => ({
    label: item.userName,
    value: item.userId,
  })) || [];
  // --- END OF PARAMETER ---
  const canViewSku = useCheckAccess(accessid.REASSIGNMENT_SKU_VIEW);
  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode (Durasi)',
      startKey: 'startDate',
      type: 'period',
    },

    {
      key: 'originRole',
      label: 'Jabatan Asal',
      options: originRoleOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'originDivision',
      label: 'Divisi Asal',
      options: originDivisionOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'destinationRole',
      label: 'Jabatan Tujuan',
      options: destinationRoleOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'destinationDivision',
      label: 'Divisi Tujuan',
      options: destinationDivisionOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'reason',
      label: 'Reason',
      options: reasonOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'statusActive',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Non Active', value: 'Non Active' },
      ],
      type: 'status-toggle',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      options: mappedModifiedOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      endKey: 'endModifiedDate',
      label: 'Modified Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
  ];

  const { data: monitoringData, isLoading, isFetching } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: 'view SKU reassignment monitoring page',
      });
    }
  }, [isLoading, isFetching, recordActivity]);

  const monitoringList = monitoringData?.contents?.map((content: any, index: number) => {

    let duration = '-';

    if (content?.isPermanent === true) {
      duration = 'Permanent';
    } else if (content?.isPermanent === false && content?.startDate && content?.endDate) {
      const startDate = new Date(content.startDate);
      const endDate = new Date(content.endDate);

      duration = `${toDateString(startDate)} - ${toDateString(endDate)}`;
    }

    return {
      approvedBy: content?.kadivApprovedBy || content?.tlApprovedBy || null,
      approvedDate: content?.kadivApprovedate || content?.tlApprovedate || null,
      createdAt: content?.createdAt || '-',
      destinationDivision: content?.destinationDivisionName || '-',
      destinationName: content?.destinationName || '-',
      destinationRole: content?.destinationRoleName || '-',
      divisionId: content?.divisionId || '-',
      duration: duration,
      id: content?.bucketProcessId || null,
      modifiedBy: content?.modifiedBy || '-',
      modifiedDate: content?.modifiedAt || '-',
      no: (page - 1) * itemPerPage + index + 1,
      originDivision: content?.originDivisionName || '-',
      originName: content?.originName || '-',
      originRole: content?.originRoleName || '-',
      positionLabel: content?.staffRoleName || '-',
      processId: content?.bucketProcessId || '-',
      reason: content?.reason || '-',
      requestId: content?.bucketProcessId || '-',
      status: content?.status || '-',
      statusActive: content?.statusActiveLabel || '-',
      statusLabel: content?.statusLabel || '-',
      userId: content?.userId || '-',
    };
  });

  const monitoringPage = monitoringData?.page;

  const handleAddNew = () => {
    router.push(
      replacePath(RE_ASSIGNMENT_SKU.REQUEST_PAGE, {
        mode: GENERAL_SKU.CREATE,
        module: pathModule,
        processId: GENERAL_SKU.NEW,
      }),
    );
  };

  const handleShowApprovalList = () => {
    NiceModal.show(MODAL.APPROVAL_LIST_SKU, {
      module: pathModule,
    });
  };

  const handleViewDetail = (data: MonitoringItem) => {
    router.push(
      replacePath(RE_ASSIGNMENT_SKU.REQUEST_PAGE, {
        mode: GENERAL_SKU.DETAIL,
        processId: data?.id,
      }),
    );
  };

  const tableHeaderMonitoring: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    ...TABLE_HEADER_MONITORING,
    {
      key: 'statusActive',
      label: 'Status',
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'modifiedDate',
      label: 'Modified Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.modifiedDate && row.modifiedDate !== 'null'
            ? formatDate(row.modifiedDate, 'DD MMM YYYY, HH:mm:ss')
            : '-'
          }
        </TextStyle>
      ),
      sx: { minWidth: '12vw' },
    },
    {
      key: 'approvedBy',
      label: 'Approved By',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'approvedDate',
      label: 'Approved Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.approvedDate && row.approvedDate !== 'null'
            ? formatDate(row.approvedDate, 'DD MMM YYYY, HH:mm:ss')
            : '-'
          }
        </TextStyle>
      ),
      sx: { minWidth: '12vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewSku ? [{
          iconName: 'detail',
          onClick: handleViewDetail,
        }] : []),
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddNew,
    handleShowApprovalList,
    isLoading,
    itemPerPage,
    monitoringList,
    monitoringPage,
    page,
    setFilter,
    setItemPerPage,
    setPage,
    tableHeaderMonitoring,
  };
};
