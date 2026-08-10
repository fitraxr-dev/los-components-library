import { useState } from 'react';

import useSessionStorage from '@/hooks/useSessionStorage';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDebtor = () => {
  const [selected, setSelected] = useState([]);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected([]);
        } else {
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
      key: 'debtorName',
      label: 'Nama Customer',
    },
    {
      key: 'collateralType',
      label: 'Jenis Agunan',
    },
    {
      key: 'liquidationValue',
      label: 'Indikasi nilai Likuidasi Total',
    },
    {
      key: 'marketValue',
      label: 'Nilai Pasar Total',
    },
    {
      key: 'value',
      label: 'Luas Tanah/Jumlah/Unit/LotTotal',
    },
    {
      key: 'location',
      label: 'Lokasi Objek',
    },
  ];

  const filterDropdownList = [];

  const filterContentList = [];

  return {
    // data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading: false,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
