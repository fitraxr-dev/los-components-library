import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess, TypeModule } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSyncArium from '@/hooks/services/useSyncArium';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useTableDebtorInformationLocal from '../../../SyariahFacilityPage/components/TableDebtorInformationLocal/TableDebtorInformationLocal.hook';
import useGetKonvenExistingList from '../../hooks/useGetKonvenExistingList';

import { tableHeaderList } from './ExistingFacilityTab.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useExistingFacilityTab = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const router = useCustomRouter();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const { processId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>();
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [{ stepper }] = useApp();
  const isEdit = stepper.steps.find((step) => step.urlPath === 'facility-management')?.enable;
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
      remarks: 'view fasilitas conventional existing facility',
    });
  }, []);

  const { data: konvenList } = useGetKonvenExistingList({
    filter: payloadFilterList(processId, filter),
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { data: sortByOptions } = useGetParameterList('sortCustomerFacilityKonven', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchCustomerFacilityKonven', { label: 'value1', value: 'value2' });

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

  const gotoDetailPage = (id: string, isEdit: boolean = false) => {
    const url = replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_INFORMATION_FACILITY_PAGE, {
      debtorId: processId, id, module: modul,
    });
    const finalUrl = isEdit ? `${url}?isEdit=true` : url;
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

  const { mutate: saveSyncArium } = useSyncArium({
    onError(e) {
      showNiceModalV2({
        onClose: () => {},
        title: e.message,
        type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        onClose: () => {},
        title: 'Sinkronisasi berhasil',
        type: 'success',
      });
    },
  });

  const { debtorData, isDebtor } = useTableDebtorInformationLocal();

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !isDebtor });


  const handleSyncArium = () => {
    saveSyncArium({ cif: isDebtor ? debtorData?.cif : bucketDetail?.cif });
  };

  return {
    anomalyRowStyle,
    filter,
    filterContentList,
    filterDropdownList,
    handleSyncArium,
    itemPerPage,
    konvenList,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useExistingFacilityTab;
