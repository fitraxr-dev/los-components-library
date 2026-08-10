'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { modal } from '../../FinancingOverview.constants';
import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { TABLE_HEADER_LIST } from './TableFinancingFacilitySubmit.constants';

import type { TableFinancingFacilitySubmitProps } from './TableFinancingFacilitySubmit.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = (props: TableFinancingFacilitySubmitProps) => {
  const { setFacilityId, processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const viewOnly = useViewOnly();
  const theme = useTheme();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [contents, setContents] = useState([{}]);
  const { data: facilityListData, isLoading: facilityListLoading } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: props.parentBucketId || '',
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
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId || ''),
      changeAfter: JSON.stringify({ action: 'create_new_facility' }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'open create new financing facility form',
    });

    setFacilityId('');
    NiceModal.show(modal.FORM_FACILITY);
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId || ''),
      changeAfter: JSON.stringify({ action: 'add_from_existing_facility' }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'open add from existing financing facility table',
    });

    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING);
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId || ''),
      changeAfter: JSON.stringify({ facilityId, id }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'edit financing facility',
    });

    setFacilityId(facilityId);
    NiceModal.show(modal.FORM_FACILITY, {
      id,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId }: any) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: String(processId || ''),
      changeAfter: JSON.stringify({ facilityId }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'view financing facility detail',
    });

    setFacilityId(facilityId);
    NiceModal.show(modal.DETAIL_FACILITY, {
      bucketProcessId: props.parentBucketId,
      facilityId,
    });
  };

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: String(processId || ''),
        changeAfter: JSON.stringify({ deleted: true }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'successfully deleted financing facility',
      });
      showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus');
    },
  });

  const handleDeleteFinancingFacility = ({ id }: any) => {
    recordActivity({
      activity: ActivityType.DELETE,
      bucketProcessId: String(processId || ''),
      changeAfter: JSON.stringify({ id }),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'attempt to delete financing facility',
    });

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
      { iconName: 'detail', onClick: ({ facilityId }) => handleOpenPopupPaymentFacilityDetail({ facilityId }) }
    ] : [
      { iconName: 'detail', onClick: ({ facilityId }) => handleOpenPopupPaymentFacilityDetail({ facilityId }) },
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
