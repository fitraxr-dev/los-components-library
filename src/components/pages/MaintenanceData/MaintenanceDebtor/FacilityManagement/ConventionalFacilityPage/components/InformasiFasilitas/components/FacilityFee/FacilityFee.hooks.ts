import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';


import useDeleteFacilityFee from '../../../../hooks/FacilityFee/useDeleteFacilityFee';
import useGetFacilityFeeDetail from '../../../../hooks/FacilityFee/useGetFacilityFee';

import { modal, tableHeader } from './FacilityFee.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useFacilityFee = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const params = useSearchParams();
  const isEdit = params.get('isEdit');
  const orderType = params.get('orderType');
  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;
  const { id } = useParams();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { recordActivity } = useRecordLog();
  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (rowData?.hasModified && !roleCanEdit) ? 'rgba(235, 87, 87, 0.2)' : 'inherit',
  });

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab facility fee',
    });
  }, []);

  const [filter, setFilter] = useState<SearchValue>({});
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const { data: facilityFeeInformation } = useGetFacilityFeeDetail({
    filter: {
      ...payloadFilterList(processId as string, filter),
      facilityId: id as string,
      orderType: orderType ?? null,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { data: sortByOptions } = useGetParameterList('sortKonvenFee', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchKonvenFee', { label: 'value1', value: 'value2' });


  const tableHeaderList: TableHeader[] = [
    ...tableHeader,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isDisabled: isViewOnly,
          onClick: (row) => {
            NiceModal.show(modal.MODAL_ADD, {
              data: row,
            });
          },
        },
        {
          iconName: 'delete',
          isDisabled: isViewOnly,
          onClick: (row) => {
            showNiceModalV2({
              onSubmit: () => {
                deleteFacilityFee({
                  bucketProcessId: processId as string,
                  facilityId: id as string,
                  id: row.id,
                });
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin menghapus data?',
              type: 'warning',
            });
          },
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  const { mutate: deleteFacilityFee } = useDeleteFacilityFee({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete failed maintenance customer conventional facility fee page',
      });
      showNiceModalV2({
        title: error?.message,
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete success maintenance customer conventional facility fee page',
      });
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const filterDropdownList = searchByOptions ?? [];
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Last Modified',
      startKey: 'startDate',
      type: 'period',
    }
  ];

  const totalPage = (facilityFeeInformation as any)?.data?.page?.totalPage ?? 1;

  const tableData = (facilityFeeInformation as any)?.data?.contents?.map((item: any) => ({
    ...item,
    modifiedDate: formatDateTime(item.modifiedDate),
  }));

  return {
    anomalyRowStyle,
    filter,
    filterContentList,
    filterDropdownList,
    isViewOnly,
    itemPerPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeaderList,
    theme,
    totalPage,
  };
};

export default useFacilityFee;
