import { useState } from 'react';

import { usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetManagementList from '../../hooks/useGetManagementList';
import useGetShareholderList from '../../hooks/useGetShareholderList';

import { TABLE_MANAGEMENT, TABLE_SHAREHOLDER } from './ManajemenShareholder.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useManajemenShareholder = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();

  const [pageShareholder, setPageShareholder] = useState(1);
  const [pageSizeShareholder, setPageSizeShareholder] = useState(10);
  const [pageManagement, setPageManagement] = useState(1);
  const [pageSizeManagement, setPageSizeManagement] = useState(10);

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  });

  const debtorId = debtorInfoData?.debtorId;

  const { data: shareholderListData, isLoading: isLoadingShareholderList } = useGetShareholderList({
    filter: {
      debtorId: debtorId,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_CORE,
    },
    page: {
      itemPerPage: pageSizeShareholder,
      noPage: pageShareholder,
    },
  }, {
    enabled: !!debtorId,
  });

  const { data: managementListData, isLoading: isLoadingmanagementList } = useGetManagementList({
    filter: {
      debtorId: debtorId,
    },
    page: {
      itemPerPage: pageSizeManagement,
      noPage: pageManagement,
    },
  }, {
    enabled: !!debtorId,
  });

  const gotoShareholderDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/detail-shareholder/${id}`, { processId }));
  };

  const gotoManajemenDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/detail-management/${id}`, { processId }));
  };

  const tableShareholderHeader: TableHeader[] = [
    ...TABLE_SHAREHOLDER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            gotoShareholderDetailPage(data?.shareholderId);
          },
        },
      ],
      sx: { minWidth: '1vw' },
      type: 'action',
    }
  ];

  const tableManajemenHeader: TableHeader[] = [
    ...TABLE_MANAGEMENT,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            gotoManajemenDetailPage(data?.managementCode);
          },
        },
      ],
      sx: { minWidth: '1vw' },
      type: 'action',
    }
  ];

  return {
    isLoadingManagementList: isLoadingmanagementList,
    isLoadingShareholderList,
    managementListData,
    pageManagement,
    pageShareholder,
    pageSizeManagement,
    pageSizeShareholder,
    setPageManagement,
    setPageShareholder,
    setPageSizeManagement,
    setPageSizeShareholder,
    shareholderListData,
    tableManajemenHeader,
    tableShareholderHeader,
  };
};
export default useManajemenShareholder;
