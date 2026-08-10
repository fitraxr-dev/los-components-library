'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';

import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { tableHeaderList } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = ({
  hasShownFacilityAlert,
}: {
  hasShownFacilityAlert?: React.MutableRefObject<boolean>;
} = {}) => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const [state, _] = useApp();
  const queryClient = useQueryClient();

  const triggerFacilityAlertCheck = () => {
    if (hasShownFacilityAlert) {
      hasShownFacilityAlert.current = false;
    }
    queryClient.invalidateQueries({
      queryKey: ['check-facility', { bucketProcessId: processId }],
    });
  };

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { data: facilityListData, isLoading: facilityListLoading, refetch } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: processId,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
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
      module: state.pages.mipModule,
      onSuccess: () => {
        refetch();
        triggerFacilityAlertCheck();
      },
      process: state.pages.mipProcess,
    });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: state.pages.mipModule,
      onSuccess: triggerFacilityAlertCheck,
      process: state.pages.mipProcess,
    });
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);

    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      id,
      module: state.pages.mipModule,
      onSuccess: () => {
        refetch();
        triggerFacilityAlertCheck();
      },
      process: state.pages.mipProcess,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {

    setFacilityId(facilityId);
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: facilityId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'mip',
      module: state.pages?.mipModule,
      process: state.pages?.mipProcess,
      remarks: `view detail payment facility from module ${state.pages?.mipModule}`,
    });
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, {
      id,
      module: state.pages?.mipModule,
      process: state.pages?.mipProcess,
    });
  };

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus');
      triggerFacilityAlertCheck();
    },
  });

  const handleDeleteFinancingFacility = ({ id }: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFinancingFacility({ id }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
    queryClient.invalidateQueries({ queryKey: ['getListFinancingFacility']});

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

  return {
    anomalyRow,
    facilityListLoading,
    noPage,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    theme,
    totalOrder,
  };
};

export default useTableFinancingFacilitySubmit;
