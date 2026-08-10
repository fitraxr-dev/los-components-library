import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import useDeleteParentLimitSyariah from '../../hooks/useDeleteParentLimitSyariah';
import useGetListParentLimitSyariah from '../../hooks/useGetListParentLimitSyariah';
import useProposedFacilityTab from '../ProposedFacilityTab/ProposedFacilityTab.hook';

import { tableHeaderList } from './TableLimitIndukSyariah.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useLimitIndukSyariah = () => {
  const [filter, setFilter] = useSessionStorage('filter-limit-induk-syariah', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const [{ stepper }] = useApp();
  const isViewOnly = !stepper.steps
    .flatMap((step) => [step, ...(step.childrenSteps ?? [])])
    .find((step) => step.urlPath === 'facility-syariah')?.enable;
  const canAddNew = useCheckAccess(accessid.MAINTENANCE_DEBTOR_CREATE);
  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const canDelete = useCheckAccess(accessid.MAINTENANCE_DEBTOR_DELETE);
  const isHidden: boolean = processId?.includes('DEBT');
  const { data: searchByOptions } = useGetParameterList('searchByFacilityUsulanList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByFacilityUsulanList', {
    label: 'value1',
    value: 'value2',
  });
  const { clearSessionStorage } = useProposedFacilityTab();
  const { recordActivity } = useRecordLog();

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      allowFutureDates: true,
      endKey: 'endAsOfDate',
      label: 'Tanggal Berlaku',
      startKey: 'startAsOfDate',
      type: 'period',
    },
  ];

  const { data, isLoading } = useGetListParentLimitSyariah({
    filter: {
      ...filter?.filter,
      ...(isHidden
        ? { debtorId: String(processId) }
        : { bucketProcessId: String(processId) }
      ),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const processList = data?.contents?.map((item, index) => ({
    ...item,
    activationDate: item.activationDate ? formatDate(new Date(item.activationDate), 'DD MMMM YYYY') : '-',
  }));

  const processPage = data?.page;

  const { mutate: deleteParentLimit, isPending: isDeleteLoading } = useDeleteParentLimitSyariah({
    onErrorr: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete limit induk syariah',
      });
      queryClient.invalidateQueries({ queryKey: ['parent-limit-syariah-list']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-syariah-list']});
    },
  });

  useEffect(() => {
    clearSessionStorage();
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'view limit induk syariah list page',
      });
    }
  }, [data, isLoading, processId, recordActivity]);

  const handleDeleteModal = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'open delete confirmation modal for limit induk syariah',
    });
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteParentLimit({ syariahLimitId: row?.syariahLimitId });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const handleDetail = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail limit induk syariah',
    });
    sessionStorage.setItem('currentIdLimitInduk', row?.facilityId);
    router.push(replacePath(`${pathname}/${row?.facilityId}/detail/limit-induk`, { processId }));
  };

  const handleEdit = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'navigate to edit limit induk syariah',
    });
    if (typeof window !== 'undefined' && row?.syariahLimitId) {
      sessionStorage.setItem('currentSyariahLimitId', row?.syariahLimitId);
    }
    sessionStorage.setItem('currentIdLimitInduk', row?.facilityId);
    router.push(replacePath(`${pathname}/${row?.facilityId}/edit/limit-induk`, { processId }));
  };

  const gotoAddPage = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'navigate to add limit induk syariah',
    });
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleDetail(row),

        },
        {
          iconName: 'edit',
          isDisabled: isViewOnly || !canEdit,
          isHidden: isHidden,
          onClick: (row) => handleEdit(row),
        },
        {
          iconName: 'delete',
          isDisabled: isViewOnly || !canDelete,
          isHidden: isHidden,
          onClick: (row) => handleDeleteModal(row),
        }
      ],
      sx: {
        minWidth: '10vw',
        textAlign: 'center',
      },
      type: 'action',
    }
  ];

  const anomalyRow = (val: any) => {
    if (val.hasDelta === true)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };


  return {
    anomalyRow,
    canAddNew,
    filter,
    filterContentList,
    filterDropdownList,
    gotoAddPage,
    isDeleteLoading,
    isHidden,
    isLoading,
    isViewOnly,
    page,
    pageSize,
    processList,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useLimitIndukSyariah;
