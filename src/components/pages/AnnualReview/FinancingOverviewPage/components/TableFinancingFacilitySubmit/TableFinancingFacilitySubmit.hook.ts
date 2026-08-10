'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import { modal } from '../../FinancingOverview.constants';
import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';

import { tableHeaderList } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = () => {
  const { setFacilityId, processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { isAnalyst, isDepiDivision, typeProcess } = useAnnualReviewContext();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const { data: facilityListData, isLoading: facilityListLoading, refetch } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = BigInt(0);

    facilityList.forEach((facility) => {
      // Remove commas and split the string into integer and decimal parts
      const [integerPart, decimalPart] = facility.totalOrderValue?.toString().replace(/,/g, '').split('.');

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
      const facilityList = facilityListData.contents;
      const totalOrderValue = calculateTotalOrderValue(facilityList);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
      let body = facilityList.map((item) => {
        return item.annualReview ? item.facilityId : null;
      });
      setSelected(body);
    }
  }, [facilityListData]);

  const tableData = facilityListData?.contents.map((data) => ({
    ...data,
    alreadyUpdate: data?.alreadyUpdate,
    facilityId: data?.facilityId,
    id: data?.id,
    locationProjectLabel: data?.locationProjectLabel,
    orderTypeLabel: data?.orderTypeLabel,
    orderValue: `${data?.currencyOrderValueAfterExchangeRate} ${data?.orderValueAfterExchangeRate}`,
    productLabel: data?.productLabel ? data?.productLabel : '-',
    projectName: data?.projectName,
    projectValue: `IDR ${data?.valueProject}`,
    remark: data?.remark,
    timePeriod: data?.timePeriod ? data?.timePeriod : '-',
  }));

  const tablePage = facilityListData?.page;

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
    });
  };

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      id,
    }).then(() => {
      refetch();
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {

    setFacilityId(facilityId);
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: facilityId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'annual-review',
      module: TypeModule.ANNUAL_REVIEW,
      process: typeProcess,
      remarks: `view detail payment facility from module ${TypeModule.ANNUAL_REVIEW}`,
    });
    NiceModal.show(modal.PAYMENT_FACILITY_DETAIL, {
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
    queryClient.invalidateQueries({ queryKey: ['getListFinancingFacility']});

  };

  const popupSelectorHandler = () => {
    // NiceModal.show(MODAL.GLOBAL.SELECTOR, {
    //   data: [
    //     {
    //       description: 'Pengajuan dari fasilitas existing',
    //       key: 'existing',
    //       label: 'Tambahkan dari Fasilitas Eksisting',
    //     },
    //   ],
    //   onSubmit: (val: any) => {
    handleOpenPopUpTableFacilityExisting();
    //   },
    //   title: 'Tambah Fasilitas Pembiayaan',
    // });
  };

  const tableAction = viewOnly || isAnalyst || isDepiDivision ?
    [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) }
    ] : [
      { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) },
      // { iconName: 'edit', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id }) },
      { iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility({ id }) }
    ];

  const handleSelected = (data) => {
    if (selected.some((item) => item === data.facilityId)) {
      setSelected(selected.filter((item) => item !== data.facilityId));
    } else {
      setSelected([...selected, data.facilityId]);
    }
  };

  const tableHeader: Array<TableHeader> = [
    // {
    //   isDisabled: () => viewOnly || isAnalyst || isDepiDivision,
    //   isSelected: (data) => selected.some((item) => item === data?.facilityId),
    //   key: 'checkbox',
    //   label: '',
    //   onSelectChange: (data) => handleSelected(data),
    //   sx: { width: '4%' },
    //   type: 'checkbox',
    // },
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
    isAnalyst,
    isDepiDivision,
    noPage,
    popupSelectorHandler,
    selected,
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
