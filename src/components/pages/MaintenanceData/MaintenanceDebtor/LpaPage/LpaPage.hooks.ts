import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../ManagementShareholder/ManagementShareholder.constants';

import useGetLpa from './hooks/useGetLpa';
import { TableHeaderList } from './LpaPage.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useLpaPage = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isDebtor = processId?.includes('DEBT');
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer lpa page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'LPA', url: '' },
    ]);
  }, []);

  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) });

  const { data: lpaData } = useGetLpa({
    filter: payloadFilterList(processId, filter),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });


  const { data: searchByOptions } = useGetParameterList('searchCustomerLPA', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortCustomerLPA', { label: 'value1', value: 'value2' });

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDateAssessment',
      key: 'assessmentDate',
      label: 'Tanggal Penilaian',
      startKey: 'startDateAssessment',
      type: 'period',
    },
    {
      endKey: 'endDateReport',
      key: 'reportDate',
      label: 'Tanggal Laporan',
      startKey: 'startDateReport',
      type: 'period',
    }
  ];

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data) => {
          router.push(replacePath(`${pathname}/${data.id}`, { bucketProcessId: data.bucketProcessIdLPA, id: data.id }));
        } },
      ],
      type: 'action',
    }
  ];

  return {
    debtorData,
    filter,
    filterContentList,
    filterDropdownList,
    isDebtor,
    lpaData,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeaderList,
    theme,
  };
};

export default useLpaPage;
