import { useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { modal } from '../../SyariahFacility.constants';

import { tableHeaderList } from './InquiryAccountList.constants';
import { mockInquiryAccountList } from './mockData';

import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useInquiryAccountList = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-list-inquiry-limit', null);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');

  const { processId, id } = params;

  const theme = useTheme();

  const mockTableData = mockInquiryAccountList;

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: () => {
            router.push(replacePath(maintenanceDebtor.INQUIRY_ACCOUNT, {
              id,
              module: isMaster ? 'master' : 'maintenance',
              processId,
            }));
            closeNiceModal(modal.INQUIRY_ACCOUNT_LIST);
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
          label: 'Created Date',
          value: 'b.created_date',
        }
      ],
      type: 'sort',
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        {
          label: 'Perseorangan',
          value: 'PERSEORANGAN',
        },
        {
          label: 'Perseroan Terbatas',
          value: 'PERSEROAN_TERBATAS',
        },
      ],
      type: 'multiple-autocomplete',
    },
    {
      endKey: 'endDateId',
      key: 'tglIdDebitur',
      label: 'Tanggal ID Debitur',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDateId',
      type: 'period',
    },
    {
      endKey: 'endDateCif',
      key: 'cifDate',
      label: 'Tanggal CIF',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDateCif',
      type: 'period',
    },
  ];

  const filterList = [
    {
      label: 'Facility Id',
      value: 'm.facility_id',
    },
    {
      label: 'CIF',
      value: 'd.cif',
    },
    {
      label: 'Nama Customer',
      value: 'd.customer_name',
    }
  ];

  return {
    filter,
    filterList,
    itemPerPage,
    mockTableData,
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
export default useInquiryAccountList;
