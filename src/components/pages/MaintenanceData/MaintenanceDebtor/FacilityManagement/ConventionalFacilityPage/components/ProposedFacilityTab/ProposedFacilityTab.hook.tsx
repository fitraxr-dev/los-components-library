import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetKonvenExistingList from '../../hooks/useGetKonvenExistingList';

import { tableHeaderList } from './ProposedFacilityTab.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProposedFacilityTab = () => {
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const { recordActivity } = useRecordLog();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useState<SearchValue>();

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [{ stepper }] = useApp();
  const isEdit = stepper.steps.find((step) => step.urlPath === 'facility-management')
    ?.childrenSteps.find((step) => step.urlPath === 'facility-conventional')?.enable;

  const theme = useTheme();
  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (rowData?.hasModified && !roleCanEdit) ? 'rgba(235, 87, 87, 0.2)' : (rowData?.isOnprogressOtherModule) ? 'rgba(255, 255, 0, 0.2)' : 'inherit',
  });

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view fasilitas conventional proposed facility',
    });
  }, []);

  const { data: konvenList } = useGetKonvenExistingList({
    filter: {
      ...payloadFilterList(processId, filter),
      orderType: 'proposal',
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { data: sortByOptions } = useGetParameterList('sortCustomerFacilityKonven', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchCustomerFacilityKonven', { label: 'value1', value: 'value2' });

  const gotoDetailPage = (id: string, isEdit: boolean = false) => {
    const url = replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_INFORMATION_FACILITY_PAGE, {
      debtorId: processId, id, module: modul,
    });
    const finalUrl = isEdit ? `${url}?isEdit=true&orderType=proposal` : `${url}?orderType=proposal`;
    router.push(finalUrl);
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'facilityStatus',
      label: 'Status Fasilitas',
      sx: {
        minWidth: '10vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {
            gotoDetailPage(row.facilityId);
          },
        },
        {
          iconName: 'edit',
          isDisabled: (row) => !row?.editable,
          isHidden: !roleCanEdit || processId?.includes('DEBT') || !isEdit,
          onClick: (row) => {
            gotoDetailPage(row.facilityId, true);
          },
        }
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

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
      key: 'searchBy',
      label: 'Data As of',
      startKey: 'startDate',
      type: 'period',
    }
  ];

  return {
    anomalyRowStyle,
    filter,
    filterContentList,
    filterDropdownList,
    itemPerPage,
    konvenList,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useProposedFacilityTab;
