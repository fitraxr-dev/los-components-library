import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../ManagementShareholder/ManagementShareholder.constants';

import useGetPerikatanAkadList from './hooks/useGetPerikatanAkadList';
import { tableHeader } from './PerikatanPembiayaan.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const usePerikatanPembiayaan = () => {
  const router = useRouter();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const { processId } = useIdentity();
  const theme = useTheme();

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState('');
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer perikatan pembiayaan page',
    });
  }, []);

  const { handleSetBreadcrumb } = useMaintenanceDataContext();

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Perikatan Pembiayaan atau Akad', url: '' },
    ]);
  }, []);

  const searchByOptions = useGetParameterList('searchCustomerPK', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortCustomerPK', { label: 'value1', value: 'value2' });
  const { data: contractType } = useGetParameterList('pkType ', { label: 'value1', value: 'key' });

  const contentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'addendumType',
      label: 'Tipe Perjanjian (PK/Addendum)',
      options: contractType,
      type: 'multiple-autocomplete',
    },
    {
      allowFutureDates: true,
      endKey: 'endPKDate',
      label: 'Tanggal PK/Addendum',
      startKey: 'startPKDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endEffectiveDate',
      label: 'Tanggal efektif',
      startKey: 'startEffectiveDate',
      type: 'period',
    }
  ];

  const tableHeaderList: Array<TableHeader> = [
    ...tableHeader,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data) => {
          router.push(replacePath(maintenanceDebtor.DETAIL_PERIKATAN_PEMBIYAAN, {
            id: data.bucketProcessId,
            module: modul,
            processId: processId,
          }
          ));
        } },
      ],
      type: 'action',
    }
  ];

  const { data: perikatanAkadList, isLoading } = useGetPerikatanAkadList({
    filter: {
      ...payloadFilterList(processId, filter),
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  return {
    contentList,
    filter,
    isLoading,
    pageNo,
    pageSize,
    perikatanAkadList,
    searchByOptions,
    setFilter,
    setPageNo,
    setPageSize,
    tableHeaderList,
    theme,
  };
};

export default usePerikatanPembiayaan;
