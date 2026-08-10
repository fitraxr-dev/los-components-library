'use client';
import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { DEPI_DIVISION, roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, annualReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/bucket/useGetBucketList';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { mockSearchBy, modalAnnualReview, TABLE_HEADER, TABLE_HEADER_DEPI } from './List.constants';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const renderMenuAccess = (accessRoot) => {
  switch (accessRoot) {
    case 'assignment':
      return 'ANNUAL_REVIEW_ASSIGNMENT';
    case 'verification':
      return 'ANNUAL_REVIEW_VERIFICATION';
    case 'monitoring':
      return 'ANNUAL_REVIEW_MONITORING';
    case 'analyst':
      return 'ANNUAL_REVIEW_ANALYST';
    case 'request':
      return 'ANNUAL_REVIEW_REQUEST';
    default:
      return '';
  }
};

export const useList = () => {
  const [state, dispatch] = useApp();
  const router = useCustomRouter();
  const pathname = usePathname();
  const params = useParams();
  const { isDepiDivision } = useAnnualReviewContext();
  const { recordActivity } = useRecordLog();
  const { currentUserDivision, isRM, isTL, isAnalyst, typeProcess } = useAnnualReviewContext();
  const [selected, setSelected] = useState([]);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [{ currentRole }] = useApp();
  const accessRoot = renderMenuAccess(params.pageModule);
  const canShowButtonAddNew = useCheckAccess(accessid[accessRoot + '_CREATE']);
  const canShowDetail = useCheckAccess(accessid[accessRoot + '_VIEW']);

  const isChecker = currentRole?.includes(roles.CHECKER);
  const isMaker = currentRole?.includes(roles.MAKER);
  const showAssignTo: boolean = useMemo(() => selected.length > 0, [selected]);
  const isMonitoring = useMemo(() => pathname.includes('monitoring'), [pathname]);

  const isRequestPage = useMemo(() => {
    return pathname.includes('/request') ||
      (!pathname.includes('/assignment') &&
        !pathname.includes('/verification') &&
        !pathname.includes('/monitoring') &&
        !pathname.includes('/analyst'));
  }, [pathname]);

  const showAddNewButton = useMemo(() => {
    if (isChecker) return false;
    return pathname.includes('verification');
  }, [isChecker, pathname]);

  const title: string = useMemo(() => {
    if (pathname.includes('assignment')) {
      return 'Assignment Annual Review Re Rating List';
    } else if (pathname.includes('verification')) {
      return 'Verification Annual Review Re Rating List';
    } else if (pathname.includes('monitoring')) {
      return 'Monitoring Annual Review Re Rating List';
    } else if (pathname.includes('analyst')) {
      return 'Analyst Annual Review List';
    } else {
      return 'Request Annual Review List';
    }
  }, [pathname]);

  // --- PARAMETER ---
  // Get MIP status filter options
  const { data: mipStatusOptions } = useGetParameterList('filterStatusAnnualReview');
  const divisionOptions = useGetParameterList('division');

  // Get MIP search by options
  const { data: searchByOptions } = useGetParameterList('searchByAnnualReview', {
    label: 'value1',
    value: 'value2',
  });

  // Get MIP sort by options
  const { data: sortByOptions } = useGetParameterList('sortByAnnualReview', {
    label: 'value1',
    value: 'value2',
  });

  // Get mip list
  const { data: bucketListData, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: !pathname.includes('assignment'),
  });

  const { data: assignmentData, isFetching: isAssignmentLoading } = useGetBucketListAssignment({
    filter: {
      ...filter?.filter,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: pathname.includes('assignment'),
  });

  const data = pathname.includes('assignment') ? assignmentData : bucketListData;

  const listContents = data?.contents?.map((item) => ({
    ...item,
    additionalData: item.additionalData,
    aging: item.aging ?? '-',
    bucketProcessId: item.bucketProcessId || '-',
    cif: item.cif ?? '-',
    customerName: item.debtorName || '-',
    division: item.division || '-',
    institutionType: item.institutionTypeLabel || '-',
    totalProposal: item.totalProposal || '-',
  }));

  const listPage = data?.page?.totalPage ?? 1;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleSelected = (data) => {
    if (selected.some((item) => item.bucketProcessId === data.bucketProcessId)) {
      setSelected(selected.filter((item) => item.bucketProcessId !== data.bucketProcessId));
    } else {
      setSelected([...selected, {
        ...data,
        bucketProcessId: data.bucketProcessId,
        debtorName: data.debtorName,
        division: data.division,
        divisionId: data.divisionId,
        id: data.bucketProcessId,
        pic: (data.pic || []).map((item: any) => ({
          ...item,
          reAssignTo: {
            directorate: null,
            division: null,
            endDate: null,
            id: null,
            isPermanent: false,
            jobPosition: null,
            name: null,
            picId: null,
            startDate: null,
          },
          taskId: data.bucketProcessId,
        })),
        staffDivisionLabel: data.staffDivisionLabel,
        staffName: data.staffName,
      }]);
    }
  };

  const handleOpenAssignModal = () => {
    NiceModal.show(MODAL.ASSIGN_TO, {
      divisionId: currentUserDivision,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
      selectedTask: selected,
      setSelectedTask: setSelected,
    });
  };

  const handleOpenReassignModal = () => {
    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId: currentUserDivision,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
      selectedTask: selected,
      setSelectedTask: setSelected,
    });
  };

  const handleOpenAddNewModal = () => {
    NiceModal.show(modalAnnualReview.ADD_NEW, { typeProcess });
  };

  const tableHeader: TableHeader[] = [
    ...((isChecker && isMonitoring) ? [] : [{
      ...((pathname.includes('assignment') || pathname.includes('monitoring')) && {
        isDisabled: () => false,
        isSelected: (data) =>
          selected.some((item) => item.bucketProcessId === data?.bucketProcessId),
        key: 'checkbox',
        label: '',
        onSelectChange: (data) => handleSelected(data),
        sx: { width: '4%' },
        type: 'checkbox' as const,
      }),
    }].filter(Boolean)),
    ...(
      pathname.includes('verification') || pathname.includes('assignment') || pathname.includes('monitoring')
        ? TABLE_HEADER_DEPI
        : TABLE_HEADER
    ),

    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canShowDetail ? [{
          iconName: 'detail', onClick: (data) => {

            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId,
              changeAfter: '',
              changeBefore: '',
              menuCode: 'annual-review',
              module: TypeModule.ANNUAL_REVIEW,
              process: typeProcess,
              remarks: `view detail ${TypeModule.ANNUAL_REVIEW}`,
            });

            dispatch({
              data: {
                ...state.pages,
                debtorId: data.debtorId,
                lastPath: pathname,
              },
              type: reducer.SET_PAGES,
            });
            router.push(
              replacePath(
                annualReview.CUSTOMER_INFORMATION_PAGE,
                {
                  pageModule: params.pageModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
      ],
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
      label: 'Created Date',
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
      options: divisionOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: mipStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    canShowButtonAddNew,
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenAddNewModal,
    handleOpenAssignModal,
    handleOpenReassignModal,
    isAnalyst,
    isDepiDivision,
    isLoading,
    isRM,
    listContents,
    listPage,
    page,
    setFilter,
    setPage,
    setPageSize,
    showAddNewButton,
    showAssignTo,
    tableHeader,
    title,
  };
};
