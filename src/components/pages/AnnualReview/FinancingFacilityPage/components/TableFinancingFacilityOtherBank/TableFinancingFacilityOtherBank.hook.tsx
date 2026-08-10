import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { formatCurrency } from '@/helpers/formatCurrency';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import useDeleteFinancingFacilityOtherBank from '../../hooks/useDeleteFinancingFacilityOtherBank';
import useGetFinancingFacilityOtherBankList from '../../hooks/useGetFinancingFacilityOtherBankList';

import { modal } from './TableFinancingFacilityOtherBank.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableFinancingFacilityOtherBank = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const handleOpenAddModal = () => {
    NiceModal.show(modal.FORM_FACILITY_OTHER_BANK);
  };

  const {
    data: facilityOtherBankData,
    isLoading,
  } = useGetFinancingFacilityOtherBankList({
    filter: {
      bucketProcessId: processId,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, {
    enabled: !!processId,
  });


  const { isPending: isDeleteLoading, mutate: deleteFacility } = useDeleteFinancingFacilityOtherBank({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const tableData = facilityOtherBankData?.contents.map((item) => ({
    ...item,
    bank: item.bankLabel || '-',
    collectability: item.collectabilityLabel,
    debtorName: item.debtorName || '-',
    plafond: item.plafond || '-',
    plafondIdr: item.plafondIdr || '-',
    product: item.product || '-',
    rates: item.rates || '-',
  }));
  const tablePage = facilityOtherBankData?.page;

  const handleOpenDetail = (id: string) => {
    NiceModal.show(
      modal.DETAIL_FACILITY_OTHER_BANK,
      { id }
    );
  };

  const handleOpenEdit = (id: string) => {
    NiceModal.show(
      modal.FORM_FACILITY_OTHER_BANK,
      { id }
    );
  };

  const handleOnDelete = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFacility({ id }),
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'bank',
      label: 'Bank',
      render: (row) => {
        if (Array.isArray(row.otherBankList) && row.otherBankList.length > 0) {
          const otherBankLabels = row.otherBankList.map((item) => item.bankLabel);
          return (
            <>
              <TextStyle display="block" >{`${row.bankLabel},`}</TextStyle>
              {otherBankLabels.map((bank, idx) => {
                const isLastIndex = idx === otherBankLabels.length - 1;
                return <TextStyle key={bank} display="block">{`${bank}${isLastIndex ? '' : ','}`}</TextStyle>;
              })}
            </>
          );
        } else {
          return <TextStyle>{row.bankLabel}</TextStyle>;
        }
      },
      sx: { minWidth: '12vw' },
    },
    {
      key: 'product',
      label: 'Produk',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'plafond',
      label: 'Plafond',
      render: (row) => (
        <TextStyle variant="body4">
          {`${row?.currencyPlafond} ${formatCurrency(row?.plafond)}`}
        </TextStyle>
      ),
      sx: { minWidth: '12vw' },
    },
    {
      key: 'outstanding',
      label: 'O/S',
      render: (row) => (
        <TextStyle variant="body4">
          {`${row?.currencyOutstanding} ${formatCurrency(row?.outstanding)}`}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    {
      key: 'rates',
      label: 'Rate',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'callType',
      label: 'CL/NCL',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'isSyndication',
      label: 'Sindikasi',
      render: (row) => (
        <TextStyle>
          {row.isSyndication ? 'Ya' : 'Tidak'}
        </TextStyle>
      ),
      sx: { minWidth: '6vw' },
    },
    {
      key: 'collectability',
      label: 'Kolektibilitas',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: viewOnly
        ? [
          {
            iconName: 'detail',
            onClick: (row) => {
              NiceModal.show(
                modal.DETAIL_FACILITY_OTHER_BANK,
                { id: row?.id }
              );
            },
          },
        ]
        : [
          {
            iconName: 'detail',
            onClick: (row) => handleOpenDetail(row.id),
          },
          {
            iconName: 'edit',
            onClick: (row) => handleOpenEdit(row.id),
          },
          {
            iconName: 'delete',
            isDisabled: !!isDeleteLoading,
            onClick: (row) => handleOnDelete(row.id),
          },
        ],
      sx: { minWidth: '8vw' },
      type: 'action',
    },
  ];

  return {
    handleOpenAddModal,
    isLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useTableFinancingFacilityOtherBank;
