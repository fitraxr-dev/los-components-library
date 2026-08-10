import { useEffect, useState } from 'react';


import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { businessActivityReport } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useCreateNewDebtor from '../../../InformationPage/hooks/useCreateNewDebtor';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDebtor = () => {
  const [selected, setSelected] = useState(null);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);
  const route = useCustomRouter();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'business-activity-report',
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      remarks: 'view list debtor',
    });
  }, []);

  const { mutate: saveDebtorDetail } = useCreateNewDebtor({
    onError() {
      showNiceModalV2({
        onClose: () => {
        },
        type: 'error',
      });
    },
    onSuccess(data) {
      route.push(replacePath(businessActivityReport.INFORMATION, {
        processId: data.data.content.bucketProcessId,
      }));
      recordActivity({
        activity: ActivityType.CREATE,
        changeAfter: JSON.stringify({
          payload: {
            comment: '',
            debtorId: selected.debtorId,
            module: TypeModule.BAR,
            process: TypeProcess.BAR,
          },
          type: 'existing',
        }),
        changeBefore: JSON.stringify({
          payload: {
            comment: '',
            debtorId: '',
            module: '',
            process: '',
          },
          type: '',
        }),
        menuCode: 'business-activity-report',
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remarks: 'create new bar with existing debtor',
      });
    },
  });

  const handleCreateBarWithExisting = () => {
    saveDebtorDetail({
      payload: {
        comment: '',
        debtorId: selected.debtorId,
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
      },
      type: 'existing',
    });
  };
  // const [gamList, setGamList] = useState([]);

  // --- PARAMETER ---
  // Get Customer search by options
  const { data: searchByOptions } = useGetParameterList('searchByDebtor', { label: 'value1', value: 'value2' });

  // Get Customer sort by options
  const { data: sortByOptions } = useGetParameterList('sortByDebtor', { label: 'value1', value: 'value2' });

  // Get Division filter options
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  // Get debtor data
  const { data, isFetching: isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail?.value?.length >= 3 ? filter?.searchDetail : null,
    sortList: filter?.sortList ?? null,
  }, { enabled: filter?.searchDetail?.value?.length >= 3 && filter?.searchDetail?.key?.length > 0 });

  const listMasterDebtor = data?.data.contents.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    institutionTypeLabel: debtor.institutionType ?? '-',
    npwp: debtor.npwp ?? '-',
  }));

  const totalPage = data?.data.page.totalPage ?? 1;

  const {
    mutate: validateCheckDk,
    data: dataValidateCheckDk,
  } = useValidateCheckDk({});

  // Map debtor data
  useEffect(() => {
    // Check whether user has try to search something
    if (
      // !hasSearched
      filter?.searchDetail?.value !== undefined
      && filter?.searchDetail?.value !== null
      && filter?.searchDetail?.value !== ''
    ) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }

    // Reset page to 1
    setPage(1);
    // Reset selected
  }, [filter]);

  // GET filter by options (GAM)
  const { data: filterByGamOptions } = useGetAllGam({ value: '' }, { division: 'divisionShort', label: 'fullName', value: 'userId' });

  const gamList = filterByGamOptions?.map((gam) => ({
    label: `${gam?.division} - ${gam?.label}`,
    value: gam?.value,
  }));

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,

      isSelected: (data) => selected?.debtorId === data.debtorId,

      key: 'checkbox',

      onSelectChange: (data) => {
        // If the item is already selected, deselect it
        if (selected?.debtorId === data.debtorId) {
          setSelected(null); // Deselect by setting it to null
        } else {
          validateCheckDk({
            debtorId: data.debtorId,
            debtorName: data.debtorName,
            feature: 'DK',
          });
          // Select the new item
          setSelected(data); // Set the selected data directly, no array
        }
      },

      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorId',
      label: 'Customer Id',
    },
    {
      key: 'cif',
      label: 'CIF',
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
    },
    {
      key: 'npwp',
      label: 'NPWP',
    },
    {
      key: 'divisionName',
      label: 'Divisi',
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamList,
      type: 'multiple-autocomplete',
    },
  ];

  const handleViewData = () => {
    NiceModal.show(MODAL.CUSTOMER_DK_VALIDATION, { data: dataValidateCheckDk?.similarDebtorList });
  };

  const dkStatus: 'isDuplicated' | 'isSimilar' | undefined = dataValidateCheckDk?.hasDuplicate ? 'isDuplicated' : dataValidateCheckDk?.hasSimilar ? 'isSimilar' : undefined;

  return {
    dataValidateCheckDk,
    dkStatus,
    filter,
    filterContentList,
    filterDropdownList,
    handleCreateBarWithExisting,
    handleViewData,
    hasSearched,
    isLoading,
    listMasterDebtor,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
