'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DTI_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketMaintenanceCustomer from '@/hooks/services/maintenance-customer/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useStandaloneBucket from '@/hooks/services/useStandaloneBucket';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { TABLE_HEADER, modal } from './List.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { setDebtorId, setProcessId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { divisionCode } = useDivision();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [{ currentRole }] = useApp();
  const isTL = currentRole.includes('TL');
  const isKadiv = currentRole.includes('KADIV');
  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer list data',
    });
  }, []);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: ((rowData?.activeBucketDebtor !== null && rowData?.activeBucketDebtor !== '') && !rowData?.canCreateBucket) ? '#FFF5E4' : 'inherit',
  });

  useEffect(() => {
    handleSetBreadcrumb([
    ]);
  }, []);

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
    DTI_DIVISION];

  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);

  // --- PARAMETER ---
  // Get MT Customer search by options
  const { data: searchByOptions } = useGetParameterList('searchByMaintenanceCustomerList');

  // Get MT Customer sort by options
  const { data: sortByOptions } = useGetParameterList('sortByMaintenanceCustomerList');

  // Get Institution type options
  const { data: institutionTypeList } = useGetParameterList('institutionType');
  // --- END OF PARAMETER ---

  // Get mip list
  const { data, isFetching: isLoading } = useGetBucketMaintenanceCustomer({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = data?.contents.map((val) => {
    return {
      activeBucketDebtor: val?.activeBucketDebtor || null,
      canCreateBucket: val?.canCreateBucket || false,
      cif: val?.cif || '-',
      cifDate: val?.cifDate || '-',
      debtorId: val?.debtorId,
      debtorIdDate: val?.createdDate || '-',
      debtorName: val?.debtorName,
      institutionType: val?.institutionType || '-',
      institutionTypeLabel: val?.institutionTypeLabel || '-',
      isEditable: val?.isEditable || false,
    };
  });

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setDebtorId(null);
    setProcessId(null);
  }, []);

  const { mutate: saveDebtorDetail } = useStandaloneBucket({
    onError() {
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess(data) {
      router.push(
        replacePath(
          maintenanceDebtor.GENERAL_CUSTOMER_INFORMATION,
          {
            module: 'maintenance',
            processId: data.content.bucketProcessId,
          }));
      recordActivity({
        activity: ActivityType.CREATE,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'successfully save maintenance customer',
      });
    },
  });

  const handleApprovalModal = () => {
    NiceModal.show(modal.APPROVAL_MODAL);
  };

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            router.push(
              setPreviewPage(
                replacePath(
                  maintenanceDebtor.GENERAL_CUSTOMER_INFORMATION,
                  {
                    module: 'master',
                    processId: data.debtorId,
                  },
                ),
              )
            );
          },
        },
        {
          iconName: 'edit',
          isHidden: (data) => ((data?.activeBucketDebtor !== null && data?.activeBucketDebtor !== '') && !data?.canCreateBucket) || !canEdit,
          onClick: (data) => {
            NiceModal.show(MODAL.GLOBAL.CONFIRM, {
              agreeText: 'Confirm',
              cancelText: 'Cancel',
              onSubmit: () => {
                saveDebtorDetail({
                  debtorId: data.debtorId,
                  module: TypeModule.MAINTENANCE_DATA,
                  process: TypeProcess.MAINTENANCE_CUSTOMER,
                });
              },
              title: 'Apakah Anda yakin ingin mengubah data customer?',
            });
          },
        },
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
      key: 'institutionType',
      label: 'Institution Type',
      options: institutionTypeList,
      type: 'multiple-autocomplete',
    },
    {
      endKey: 'endDate',
      label: 'Tanggal ID Customer',
      startKey: 'startDate',
      type: 'period',
    },
    {
      endKey: 'endCifDate',
      label: 'Tanggal CIF',
      startKey: 'startCifDate',
      type: 'period',
    },
  ];

  return {
    anomalyRowStyle,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalModal,
    isBusinessDivision,
    isLoading,
    page,
    pageSize,
    pathname,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
  };
};
