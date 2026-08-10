'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

// import { modal } from '../../FinancingOverview.constants';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';

import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { tableHeaderList } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = (props: { module: string; process: string }) => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [contents, setContents] = useState([{}]);
  const { data: facilityListData, isLoading: facilityListLoading } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: processId,
      module: props.module,
      process: props.process,
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
        valueToUse = facility.totalOrderValue?.toString() ?? '0';
      } else {
        valueToUse = facility.orderValue.replace(/,/g, '');
      }

      const [integerPart, decimalPart] = valueToUse.split('.');
      const integerPartBigInt = BigInt(integerPart || '0');
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
      facilityListData?.contents.map((data) => {
        const displayValue = data?.financingSegment === 'SYARIAH'
          ? data?.totalOrderValue?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
          : data?.orderValueAfterExchangeRate;

        const currency = data?.financingSegment === 'SYARIAH'
          ? 'IDR'
          : data?.currencyOrderValueAfterExchangeRate;

        return {
          alreadyUpdate: data?.alreadyUpdate,
          facilityId: data?.facilityId,
          id: data?.id,
          locationProjectLabel: data?.locationProjectLabel,
          orderTypeLabel: data?.orderTypeLabel,
          orderValue: `${currency} ${displayValue}`,
          productLabel: data?.productLabel,
          projectName: data?.projectName,
          remark: data?.remark,
          timePeriod: data?.timePeriod,
        };
      })
    );
  }, [facilityListData]);


  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      module: props.module,
      process: props.process,
    });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: props.module,
      process: props.process,
    });
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: props.module,
      process: props.process,
      remarks: `Open Modal Edit facility ID: ${facilityId}`,
    });
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      id,
      module: props.module,
      process: props.process,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id, module, process }: any) => {
    setFacilityId(facilityId);
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: props.module,
      process: props.process,
      remarks: `View detail for facility ID: ${facilityId}`,
    });
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, {
      bucketProcessId: processId,
      facilityId,
      module,
      process,
    });
  };

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            title: 'Harap lakukan kalkulasi ulang pada perhitungan BMPP',
          });
        },
        title: 'Fasilitas pembiayaan berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteFinancingFacility = ({ id }: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId,
          module: props.module,
          process: props.process,
          remarks: `Delete facility ID: ${id}`,
        });
        deleteFinancingFacility({ id });
      },
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
      {
        iconName: 'detail', onClick: ({ facilityId, id }) => {
          handleOpenPopupPaymentFacilityDetail({ facilityId, id, module: props.module, process: props.process });
        },
      }
    ] : [
      {
        iconName: 'detail', onClick: ({ facilityId, id, module, process }) => {
          handleOpenPopupPaymentFacilityDetail({ facilityId, id, module: props.module, process: props.process });
        },
      },
      { iconName: 'edit', onClick: ({ facilityId, id, module, process }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id, module, process }) },
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
