import { useEffect, useState } from 'react';

import { roles } from '@/configs/constants';
import { MAINTENANCE_STATUS } from '@/configs/constants/maintenance';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';


import useGetApplicationList from '../../hooks/useGetApplicationList';

import { HEADER_TABLE } from './ApprovalModal.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalModal = (modalId: string) => {
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const { setDebtorId, setProcessId, debtorId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const [contentList, setContentList] = useState([]);
  const [filter, setFilter] = useState<SearchValue>();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });

  // Get MT Customer status filter options
  const { data: maintennceCustomerStatusOptions } = useGetParameterList('maintenanceCustomerStatus');

  // Get MT Customer search by options
  const { data: searchByOptions } = useGetParameterList('searchByMaintenanceCustomerApprovalList');

  // Get MT Customer sort by options
  const { data: sortByOptions } = useGetParameterList('sortByMaintenanceCustomerApprovalList');


  const gamList = filterByGamOptions?.map((item) => ({
    label: `${item?.division ? item?.division : ''} - ${item?.label}`,
    value: item?.value,
  }));


  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Last Modified Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: maintennceCustomerStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  useEffect(() => {
    if (data && !isLoading) {
      setContentList(data?.contents?.map((val) => ({ ...val, cif: val?.cif || '-', gamName: val?.gamName || '-' })));
      setNoPage(data?.page?.noPage);
      setItemPerPage(data?.page?.itemPerPage);
    }
  }, [data, isLoading]);

  const shouldRenderForm = (status: string) => {

    if (status === MAINTENANCE_STATUS.APPROVED_MAINTENANCE_DEBTOR) {
      return false;
    }

    if (currentRole.includes(roles.RM)) {
      return status === MAINTENANCE_STATUS.MAINTENANCE_DEBTOR_CREATION;
    }

    if (currentRole.includes(roles.TL)) {
      return status === MAINTENANCE_STATUS.WAITING_APPROVAL_TL_MAINTENANCE_DEBTOR;
    }

    return false;
  };

  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          hidden: (data) => data.statusLabel === 'Completed',
          iconName: 'detail',
          onClick: (data) => {
            router.push(replacePath(
              maintenanceDebtor.GENERAL_CUSTOMER_INFORMATION,
              {
                module: 'maintenance',
                processId: data.bucketProcessId,
              },
            ));
            closeNiceModal(modalId).then(() => {
              setViewOnly(shouldRenderForm(data?.status));
              setDebtorId(data.debtorId);
              setProcessId(data.bucketProcessId);
            });
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    contentList,
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useApprovalModal;
