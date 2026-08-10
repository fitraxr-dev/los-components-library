'use client';
import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { engagementSubmission, loanProcessingSummary } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailProcessingType from '@/components/shared/SmiSection/PK/hooks/useGetDetailProcessingType';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';
import useGetListSyariahFacility from '@/components/shared/SmiSection/PK/hooks/useGetListSyariahFacility';
import { MODALPK } from '@/components/shared/SmiSection/PK/PK.constants';
import { modal } from '@/components/shared/SmiTable/TablePaymentFacility/TablePaymentFacility.constants';

import { MODAL_FINANCING } from '../../FacilityOverview.constants';
import useDeleteFinancingFacility from '../../hooks/useDeleteFinancingFacility';

import { TABLE_HEADER_LIST } from './TableFinancingFacilitySubmit.constants';

import type { options, TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableFinancingFacilitySubmit = (
  { module, process }: { module: string; process: string }) => {
  const isLegalSigning = process === TypeProcess.LEGAL_SIGNING;
  const { setFacilityId, processId, parentId } = useIdentity();
  const currentPath = usePathname();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(100);
  const [contents, setContents] = useState([{}]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: pkDetail,
    isSuccess,
  } = useGetDetailProcessingType(
    { bucketProcessId: parentId, id: 0 }
  );

  const currentPkName = pkDetail?.pkName ? pkDetail.pkName.split('-')[0] : '';
  const pkId = pkDetail?.bucketParentId;


  const { data: facilitySyariahListData } = useGetListSyariahFacility({
    filter: {
      bucketProcessId: processId,
      module,
      process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });


  const { data: facilityListDataX, pending: facilityListLoading, page } = useGetListFinancingPk(
    {
      filter: {
        bucketProcessId: processId,
        module,
        process,
      },
      page: {
        itemPerPage: itemPerPage,
        noPage: noPage,
      },
    },
    {
      bucketProcessId: parentId,
    },
    undefined,
    undefined,
    0
  );

  const facilityListData = useMemo(() => {
    return facilityListDataX
      ?.filter((res) => res !== undefined)
      ?.filter((res) => res?.pkName !== null);
  }, [facilityListDataX]);

  const { data: detailData } = useGetBucketById({
    bucketProcessId: processId, module, process,
  });

  const isCompleted = detailData?.statusLabel?.toLowerCase() === 'new los completed';

  const { data: validateResult } = useGetValidateResult({
    debtorId: detailData?.debtorId,
  }, {
    enabled: !!detailData?.debtorId,
  });

  const isBeingProcessed = validateResult?.content?.isAlertFacilityShow ?? false;


  const { mutate: deleteFinancingFacility } = useDeleteFinancingFacility({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Fasilitas pembiayaan berhasil dihapus',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
    },
  });

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      // Ambil dari facility.totalOrderValue
      const orderValue = facility?.totalOrderValue ? facility?.totalOrderValue : 0;

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


  function calculateTotalOrderValuePk(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      // @ts-ignore
      const orderValue = facility?.totalOrderValuePk ? facility.totalOrderValuePk : 0;

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
  const [totalOrderPk, setTotalOrderPk] = useState('');
  const [canAdd, setCanAdd] = useState(true);
  const [isNominalMismatch, setIsNominalMismatch] = useState(false);

  useEffect(() => {
    localStorage.removeItem('facilityhasUsed');
  }, []);

  useEffect(() => {
    if (facilityListData) {
      const facilityList = facilityListData;
      const totalOrderValue = calculateTotalOrderValue(facilityList);
      const totalOrderValuePk = calculateTotalOrderValuePk(facilityList);

      let numericTotalOrder = 0;
      let numericTotalOrderPk = 0;

      facilityList.forEach((facility) => {
        numericTotalOrder += facility?.totalOrderValue ? facility?.totalOrderValue : 0;
        // @ts-ignore
        numericTotalOrderPk += facility?.totalOrderValuePk ? facility?.totalOrderValuePk : 0;
      });

      setTotalOrder('IDR' + ' ' + totalOrderValue);
      setTotalOrderPk('IDR' + ' ' + totalOrderValuePk);
      setCanAdd(numericTotalOrder < numericTotalOrderPk);
      setIsNominalMismatch(numericTotalOrder !== numericTotalOrderPk);
    }
  }, [facilityListData]);

  useEffect(() => {
    if (facilityListData) {
      setContents(
        facilityListData?.map((data) => {
          const displayValue = data?.financingSegment === 'SYARIAH'
            ? (data?.totalOrderValue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            : (data?.orderValueAfterExchangeRate ?? '0.00');

          const currency = data?.financingSegment === 'SYARIAH'
            ? 'IDR'
            : (data?.currencyOrderValueAfterExchangeRate ?? 'IDR');

          // @ts-ignore
          const displayValuePk = data?.financingSegment === 'SYARIAH'
            // @ts-ignore
            ? (data?.totalOrderValuePk ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            // @ts-ignore
            : (data?.orderValueAfterExchangeRatePk ?? '0.00');

          return {
            ...data,
            alreadyUpdate: data?.alreadyUpdate,
            facilityId: data?.facilityId,
            financingSegment: data?.financingSegment,
            id: data?.id,
            locationProjectLabel: data?.locationProjectLabel,
            mappingFinancingSegment: data?.mappingFinancingSegment ?? '-',
            mappingOrderType: data?.mappingOrderTypeLabel ?? '-',
            mappingOrderTypeLabel: data?.mappingOrderTypeLabel ?? '-',
            orderTypeLabel: data?.orderTypeLabel,
            orderValue: `${currency} ${displayValue}`,
            orderValuePk: `${currency} ${displayValuePk}`,
            productLabel: data?.productLabel,
            projectName: data?.projectName,
            remark: data?.remark,
            timePeriod: data?.timePeriod,
            // @ts-ignore
            valueProject: data?.currencyValueProject + ' ' + data?.valueProject,
          };
        })
      );
    } else {
      setContents([{}]);
    }
  }, [facilityListData]);


  const handleOpenParentChildLimit = ({ facilityId, id, parentSyariahLimitId }: any) => {
    const basePath = loanProcessingSummary.FACILITY_PARENT_CHILD_LIMIT.replace('[processId]', processId);

    const allUsedFacilityIds = (facilitySyariahListData as any)?.contents?.reduce((acc: string[], item: any) => {
      if (item.facilityId && Array.isArray(item.facilityId)) {
        return [...acc, ...item.facilityId];
      }
      return acc;
    }, []) || [];

    const availableFacilityIds = facilityListData
      ?.filter((item) => item.facilityId && !allUsedFacilityIds.includes(item.facilityId))
      ?.map((item) => item.facilityId) || [];

    if (!parentSyariahLimitId) {
      const listFacility = Array.from(new Set([facilityId, ...availableFacilityIds]));
      localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));
      router.push(`${basePath}?facilityId=${facilityId}&lpsMode=true&createNewLps=true${isBeingProcessed ? '&viewOnly=true' : ''}`);
      return;
    }

    const matchedSyariah = (facilitySyariahListData as any)?.contents?.find((item: any) =>
      item.facilityId?.includes(facilityId)
    );

    const facilityIdsFromMatched = matchedSyariah?.facilityId || [];

    const listFacility = Array.from(new Set([...facilityIdsFromMatched, ...availableFacilityIds]));

    localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));

    const queryParams = new URLSearchParams({
      lpsMode: 'true',
      parentSyariahLimitId: parentSyariahLimitId ?? '',
      ...(isBeingProcessed && { viewOnly: 'true' }),
    });

    router.push(`${basePath}?${queryParams.toString()}`);
  };

  const tableAction: options = [
    {
      iconName: 'detail',
      isDisabled: ({ facilityId }) => !facilityId,
      isHidden: (row) => row?.isDeletedFromLps === true,
      onClick: (data) => handleOpenPopupPaymentFacilityDetail(data?.id, data?.facilityId, data?.bucketProcessId),
    },
    {
      iconName: 'edit',
      isDisabled: ({ facilityId }) => !facilityId || viewOnly || isBeingProcessed,
      isHidden: (row) => isCompleted || row?.isDeletedFromLps === true,
      onClick: ({ facilityId, id }) => handleOpenPopupPaymentFacilityEdit({ facilityId, id }),
    },
    {
      iconName: 'lps',
      isDisabled: ({ facilityId }) => !facilityId,
      isHidden: (row) => row?.financingSegment !== 'SYARIAH' || row?.isDeletedFromLps === true,
      onClick: ({ facilityId, id, parentSyariahLimitId }) => handleOpenParentChildLimit({
        facilityId, id, parentSyariahLimitId,
      }),
    },
    {
      iconName: 'delete',
      isDisabled: ({ facilityId }) => !facilityId || viewOnly || isBeingProcessed,
      isHidden: (row) => isCompleted || row?.isDeletedFromLps === true,
      onClick: ({ id }) => handleDeleteFinancingFacility({ id }),
    },
    // Permintaan BA di hide Sementara
    // {
    //   iconName: 'additional-facility',
    //   onClick: ({ facilityId, id }) => handleAdditionalFacility({ facilityId, id }),
    // }

  ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      isHidden(row) {
        if (!row?.facilityId) return true;
      },
      key: 'action',
      label: 'Action',
      options: tableAction,
      sx: {
        minWidth: '10.5vw',
      },
      type: 'action',
    },
  ];

  const anomalyRow = (val: any) => {
    if (val.alreadyUpdate === false || val.isDeletedFromLps || val.isMappingNotCompleted || val?.isSendToCoreFail)
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

  /** Permintaan BA di hide Sementara */
  const handleAdditionalFacility = ({ id, facilityId }) => {
    setFacilityId(facilityId);
    const urlAdditonalFacility = loanProcessingSummary.ADDITIONAL_FACILITY.split('/')[5];
    const url = `${currentPath}/${urlAdditonalFacility}/${id}`;
    router.push(url);
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

  const handleOpenPopupPaymentFacilityEdit = ({ facilityId, id }: any) => {
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, { id, module: TypeModule.LPS, process: TypeProcess.LPS_CORE });
  };

  const handleOpenPopupPaymentFacilityDetail = (id: number, facilityId: string, bucketProcessId: string) => {
    setFacilityId(facilityId);
    NiceModal.show(MODALPK.DETAIL_FACILITY, { facilityId, hidePK: true, id, isLps: true, processId: bucketProcessId });
  };

  const handleOpenPopUpTableFacilityExisting = () => {
    NiceModal.show(modal.TABLE_PAYMENT_FACILITY_EXISTING, {
      module: TypeModule.LPS,
      process: TypeProcess.LPS_CORE,
    });
  };

  const handleOpenPopUpPaymentFacilityNew = () => {
    setFacilityId('');
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, { module: TypeModule.LPS, process: TypeProcess.LPS_CORE });
  };


  return {
    anomalyRow,
    canAdd,
    contents,
    facilityListData,
    facilityListLoading,
    isBeingProcessed,
    isLegalSigning,
    isNominalMismatch,
    itemPerPage,
    page,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    totalOrder,
    totalOrderPk,
    viewOnly,
  };
};

export default useTableFinancingFacilitySubmit;
