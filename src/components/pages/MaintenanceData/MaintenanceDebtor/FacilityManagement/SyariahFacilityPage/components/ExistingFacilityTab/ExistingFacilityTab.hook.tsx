import { useEffect, useState } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetDataAsOf from '../../hooks/useGetDataAsOf';
import useGetExistingFacilitySyariahLists from '../../hooks/useGetExistingFacilitySyariahList';
import useSyncTemenos from '../../hooks/useSyncTemenos';
import useTableDebtorInformationLocal from '../TableDebtorInformationLocal/TableDebtorInformationLocal.hook';

import { tableHeaderList } from './ExistingFacilityTab.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useExistingFacilityTab = () => {
  const [{ stepper }] = useApp();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [filter, setFilter] = useSessionStorage('filter-existing-facility-syariah', null);
  const { debtorData, isDebtor } = useTableDebtorInformationLocal();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'facility-management')?.enable;
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();
  const isMaster = pathname.split('/').includes('master');

  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const canView = useCheckAccess(accessid.MAINTENANCE_DEBTOR_VIEW);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (rowData?.hasModified && !canEdit) ? 'rgba(235, 87, 87, 0.2)' : 'inherit',
  });

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !isDebtor });

  const { data: dataAsOf } = useGetDataAsOf(
    payloadFilterList(String(processId)),
  );

  // --- Parameter ---
  const { data: searchByOptions } = useGetParameterList('searchByListFinancingSyariahExisting', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByListFinancingSyariahExisting', { label: 'value1', value: 'value2' });

  const {
    data: existingFacilitySyariahList,
    isLoading: isLoadingExistingFacilitySyariahList,
  } = useGetExistingFacilitySyariahLists({
    filter: payloadFilterList(String(processId), filter),
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const existingFacilitySyariahListContents = existingFacilitySyariahList?.contents;
  const existingFacilitySyariahListPage = existingFacilitySyariahList?.page;

  const handleSwitchDetailPage = (data) => {
    if (data && !data.childFacilityId) {
      const id = data.facilityId;
      router.push(replacePath(maintenanceDebtor.LIMIT_INDUK, {
        id,
        module: isMaster ? 'master' : 'maintenance',
        processId,
      }));
    }
    if (data && data.childFacilityId) {
      const id = data.facilityId;
      router.push(replacePath(maintenanceDebtor.DETAIL_LIMIT_ANAK, {
        id,
        module: isMaster ? 'master' : 'maintenance',
        processId,
      }));
    }
  };

  const handleSwitchEditPage = (data) => {
    if (data && !data.childFacilityId) {
      const id = data.facilityId;
      router.push(replacePath(maintenanceDebtor.LIMIT_INDUK, {
        id,
        module: isMaster ? 'master' : 'maintenance',
        processId,
      }));
    }
    if (data && data.childFacilityId) {
      const id = data.facilityId;
      router.push(replacePath(maintenanceDebtor.EDIT_LIMIT_ANAK, {
        id,
        module: isMaster ? 'master' : 'maintenance',
        processId,
      }));
    }
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
          isHidden: (data) => (!data.childFacilityId && !data.parentFacilityId) || !canView,
          onClick: (data) => {handleSwitchDetailPage(data);},
        },
        {
          iconName: 'edit',
          isHidden: (data) => !data.childFacilityId || isViewOnly || !canEdit,
          onClick: (data) => {handleSwitchEditPage(data);},
        }
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

  const filterDropdownList = searchByOptions;

  const searchByList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endAsOfDate',
      key: 'dateAsOf',
      label: 'Date As Of',
      placeholder1: 'Date',
      placeholder2: 'Date',
      startKey: 'startAsOfDate',
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

  const { mutate: saveSyncTemenos } = useSyncTemenos({
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

  const handleSyncTemenos = () => {
    saveSyncTemenos({ cif: isDebtor ? debtorData?.cif : bucketDetail?.cif });
  };

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'View Fasilitas Management Syariah Existing',
    });
  }, []);

  return {
    anomalyRowStyle,
    dataAsOf,
    debtorData,
    existingFacilitySyariahList,
    existingFacilitySyariahListContents,
    existingFacilitySyariahListPage,
    filter,
    filterDropdownList,
    filterList,
    handleSyncTemenos,
    isLoadingExistingFacilitySyariahList,
    itemPerPage,
    noPage,
    searchByList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useExistingFacilityTab;
