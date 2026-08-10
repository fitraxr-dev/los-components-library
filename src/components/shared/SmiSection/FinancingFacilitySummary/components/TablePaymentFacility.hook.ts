'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteFinancingFacility from '../hooks/useDeleteFinancingFacility';
import useGetFinancingFacilityByPipelineId from '../hooks/useGetFinancingFacilityByPipelineId';

import { modal, TABLE_HEADER_LIST } from './TablePaymentFacility.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTablePaymentFacility = (props: SmiComponentProps) => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const path = usePathname();
  const processUrl = path.split('/')[2];
  const isAnalyst = processUrl?.includes('analyst');

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { module, process } = props;

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: module,
    process: process,
  });
  const { data: facilityListData, isLoading: facilityListLoading } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: isAnalyst ? bucketDetail?.bucketParentId : processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, props);
  };

  // id examples
  // FacilityId = 'FAC-00090'
  // id = 64

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, { ...props, id });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, { id });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING);
  };

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus');
    },
  });

  const handleDeleteFinancingFacility = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFinancingFacility({ id }),
      submitText: 'Ya',
      type: 'warning',
    });
  };

  const popupSelectorHandler = () => {
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
  };

  const tableAction = viewOnly ?
    [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) }
    ] : [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) },
      { iconName: 'edit', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id }) },
      { iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility(id) }
    ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      key: 'action',
      label: 'Action',
      options: tableAction,
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = BigInt(0);

    facilityList.forEach((facility) => {
      // Remove commas and split the string into integer and decimal parts
      const [integerPart, decimalPart] = facility.orderValue.replace(/,/g, '').split('.');

      // Convert integer part to BigInt
      const integerPartBigInt = BigInt(integerPart);

      // Convert decimal part to BigInt, or use BigInt(0) if no decimal part exists
      const decimalPartBigInt = decimalPart ? BigInt(decimalPart) : BigInt(0);

      // Combine integer and decimal parts
      const orderValue = integerPartBigInt * BigInt(10 ** 2) + decimalPartBigInt;

      // Add the orderValue to the total
      totalOrderValue += orderValue;
    });

    // Format totalOrderValue with commas and two decimal places
    const formattedTotal = (totalOrderValue / BigInt(100)).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    return formattedTotal;
  }

  const [totalOrder, setTotalOrder] = useState('');
  useEffect(() => {
    if (facilityListData) {
      const facilityList = facilityListData;
      const totalOrderValue = calculateTotalOrderValue(facilityList?.contents);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
    }
  }, [facilityListData]);

  return {
    facilityListData,
    facilityListLoading,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableHeader,
    totalOrder,
    viewOnly,
  };
};

export default useTablePaymentFacility;
