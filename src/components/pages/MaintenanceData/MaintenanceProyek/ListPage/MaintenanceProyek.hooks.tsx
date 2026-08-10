'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { accessid, maintenanceProyek } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList'; // ini nanti di sesuaikan
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceProyekContext } from '@/components/layouts/MaintenanceProyekLayout/MaintenanceProyek.context';

import useGetMaintenanceProyekData from '../hooks/useGetMaintenanceProyekData';

import { tableHeaderList, modal } from './MaintenanceProyek.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMaintenanceProyek = () => {
  const { recordActivity } = useRecordLog();
  const router = useCustomRouter();
  const { isStaff, handleSetBreadcrumb } = useMaintenanceProyekContext();
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const canViewProyek = useCheckAccess(accessid.MAINTENANCE_PROYEK_VIEW);
  const canEditProyek = useCheckAccess(accessid.MAINTENANCE_PROYEK_UPDATE);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: rowData.isEdit ? '#FFF5E4' : 'inherit',
  });

  useEffect(() => {
    handleSetBreadcrumb([
    ]);

    // Hapus session storage key 'maintenance-proyek' dan 'step'
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenance-proyek');
      sessionStorage.removeItem('step');
    }
  }, []);

  const { data, isFetching: isLoading } = useGetMaintenanceProyekData({
    filter: {
      ...filter?.filter,
      city: filter?.filter?.city?.value,
      district: filter?.filter?.district?.value,
      province: filter?.filter?.province?.value,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  // Record activity for maintenance proyek data
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek list data',
      });
    }
  }, [data, page, pageSize, filter, recordActivity]);

  // --- PARAMETER ---

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchByProject2', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByOptions } = useGetParameterList('sortByProject2', { label: 'value1', value: 'value2' });

  // Currency List
  const { data: currencyOptions } = useGetParameterList('currency');

  // Currency List
  const { data: sectorOptions } = useGetParameterList('sector');

  const filterDropdownList = searchByOptions;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleApprovalStatusModal = () => {
    NiceModal.show(modal.APPROVAL_STATUS_MODAL);
  };

  const handleCreateNewProyekModal = () => {
    router.push(
      maintenanceProyek.CREATE_PAGE,
    );
  };

  const rmActionList = [
    ...(canViewProyek ? [{
      iconName: 'detail',
      onClick: (data) => {
        // Simpan bucketProcessId ke session storage sebelum pindah route
        if (typeof window !== 'undefined' && data.bucketProcessId) {
          sessionStorage.setItem('maintenance-proyek', data.bucketProcessId);
          sessionStorage.setItem('step', '0');
        }

        router.push(
          replacePath(
            maintenanceProyek.DETAIL_PAGE,
            {
              id: data.id,
            },
          ),
        );
      },
    }] : []),
    ...(canEditProyek ? [{
      iconName: 'edit',
      isHidden: (data) => data.isEdit === true,
      onClick: (data) => {
        // Simpan bucketProcessId dan step ke session storage sebelum pindah route
        if (typeof window !== 'undefined' && data.bucketProcessId) {
          sessionStorage.setItem('maintenance-proyek', data.bucketProcessId);
          sessionStorage.setItem('step', '0');
        }

        router.push(
          replacePath(
            maintenanceProyek.EDIT_PAGE,
            {
              id: data.id,
            }
          )
        );
      },
    }] : []),
  ];

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: rmActionList,
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'currencies',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'sectors',
      label: 'Sektor yang dibiayai',
      options: sectorOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'area', // tidak terpakai
      label: 'Area', // tidak terpakai
      type: 'area-proyek',
    },
  ];

  return {
    anomalyRowStyle,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalStatusModal,
    handleCreateNewProyekModal,
    isLoading,
    isStaff,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
