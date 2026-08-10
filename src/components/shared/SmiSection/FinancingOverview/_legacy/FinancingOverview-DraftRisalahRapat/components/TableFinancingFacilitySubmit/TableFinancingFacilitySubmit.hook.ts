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

import type { TableFinancingFacilitySubmitProps } from './TableFinancingFacilitySubmit.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = (props: TableFinancingFacilitySubmitProps) => {
  const { parentBucketId = '', module = TypeModule.MIP_REVIEW, process = TypeProcess.MIP_REVIEW } = props;
  const { setFacilityId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [contents, setContents] = useState([{}]);
  const { data: facilityListData, isLoading: facilityListLoading } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: parentBucketId,
      module: module,
      process: process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = BigInt(0);

    facilityList.forEach((facility) => {

      const [integerPart, decimalPart] = facility.orderValue.replace(/,/g, '').split('.');

      const integerPartBigInt = BigInt(integerPart);

      const decimalPartBigInt = decimalPart ? BigInt(decimalPart) : BigInt(0);

      const orderValue = integerPartBigInt * BigInt(10 ** 2) + decimalPartBigInt;

      totalOrderValue += orderValue;
    });

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
      facilityListData?.contents.map((data) => ({
        alreadyUpdate: data?.alreadyUpdate,
        facilityId: data?.facilityId,
        id: data?.id,
        locationProject: data?.locationProjectLabel,
        orderTypeLabel: data?.orderTypeLabel,
        orderValue: data?.currencyOrderValue + ' ' + data?.orderValueAfterExchangeRate,
        productLabel: data?.productLabel,
        projectName: data?.projectName,
        remark: data?.remark,
        timePeriod: data?.timePeriod,
        valueProject: data?.valueProject,
      }))
    );
  }, [facilityListData]);

  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.FORM_FACILITY, { module, process });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, { module, process });
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.FORM_FACILITY, {
      id,
      module,
      process,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {

    setFacilityId(facilityId);
    NiceModal.show(modal.DETAIL_FACILITY, {
      id,
      module,
      process,
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
    itemPerPage,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    totalOrder,
    viewOnly,
  };
};

export default useTableFinancingFacilitySubmit;
