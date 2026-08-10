'use client';

import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteFinancingFacility from './hooks/useDeleteFinancingFacility';
import useGetFinancingFacilityByPipelineId from './hooks/useGetFinancingFacilityByPipelineId';
import { modal, TABLE_HEADER_LIST } from './TablePaymentFacility.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTablePaymentFacility = (props: SmiComponentProps) => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { module, process } = props;

  const { data: facilityListData, isLoading: isFacilityListLoading } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module,
      process,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const handleOpenPopUpPaymentFacilityNew = React.useCallback(() => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, props);
  }, [setFacilityId, props]);

  const handleOpenPopupPaymentFacilityEdit = React.useCallback(({ facilityId, id }) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, { ...props, id });
  }, [setFacilityId, props]);

  const handleOpenPopupPaymentFacilityDetail = React.useCallback(({ facilityId, id }) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, { id });
  }, [setFacilityId]);

  const handleOpenPopUpTableFacilityExisting = React.useCallback(() => {
    const modalId = props.typeProcess === 'ANNUAL_REVIEW'
      ? modal.TABLE_PAYMENT_FACILITY_EXISTING_ANNUAL_REVIEW
      : modal.TABLE_PAYMENT_FACILITY_EXISTING;
    NiceModal.show(modalId, {
      module,
      process,
    });
  }, [module, process, props.typeProcess]);

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus');
    },
  });

  const handleDeleteFinancingFacility = React.useCallback((id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFinancingFacility({ id }),
      submitText: 'Ya',
      type: 'warning',
    });
  }, [deleteFinancingFacility]);

  const popupSelectorHandler = React.useCallback(() => {
    if (props.typeProcess === 'ANNUAL_REVIEW') {
      handleOpenPopUpTableFacilityExisting();
      return;
    }
    NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          description: 'Pengajuan fasilitas baru',
          key: 'new',
          label: 'Create New',
        },
        {
          description: 'Pengajuan dari fasilitas existing',
          key: 'existing',
          label: 'Tambahkan dari Fasilitas Eksisting',
        },
      ],
      onSubmit: (val: any) => {
        if (val === 'new') handleOpenPopUpPaymentFacilityNew();
        else handleOpenPopUpTableFacilityExisting();
      },
      title: 'Tambah Fasilitas Pembiayaan',
    });
  }, [handleOpenPopUpPaymentFacilityNew, handleOpenPopUpTableFacilityExisting]);

  const tableAction = React.useMemo(() => {
    return [
      {
        iconName: 'detail',
        onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }),
      },
      ...(!viewOnly ? [
        {
          iconName: 'edit',
          isHidden: props.typeProcess === 'ANNUAL_REVIEW',
          onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id }),
        },
        {
          iconName: 'delete',
          onClick: ({ id }) => handleDeleteFinancingFacility(id),
        }
      ] : [])
    ];
  }, [
    viewOnly,
    handleOpenPopupPaymentFacilityDetail,
    handleOpenPopupPaymentFacilityEdit,
    handleDeleteFinancingFacility
  ]);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER_LIST,
      {
        key: 'action',
        label: 'Action',
        options: tableAction,
        sx: { minWidth: '8vw' },
        type: 'action',
      },
    ];
  }, [tableAction]);

  return {
    isLoading: isFacilityListLoading,
    page,
    pageSize,
    popupSelectorHandler,
    setPage,
    setPageSize,
    tableData: facilityListData?.contents,
    tableHeader,
    totalPage: facilityListData?.page?.totalPage ?? 1,
  };
};

export default useTablePaymentFacility;
