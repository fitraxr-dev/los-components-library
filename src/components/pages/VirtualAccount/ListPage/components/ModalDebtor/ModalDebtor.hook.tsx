import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { virtualAccount } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetBucketListStatus from '@/components/pages/UserManagement/UserList/hooks/useGetBucketListStatus';
import Button from '@/components/shared/Button';

import { FILTER_DIVISION_OPTIONS, FILTER_GAM_OPTIONS, FILTER_OPTIONS, SORT_OPTIONS } from '../../../__mocks__/mockData';
import useCheckSubmission from '../../../hooks/useCheckSubmission';
import useGetCustomerList from '../../../hooks/useGetCustomerList';
import useGetDivisionList from '../../../hooks/useGetDivisionList';
import useGetGamList from '../../../hooks/useGetGamList';
import useGetParameterListVa from '../../../hooks/useGetParameterListVa';
import { modal } from '../../List.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDebtor = (modalId: string) => {
  const [selected, setSelected] = useState([]);
  const router = useCustomRouter();

  const [filter, setFilter] = useState<SearchValue>(null);
  const [noPage, setNoPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // setPage(1);
    setSelected([]);
  }, [filter]);


  const { data: divisionList } = useGetDivisionList();
  const divisionOption = divisionList?.filter((item: any) => item.key && item.label) .map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  const { data: sortByOptions } = useGetParameterListVa('sortByDebtorVa');
  const { data: searchByOptions } = useGetParameterListVa('searchByBucketVA');


  const { data: gamList } = useGetGamList();
  const gamListOptions = gamList?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  const { data: statusData } = useGetBucketListStatus({ module: TypeModule.VA_CREATION,
    process: TypeProcess.VA_CREATION });

  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];


  const { data: customerList, isFetching: isLoading } = useGetCustomerList({
    filter: {
      ...filter?.filter,
      // status: filter?.filter?.status ? filter?.filter?.status?.map((value) => Number(value)) : [],
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tablePage = customerList?.page;


  const tableData = customerList?.contents.map((data) => ({
    ...data,
    cif: data.cif ?? '-',
    customerId: data.customerId ?? '-',
    customerName: data.customerName ?? '-',
    division: data.division ?? '-',
    gam: data.gam ?? '-',
  }));

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) =>
        selected.some((el) => el.customerId === data.customerId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (
          selected.some((el) => el.customerId === data.customerId)
        ) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      sx: { minWidth: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4%' },
      type: 'index',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'customerName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },

    {
      key: 'division',
      label: 'Divisi',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      sx: { minWidth: '10vw' },
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOption,
      type: 'multiple-autocomplete',
    },
    {
      key: 'gam',
      label: 'General Account Manager',
      options: gamListOptions,
      type: 'multiple-autocomplete',
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   options: statusByOptions,
    //   type: 'multiple-autocomplete',
    // },
  ];

  const { data: checkSubmission } = useCheckSubmission({ id: selected[0]?.customerId });
  const check = checkSubmission?.content?.hasSubmission;

  const handleCreate = () => {
    if (selected.length === 1) {
      if (!check) {
        const nextPath = replacePath(virtualAccount.VA_DETAIL_CUSTOMER,
          { processId: `${selected[0]?.customerId}~${'VA-ID'}` });
        router.push(nextPath);
        closeNiceModal(modal.DEBTOR);
      } else {
        NiceModal.show(MODAL.GLOBAL.WARNING, {
          cancelText: 'Close',
          title: 'Customer sedang dalam proses pengajuan VA. Tunggu atau pilih customer lain.',
        }); }

    } else {
      console.log('Pilih satu customer untuk melanjutkan.');}
  };


  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleCreate,
    hasSearched,
    isLoading,
    noPage,
    selected,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};
