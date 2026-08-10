'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { modal } from '../../FinancingOverview.constants';
import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { TABLE_HEADER_LIST } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = () => {
  const { setFacilityId, parentId } = useIdentity();
  const viewOnly = useViewOnly();
  const theme = useTheme();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [contents, setContents] = useState<any[]>([]);
  const { data: facilityListData, isLoading: facilityListLoading } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: parentId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = BigInt(0);

    facilityList.forEach((facility) => {
      let valueToUse: string;

      if (facility.financingSegment === 'SYARIAH') {
      // For SYARIAH, use totalOrderValue (already a number, not a formatted string)
        valueToUse = facility.totalOrderValue?.toString() ?? '0';
      } else {
      // For KONVEN, use orderValue (formatted string with commas)
        valueToUse = facility.orderValue.replace(/,/g, '');
      }

      // Remove commas and split the string into integer and decimal parts
      const [integerPart, decimalPart] = valueToUse.split('.');

      // Convert integer part to BigInt
      const integerPartBigInt = BigInt(integerPart || '0');

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
      const facilityList = facilityListData.contents;
      const totalOrderValue = calculateTotalOrderValue(facilityList);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
    }
  }, [facilityListData]);

  useEffect(() => {
    setContents(
      facilityListData?.contents.map((data) => {
        const displayValue = data?.financingSegment === 'SYARIAH'
          ? data?.totalOrderValue?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          : data?.orderValueAfterExchangeRate;

        const currency = data?.financingSegment === 'SYARIAH'
          ? 'IDR'
          : data?.currencyOrderValueAfterExchangeRate;

        return {
          alreadyUpdate: data?.alreadyUpdate,
          bucketProcessId: data?.bucketProcessId,
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
      }) || []
    );
  }, [facilityListData]);


  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.FORM_FACILITY);
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING);
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.FORM_FACILITY, {
      id,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);

    const selectedFacility = contents.find((content: any) => content.id === id);
    const facilityToUse = selectedFacility || contents.find((content: any) => content.facilityId === facilityId);

    NiceModal.show(modal.DETAIL_FACILITY, {
      bucketProcessId: facilityToUse?.bucketProcessId,
      facilityId,
      id,
    });
  };

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus'),
  });

  const handleDeleteFinancingFacility = ({ id }: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFinancingFacility({ id }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
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
      { iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility({ id }) }
    ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      key: 'action',
      label: 'Action',
      options: tableAction,
      sx: { width: '10%' },
      type: 'action',
    },
  ];

  const anomalyRow = (val: any) => {
    if (val.alreadyUpdate === false)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };

  return {
    anomalyRow,
    contents,
    facilityListData,
    facilityListLoading,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    totalOrder,
  };
};

export default useTableFinancingFacilitySubmit;
