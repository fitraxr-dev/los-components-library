'use client';
import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { accessid, loanProcessingSummary } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteSyariahFacility from '@/components/shared/SmiSection/PK/hooks/useDeleteSyariahFacility';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';
import useGetListSyariahFacility from '@/components/shared/SmiSection/PK/hooks/useGetListSyariahFacility';

import { TABLE_HEADER_LIST } from './TableShariaLimit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableShariaLimit = ({ module, process }: SmiComponentProps) => {

  const { setFacilityId, processId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const router = useRouter();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [contents, setContents] = useState([{}]);

  const canEditDataSyariah = useCheckAccess(accessid.LPS_CORE_UPDATE);

  const { data: facilityListData, isLoading: facilityListLoading } = useGetListSyariahFacility({
    filter: {
      bucketProcessId: processId,
      module: module,
      process: process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });

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

  const { data: allFacilityListDataX } = useGetListFinancingPk(
    {
      filter: {
        bucketProcessId: processId,
        module,
        process,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
    },
    {
      bucketProcessId: parentId,
    },
    undefined,
    undefined,
    0
  );

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  const allFacilityListData = useMemo(() => {
    return allFacilityListDataX
      ?.filter((res) => res !== undefined)
      ?.filter((res) => res?.pkName !== null);
  }, [allFacilityListDataX]);

  const { data: detailData } = useGetBucketById({
    bucketProcessId: processId, module, process,
  });

  const { data: validateResult } = useGetValidateResult({
    debtorId: detailData?.debtorId,
  }, {
    enabled: !!detailData?.debtorId,
  });

  const isBeingProcessed = validateResult?.content?.isAlertFacilityShow ?? false;

  const { mutate: deleteFinancingFacility } = useDeleteSyariahFacility({
    onSuccess: () => showNiceModal('success', 'Limit induk syariah berhasil dihapus'),
  });

  useEffect(() => {
    setContents(
      facilityListData?.contents.map((data) => ({
        cif: data.cifGroup,
        currency: data.currencyOrderValue || '',
        facilityId: data.facilityId,
        frekuensiReview: data.reviewFrequency,
        id: data.parentSyariahLimitId,
        idFacility: data.idFacility,
        maximalPenggunaan: data.plafondCash?.toLocaleString() || '0',
        orderValue: `IDR ${formatNumberWithCommas(data?.totalOrderValue || 0)}`,
        tanggalBerlaku: data.activationDate,
      })) || []
    );
  }, [facilityListData]);

  const handleNavigateToParentChildLimit = ({ facilityId, id, isDetail = false }: any) => {
    setFacilityId(facilityId);

    const basePath = loanProcessingSummary.FACILITY_PARENT_CHILD_LIMIT.replace('[processId]', String(processId));

    const queryParams = new URLSearchParams({
      fromLimitInduk: 'true',
      lpsMode: 'true',
      parentSyariahLimitId: id,
    });

    if (isDetail || isBeingProcessed) {
      queryParams.append('viewOnly', 'true');

    }


    let listFacility: any[] = [];
    if (viewOnly) {
      const facilityhasUsed = facilityListData?.contents.flatMap((item: any) =>
        item.parentSyariahLimitId === id ? item.facilityId : []
      ) || [];
      for (const facility of facilityhasUsed) {
        if (!listFacility.includes(facility)) {
          listFacility.push(facility);
        }
      }
    } else {
      const matchedSyariah = facilitySyariahListData?.contents?.find((item: any) =>
        item.parentSyariahLimitId === id
      );

      const facilityIdsFromMatched = matchedSyariah?.facilityId || [];

      const allUsedFacilityIds = facilitySyariahListData?.contents?.reduce((acc: string[], item: any) => {
        if (item.facilityId && Array.isArray(item.facilityId)) {
          return [...acc, ...item.facilityId];
        }
        return acc;
      }, []) || [];

      const availableFacilityIds = allFacilityListData
        ?.filter((item) => item.facilityId && !allUsedFacilityIds.includes(item.facilityId))
        ?.map((item) => item.facilityId) || [];

      listFacility = Array.from(new Set([...facilityIdsFromMatched, ...availableFacilityIds]));
    }

    localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));

    router.push(`${basePath}?${queryParams.toString()}`);
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

  const getTableAction = () => {
    if (viewOnly) {
      return [
        {
          iconName: 'detail',
          onClick: ({ id }) =>
            handleNavigateToParentChildLimit({ id, isDetail: true }),
        },
      ];
    }

    const actions = [];

    actions.push({
      iconName: 'detail',
      isHidden: () => !isBeingProcessed && (process === TypeProcess.LPS_CORE ? canEditDataSyariah : true),
      onClick: ({ id }) => handleNavigateToParentChildLimit({ id, isDetail: true }),
    });

    if (process === TypeProcess.LPS_CORE) {
      if (canEditDataSyariah) {
        actions.push({
          iconName: 'edit',
          isHidden: () => isBeingProcessed,
          onClick: ({ facilityId, id }) => handleNavigateToParentChildLimit({ facilityId, id, isDetail: false }),
        });
      }
    } else {
      actions.push({
        iconName: 'edit',
        isHidden: () => isBeingProcessed,
        onClick: ({ facilityId, id }) => handleNavigateToParentChildLimit({ facilityId, id, isDetail: false }),
      });
    }

    actions.push({
      iconName: 'delete',
      isHidden: () => isBeingProcessed,
      onClick: ({ id }) => handleDeleteFinancingFacility({ id }),
    });

    return actions;
  };

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST,
    {
      key: 'action',
      label: 'Action',
      options: getTableAction(),
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

  useEffect(() => {
    localStorage.removeItem('facilityhasUsed');
  }, []);

  const popupSelectorHandler = () => {
    const usedFacilityIds = facilitySyariahListData?.contents?.flatMap((item: any) => item.facilityId) || [];
    const facilityhasUsedArr = allFacilityListData?.map((item) => item.facilityId).filter(Boolean) || [];
    let listFacility = [];
    for (const facilityId of facilityhasUsedArr) {
      if (!listFacility.includes(facilityId) && !usedFacilityIds.includes(facilityId)) {
        listFacility.push(facilityId);
      }
    }
    localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));

    router.push(loanProcessingSummary.FACILITY_PARENT_CHILD_LIMIT.replace('[processId]', String(processId)) + '?lpsMode=true&createNewLps=true&fromLimitInduk=true');
  };

  return {
    anomalyRow,
    contents,
    facilityListData,
    facilityListLoading,
    isBeingProcessed,
    popupSelectorHandler,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    viewOnly,
  };
};

export default useTableShariaLimit;
