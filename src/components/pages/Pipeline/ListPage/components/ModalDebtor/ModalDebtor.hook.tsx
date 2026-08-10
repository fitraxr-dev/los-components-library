import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useGetAllGam from '@/hooks/services/useGetAllGam';
import useGetMasterDebtor from '@/hooks/services/useGetMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import useDebounce from '@/hooks/useDebounce';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { modal } from '../../List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDebtor = () => {
  const [selected, setSelected] = useState([]);
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearch = useDebounce(selected, 6000);
  // const [gamList, setGamList] = useState([]);

  // --- PARAMETER ---

  const {
    isPending: isValidateCheckDkLoading,
    mutate: validateCheckDk,
    data: dataValidateCheckDk,
    isSuccess: isValidateCheckDkSucces,
  } = useValidateCheckDk({});


  const { data: searchByOptions } = useGetParameterList('searchByBucketActive', { label: 'value1', value: 'value2' });

  const { data: sortByOptions } = useGetParameterList('sortByBucketActive', { label: 'value1', value: 'value2' });

  // Get Division filter options
  const { data: divisionOptions } = useGetParameterList('division');
  // --- END OF PARAMETER ---

  // Get debtor data
  const filterLength = filter?.searchDetail?.value?.length;
  const { data, isFetching: isLoading } = useGetAllDebtor({
    filter: {
      ...filter?.filter,
      status: ['APPROVED'],
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filterLength >= 3
      ? filter?.searchDetail
      : null,
    sortList: filter?.sortList ?? null,
  },
  {
    enabled:
      filterLength >= 3 ||
      !!filterLength,
  }
  );

  // Record activity when debtor list is loaded in modal
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view debtor list in modal debtor',
      });
    }
  }, [data, page, pageSize, processId, recordActivity]);

  const listMasterDebtor = filterLength ? data?.data.contents.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    institutionTypeLabel: debtor.institutionType ?? '-',
    npwp: debtor.npwp ?? '-',
  })) : [];

  const totalPage = data?.data.page.totalPage ?? 1;

  // Map debtor data
  useEffect(() => {
    // Check whether user has try to search something
    setHasSearched(filter?.searchDetail?.value.length > 2);

    // Reset page to 1
    setPage(1);
    // Reset selected
    setSelected([]);
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
      isSelected: (data) => selected.some((el) => el.debtorId === data.debtorId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.debtorId === data.debtorId)) {
          setSelected([]);
        } else {
          validateCheckDk({
            debtorId: data.debtorId,
            debtorName: data.debtorName,
            feature: 'DK',
          });
          setSelected([data]);
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
      key: 'cif',
      label: 'CIF',
    },
    {
      key: 'institutionTypeLabel',
      label: 'Institution type',
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
      key: 'staffName',
      label: 'Nama Staff',
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
    NiceModal.show(modal.CUSTOMER_DK_VALIDATION, { data: dataValidateCheckDk?.similarDebtorList });
  };

  const dkStatus: 'isDuplicated' | 'isSimilar' | undefined = dataValidateCheckDk?.hasDuplicate ? 'isDuplicated' : dataValidateCheckDk?.hasSimilar ? 'isSimilar' : undefined;

  return {
    dataValidateCheckDk,
    dkStatus,
    filter,
    filterContentList,
    filterDropdownList,
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
