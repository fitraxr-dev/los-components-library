'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
// import { modal } from '../../FinancingOverview.constants';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';

import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { tableHeaderList } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = () => {
  const { setFacilityId, processId } = useIdentity();
  const bucket = useSpfpBucketContext();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const [state] = useApp();

  // Check if user is Business division
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isBusiness = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);

  // Check if user is DPOP division
  const isDpop = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { data: facilityListData, isLoading: facilityListLoading, refetch } = useGetListFinancingFacility({
    filter: {
      ...bucket,
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


  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      module: bucket.module,
      onSuccess: () => refetch(),
      process: bucket.process,
    });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: bucket.module,
      process: bucket.process,
    });
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);

    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      bucketProcessId: bucket.bucketProcessId,
      facilityId,
      id,
      module: bucket.module,
      process: bucket.process,
    }).then(() => {
      refetch();
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, {
      bucketProcessId: bucket.bucketProcessId,
      facilityId,
      id,
      module: bucket.module,
      process: bucket.process,
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

  const tableAction = isDpop || viewOnly || bucket.process === TypeProcess.SPFP_FINAL ?
    [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) }
    ] : [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) },
      { iconName: 'edit', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id }) },
      { iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility({ id }) }
    ];

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: tableAction,
      sx: { minWidth: '8vw' },
      type: 'action',
    },
  ];

  const anomalyRow = (val: any) => {
    if (val.alreadyUpdate === false)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };

  const shouldShowAddButton = !viewOnly && !isDpop && bucket.process !== TypeProcess.SPFP_FINAL;

  return {
    anomalyRow,
    facilityListLoading,
    noPage,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    shouldShowAddButton,
    tableData,
    tableHeader,
    tablePage,
    theme,
    totalOrder,
  };
};

export default useTableFinancingFacilitySubmit;
