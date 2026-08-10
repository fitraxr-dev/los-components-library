import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetInquiryLimitList from '../../hooks/useGetInquiryLimitList';
import { modal } from '../../SyariahFacility.constants';

import { tableHeaderList } from './ModalInquiryLimitList.constants';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useModalInquiryLimitList = ({ cif }: { cif: string }) => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-list-inquiry-limit', null);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');
  const { recordActivity } = useRecordLog();

  const { processId } = params;

  const theme = useTheme();

  const {
    data: inquiryLimitList,
    isLoading: isLoadingInquiryLimitList,
  } = useGetInquiryLimitList({
    filter: {
      cif: cif,
      nominalEnd: filter?.filter?.nominalEnd,
      nominalStart: filter?.filter?.nominalStart,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const inquiryLimitListContents = inquiryLimitList?.contents;
  const inquiryLimitListPage = inquiryLimitList?.page;

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            sessionStorage.setItem('inquiry-limit', JSON.stringify(data));
            closeNiceModal(modal.INQUIRY_LIMIT_LIST);
            closeNiceModal(modal.INQUIRY);
            router.push(replacePath(maintenanceDebtor.INQUIRY_LIMIT, {
              id: cif,
              module: isMaster ? 'master' : 'maintenance',
              processId,
            }));
          },
        },
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

  const searchByList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: [
        {
          label: 'ID Limit',
          value: 'idLimitAnak',
        },
        {
          label: 'ID Limit Induk',
          value: 'idLimitInduk',
        },
        {
          label: 'Nominal Fasilitas Limit',
          value: 'nominalFasilitas',
        },
        {
          label: 'Akad',
          value: 'akad',
        },
        {
          label: 'Revolving',
          value: 'revolving',
        },
        {
          label: 'ID LD',
          value: 'idld',
        },
      ],
      type: 'sort',
    },
    {
      endKey: 'nominalEnd',
      key: 'nominal',
      label: 'Nominal',
      startKey: 'nominalStart',
      type: 'textPeriod',
    },
  ];

  const filterList = [
    {
      label: 'Id Limit',
      value: 'idLimitAnak',
    },
    {
      label: 'Id Limit Induk',
      value: 'idLimitInduk',
    },
    {
      label: 'Akad',
      value: 'akad',
    },
    {
      label: 'ID LD',
      value: 'idld',
    }
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view list inquiry limit',
    });
  }, []);

  return {
    filter,
    filterList,
    inquiryLimitListContents,
    inquiryLimitListPage,
    isLoadingInquiryLimitList,
    itemPerPage,
    noPage,
    processId,
    router,
    searchByList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
  };
};
export default useModalInquiryLimitList;
