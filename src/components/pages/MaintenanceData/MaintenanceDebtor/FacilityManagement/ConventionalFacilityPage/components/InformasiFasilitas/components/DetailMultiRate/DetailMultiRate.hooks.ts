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


import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useDeleteMultirate from '../../../../hooks/Multirate/useDeleteMultirate';
import useGetDetailMultiRateDetail from '../../../../hooks/Multirate/useGetMultirate';

import { modal, tableHeader } from './DetailMultiRate.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useDetailMultiRate = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const params = useSearchParams();
  const isEdit = params.get('isEdit');
  const orderType = params.get('orderType');
  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);


  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (rowData?.hasModified && !roleCanEdit) ? 'rgba(235, 87, 87, 0.2)' : 'inherit',
  });

  const [filter, setFilter] = useState<SearchValue>({});
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const { data: detailMultiRateInformation } = useGetDetailMultiRateDetail(
    {
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
    }
  );

  const totalPage = (detailMultiRateInformation as any)?.data?.page?.totalPage ?? 1;

  const toFixed6 = (value: number) => {
    if (value === null || value === undefined) {
      return Number(0).toFixed(6);
    }
    return Number(value).toFixed(6);
  };

  const tableData = (detailMultiRateInformation as any)?.data?.contents?.map((item: any) => ({
    ...item,
    baseRate: toFixed6(item?.baseRate),
    margin: toFixed6(item?.margin),
    modifiedDate: formatDateTime(item.modifiedDate),
    totalEffectiveRate: toFixed6(item.totalEffectiveRate),
  }));

  const { data: sortByOptions } = useGetParameterList('sortKonvenMulti', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchKonvenMulti', { label: 'value1', value: 'value2' });

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

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab detail multi rate',
    });
  }, []);

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
                deleteDetailMultiRate({
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
    }];

  const { mutate: deleteDetailMultiRate } = useDeleteMultirate({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'delete failed maintenance customer conventional detail multi rate page',
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
        remarks: 'delete success maintenance customer conventional detail multi rate page',
      });
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

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
