'use client';

import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteFinancingFacility from './hooks/useDeleteFinancingFacility';
import useGetFinancingFacilityByPipelineId from './hooks/useGetFinancingFacilityByPipelineId';
import { modal, TABLE_HEADER_LIST } from './TablePaymentFacility.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTablePaymentFacility = (props: SmiComponentProps) => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const [state, _] = useApp();

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

  const tableData = facilityListData?.contents.map((data) => {
    const displayValue = data?.financingSegment === 'SYARIAH'
      ? data?.totalOrderValue?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
      : data?.orderValueAfterExchangeRate;

    const currency = data?.financingSegment === 'SYARIAH'
      ? 'IDR'
      : data?.currencyOrderValueAfterExchangeRate;

    return {
      ...data,
      alreadyUpdate: data?.alreadyUpdate,
      facilityId: data?.facilityId,
      id: data?.id,
      locationProjectLabel: data?.locationProjectLabel,
      orderTypeLabel: data?.orderTypeLabel,
      orderValue: `${currency} ${displayValue}`,
      productLabel: data?.productLabel ? data?.productLabel : '-',
      projectName: data?.projectName,
      projectValue: `IDR ${data?.valueProject}`,
      remark: data?.remark,
      timePeriod: data?.timePeriod ? data?.timePeriod : '-',
    };
  });

  const tablePage = facilityListData?.page;

  const handleOpenPopUpPaymentFacilityNew = React.useCallback(() => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, props);
  }, [setFacilityId, props]);

  const handleOpenPopupPaymentFacilityEdit = React.useCallback(({ facilityId, id }) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, { ...props, id });
  }, [setFacilityId, props]);

  const handleOpenPopupPaymentFacilityDetail = React.useCallback(({ facilityId, id, module, process }) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, { id, module, process });
  }, [setFacilityId]);

  const handleOpenPopUpTableFacilityExisting = React.useCallback(() => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  }, []);

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
        onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id, module, process }),
      },
      ...(!viewOnly ? [
        {
          iconName: 'edit',
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
    tableData,
    tableHeader,
    totalPage: facilityListData?.page?.totalPage ?? 1,
  };
};

export default useTablePaymentFacility;
