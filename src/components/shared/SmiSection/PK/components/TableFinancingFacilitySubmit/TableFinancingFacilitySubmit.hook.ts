'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { engagementSubmission, accessid } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import {
  modal,
  modal as modalPaymentFacility,
} from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';


import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';
import useGetListFinancingFacility from '../../hooks/useGetListFinancingFacility';
import useGetListSyariahFacility from '../../hooks/useGetListSyariahFacility';
import { MODALPK } from '../../PK.constants';

import { TABLE_HEADER_LIST } from './TableFinancingFacilitySubmit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = (
  {
    module,
    process,
    isPK,
    isLpsMode,
    isBeingProcessed }: {
    module: string;
    process: string;
    isPK?: boolean;
    isLpsMode?: boolean;
    isBeingProcessed?: boolean;
  }) => {
  const router = useRouter();
  const isLegalSigning = process === TypeProcess.LEGAL_SIGNING;
  const { setFacilityId, processId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [contents, setContents] = useState([{}]);
  const [showAlertFacility, setShowAlertFacility] = useState(false);

  // user access in engagement submission
  const canEditDataPerikatan = useCheckAccess(accessid.PENGAJUAN_PERIKATAN_BUCKET_LIST_UPDATE);

  const { data: facilityListData, isLoading: facilityListLoading } = useGetListFinancingFacility({
    filter: {
      bucketProcessId: isLegalSigning ? parentId : processId,
      module: module,
      process: isLegalSigning ? TypeProcess.ENGAGEMENT_AGREEMENT : process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });

  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => showNiceModal('success', 'Fasilitas pembiayaan berhasil dihapus'),
  });

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      // Ambil dari facility.totalOrderValue
      const orderValue = facility.totalOrderValue ? facility.totalOrderValue : 0;

      // Add the orderValue to the total
      totalOrderValue += orderValue;
    });

    // Format totalOrderValue with commas and two decimal places
    const formattedTotal = totalOrderValue.toLocaleString('en-US', {
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

        data?.alreadyUpdate === false ? setShowAlertFacility(true) : {};

        return {
          alreadyUpdate: data?.alreadyUpdate,
          facilityId: data?.facilityId,
          financingSegmentLabel: data?.financingSegmentLabel,
          id: data?.id,
          mappingFinancingSegmentLabel: data?.mappingFinancingSegmentLabel ?? '-',
          mappingOrderType: data?.mappingOrderTypeLabel ?? '-',
          mappingOrderTypeLabel: data?.mappingOrderTypeLabel ?? '-',
          orderType: data?.orderType,
          orderTypeLabel: data?.orderTypeLabel,
          productLabel: data?.productLabel,
          projectName: data?.projectName,
          timePeriod: data?.timePeriod,
          totalOrderValue: `${currency} ${displayValue}`,
        };
      })
    );
  }, [facilityListData]);

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id, orderType }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      id,
      module,
      process,
      type: orderType === 'New From Existing' ? 'existing' : undefined,
    });
  };

  const handleOpenPopupPaymentFacilityDetail = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(MODALPK.DETAIL_FACILITY, {
      hidePK: true,
      id,
    });
  };

  // Edit data pengajuan perikatan
  const handleOpenPopupPaymentFacilityEditPerikatan = ({ facilityId, id, orderType }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      id,
      module,
      process,
      type: orderType === 'New From Existing' ? 'existing' : undefined,
    });
  };

  // Detail data pengajuan perikatan
  const handleOpenPopupPaymentFacilityDetailPerikatan = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(MODALPK.DETAIL_FACILITY_PENGAJUAN_PERIKATAN, {
      id,
    });
  };

  const handleDeleteFinancingFacility = ({ id }: any) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteFinancingFacility({ id }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const handleOpenAdditionalFacility = ({ id }: any) => {
    alert(`Facility ID : ${id} - Todo Goto Page Additional Facility `);
  };

  const { data: facilitySyariahListData, isLoading: facilitySyariahListLoading } = useGetListSyariahFacility({
    filter: {
      bucketProcessId: isLegalSigning ? parentId : processId,
      module: module,
      process: isLegalSigning ? TypeProcess.ENGAGEMENT_AGREEMENT : process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  }, isPK);

  const handleOpenParentChildLimit = ({ facilityId, id }: any) => {
    // Navigasi ke halaman ParentChildLimit
    let listFacility = [];
    let parentSyariahLimitId: any;
    if (isPK && !isLpsMode) {
      const facilityhasUsed = facilitySyariahListData?.contents.map((item) => item.facilityId).flat();
      for (let i = 0; i < facilityhasUsed.length; i++) {
        if (!listFacility.includes(facilityhasUsed[i])) {
          listFacility.push(facilityhasUsed[i]);
        }
      }
    }
    if (!listFacility.includes(facilityId)) {
      localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));
    } else {
      parentSyariahLimitId = facilitySyariahListData?.contents.find((item) =>
        item.facilityId.includes(facilityId))?.parentSyariahLimitId;

      listFacility = [];

      const facilityhasUsed = facilitySyariahListData?.contents.filter((item) =>
        item.parentSyariahLimitId !== parentSyariahLimitId)
        .map((item) => item.facilityId).flat();
      for (let i = 0; i < facilityhasUsed.length; i++) {
        if (!listFacility.includes(facilityhasUsed[i])) {
          listFacility.push(facilityhasUsed[i]);
        }
      }

      localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));

    }


    const basePath = engagementSubmission.FACILITY_PARENT_CHILD_LIMIT.replace('[processId]', processId);
    const queryParams = isLpsMode ? '?lpsMode=true' : !parentSyariahLimitId ? `?facilityId=${facilityId}&createNew=true` : `?parentSyariahLimitId=${parentSyariahLimitId}`;
    router.push(basePath + queryParams);
  };

  const getTableAction = (row) => {
    if (viewOnly || process === TypeProcess.LEGAL_SIGNING || isBeingProcessed) {
      return [
        { iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetail({ facilityId, id }) }
      ];
    }

    const actions = [];

    // aksi 1
    if (process === TypeProcess.ENGAGEMENT_AGREEMENT) {
      // edit atau detail
      if (canEditDataPerikatan) {
        actions.push({ iconName: 'edit', onClick: ({ facilityId, id, orderType }) => handleOpenPopupPaymentFacilityEditPerikatan({ facilityId, id, orderType }) });
      } else {
        actions.push({ iconName: 'detail', onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityDetailPerikatan({ facilityId, id }) });
      }
    } else {
      actions.push({ iconName: 'edit', onClick: ({ facilityId, id, orderType }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id, orderType }) });
    }

    // aksi 2
    actions.push({ iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility({ id }) });

    // aksi 3
    if (process === TypeProcess.ENGAGEMENT_AGREEMENT && row.financingSegmentLabel === 'Syariah') {
      actions.push({ iconName: 'lps', onClick: ({ facilityId, id }) => handleOpenParentChildLimit({ facilityId, id }) });
    }

    if (process === TypeProcess.LPS_CORE) {
      actions.push({ iconName: 'additional-facility', onClick: ({ id }) => handleOpenAdditionalFacility({ id }) });
    }

    return actions;
  };

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      key: 'remark',
      label: 'Keterangan',
      sx: {
        minWidth: '10.5vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: (row) => getTableAction(row),
      sx: {
        minWidth: '7.5vw',
      },
      type: 'action',
    },
  ];

  const anomalyRow = (val: any) => {
    if (val.alreadyUpdate === false)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
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

  const handleOpenPopUpTableFacilityExisting = () => {
    // NiceModal.show(MODALPK.TABLE_PAYMENT_FACILITY_EXISTING);
    NiceModal.show(modalPaymentFacility.TABLE_PAYMENT_FACILITY_EXISTING, {
      module,
      process,
    });
  };

  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      module,
      process,
    });
  };

  return {
    anomalyRow,
    contents,
    facilityListData,
    facilityListLoading,
    isLegalSigning,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    showAlertFacility,
    tableHeader,
    theme,
    totalOrder,
    viewOnly,
  };
};

export default useTableFinancingFacilitySubmit;
