'use client';
import React, { useEffect, useState } from 'react';

import {
  DRAFT,
  RETURN_TO_REQUESTOR,
  RETURN_TO_REQUESTOR_MAKER,
  roles,
  WAITING_APPROVAL_CHECKER,
  WAITING_APPROVAL_CHECKER_CANCELED,
  WAITING_APPROVAL_CHECKER_END_ASSIGNMENT,
  WAITING_APPROVAL_RECEIVE_KADIV,
  WAITING_APPROVAL_RECEIVE_KADIV_CANCELED,
  WAITING_APPROVAL_RECEIVE_KADIV_END_ASSIGNMENT,
  WAITING_APPROVAL_RECEIVE_KADIV_MAKER,
  WAITING_APPROVAL_RECEIVE_KADIV_MAKER_CANCELED,
  WAITING_APPROVAL_RECEIVE_KADIV_MAKER_END,
  WAITING_APPROVAL_TL,
  WAITING_APPROVAL_TL_CANCELED,
  WAITING_APPROVAL_TL_END_ASSIGNMENT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { GENERAL_SKU } from '@/configs/constants/sku';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetUsername from '@/hooks/services/report/useGetUsername';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import TextStyle from '@/components/shared/TextStyle';

import useGetBucketList from '../hooks/useGetBucketList';

import { TABLE_HEADER_APPROVAL } from './ApprovalList.constants';

import type { ApprovalItem } from './ApprovalList.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useApprovalList = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const usernameSearchValue = '';
  const [appState] = useApp();

  const getDefaultStatusByRole = (rolesArray: string[] | undefined): string[] => {
    if (!rolesArray) return [DRAFT, RETURN_TO_REQUESTOR];

    if (rolesArray.includes(roles.TL)) {
      return [DRAFT,
        RETURN_TO_REQUESTOR,
        WAITING_APPROVAL_TL,
        WAITING_APPROVAL_TL_CANCELED,
        WAITING_APPROVAL_TL_END_ASSIGNMENT,
        WAITING_APPROVAL_CHECKER,
        WAITING_APPROVAL_CHECKER_CANCELED,
        WAITING_APPROVAL_CHECKER_END_ASSIGNMENT,
      ];
    } else if (rolesArray.includes(roles.KADIV)) {
      return [DRAFT,
        RETURN_TO_REQUESTOR,
        WAITING_APPROVAL_RECEIVE_KADIV,
        WAITING_APPROVAL_RECEIVE_KADIV_CANCELED,
        WAITING_APPROVAL_RECEIVE_KADIV_END_ASSIGNMENT];
    } else if (rolesArray.includes('MAKER')) {
      return [DRAFT,
        RETURN_TO_REQUESTOR,
        //kadiv
        WAITING_APPROVAL_RECEIVE_KADIV,
        WAITING_APPROVAL_RECEIVE_KADIV_CANCELED,
        WAITING_APPROVAL_RECEIVE_KADIV_END_ASSIGNMENT,
        //tl
        WAITING_APPROVAL_TL,
        WAITING_APPROVAL_TL_CANCELED,
        WAITING_APPROVAL_TL_END_ASSIGNMENT,
        'RETURN_TO_REQUESTOR_MAKER',
      ];
    } else if (rolesArray.includes('CHECKER')) {
      return [
        'WAITING_APPROVAL_CHECKER',
        'WAITING_APPROVAL_CHECKER_CANCELED',
        'WAITING_APPROVAL_CHECKER_END_ASSIGNMENT',
        'WAITING_APPROVAL_RECEIVE_KADIV_MAKER',
        'WAITING_APPROVAL_RECEIVE_KADIV_MAKER_CANCELED',
        'WAITING_APPROVAL_RECEIVE_KADIV_MAKER_END'
      ];
    } else {
      return [DRAFT, RETURN_TO_REQUESTOR];
    }
  };

  // --- PARAMETER ---
  const { data: originRoleOptions } = useGetParameterList('roleFilterReassignmentSku', { label: 'value1', value: 'value2' });
  const { data: originDivisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: destinationRoleOptions } = useGetParameterList('roleFilterReassignmentSku', { label: 'value1', value: 'value2' });
  const { data: destinationDivisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: statusOptions } = useGetParameterList('filterStatusSkuList');
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

  useEffect(() => {
    if (!filter?.filter?.status) {
      const defaultStatus = getDefaultStatusByRole(appState?.currentRole);
      const defaultFilter = {
        filter: {
          module: TypeModule.REASSIGNMENT_SKU,
          process: TypeProcess.REASSIGNMENT_SKU,
          status: defaultStatus,
        },
        searchDetail: filter?.searchDetail || { key: '', value: '' },
        sortList: filter?.sortList || undefined,
      };

      setFilter(defaultFilter);
    }
  }, [appState?.currentRole, filter, setFilter]);

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
      key: 'status',
      label: 'Status',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
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

  const getApiFilter = () => {
    if (filter?.filter) {
      return {
        ...filter.filter,
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
      };
    }
    const defaultStatus = getDefaultStatusByRole(appState?.currentRole);
    return {
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
      status: defaultStatus,
    };
  };


  const { data: approvalData, isLoading, isFetching } = useGetBucketList({
    filter: getApiFilter(),
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
        remarks: 'view SKU reassignment approval list',
      });
    }
  }, [isLoading, isFetching, recordActivity]);


  const approvalList = approvalData?.contents?.map((content: any, index: number) => {

    let duration = '-';

    if (content?.isPermanent === true) {
      duration = 'Permanent';
    } else if (content?.isPermanent === false && content?.startDate && content?.endDate) {
      const startDate = new Date(content.startDate);
      const endDate = new Date(content.endDate);

      duration = `${toDateString(startDate)} - ${toDateString(endDate)}`;
    }

    return {
      approvedBy: content?.tlApprovedBy || content?.kadivApprovedBy || null,
      approvedDate: content?.tlApprovedate || content?.kadivApprovedate || null,
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
      requestBy: content?.staffName || '-',
      requestDate: content?.createdAt || '-',
      requestId: content?.bucketProcessId || '-',
      status: content?.statusLabel || '-',
      statusActive: content?.statusActiveLabel || '-',
      statusLabel: content?.statusLabel || '-',
      userId: content?.userId || '-',
    };
  });

  const approvalPage = approvalData?.page;

  const handleViewDetail = (data: ApprovalItem) => {
    router.push(replacePath(
      RE_ASSIGNMENT_SKU.REQUEST_PAGE,
      {
        mode: GENERAL_SKU.DETAIL,
        processId: data?.id,
      },
    ));
    closeNiceModal(MODAL.APPROVAL_LIST_SKU);
  };

  const tableHeaderApproval: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    ...TABLE_HEADER_APPROVAL,
    {
      key: 'requestDate',
      label: 'Requested Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.requestDate && row.requestDate !== 'null'
            ? formatDate(row.requestDate, 'DD MMM YYYY, HH:mm:ss')
            : '-'
          }
        </TextStyle>
      ),
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'reason',
      label: 'Reason',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'duration',
      label: 'Durasi',
      sx: {
        minWidth: '20vw',
      },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: {
        minWidth: '9vw',
      },
      type: 'status',
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
    approvalList,
    approvalPage,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    itemPerPage,
    page,
    setFilter,
    setItemPerPage,
    setPage,
    tableHeaderApproval,
  };
};
