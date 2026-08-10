'use client';
import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import useDeleteSyariahFacility from '../../hooks/useDeleteSyariahFacility';
import useGetListSyariahFacility from '../../hooks/useGetListSyariahFacility';

import { TABLE_HEADER_LIST } from './TableShariaLimit.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableShariaLimit = (
  { module, process, isPK, isBeingProcessed }: { isBeingProcessed?: boolean } & SmiComponentProps) => {

  const isLegalSigning = process === TypeProcess.LEGAL_SIGNING;
  const { setFacilityId, processId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const pathname = usePathname();
  const theme = useTheme();
  const router = useRouter();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [contents, setContents] = useState([{}]);

  const canEditDataSyariah = useCheckAccess(accessid.PENGAJUAN_PERIKATAN_BUCKET_LIST_UPDATE);

  const { data: facilityListData, isLoading: facilityListLoading } = useGetListSyariahFacility({
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

  const { data: getFacilityUsed } = useGetListSyariahFacility({
    filter: {
      bucketProcessId: isLegalSigning ? parentId : processId,
      module: module,
      process: isLegalSigning ? TypeProcess.ENGAGEMENT_AGREEMENT : process,
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
  });

  const { mutate: deleteFinancingFacility } = useDeleteSyariahFacility({
    onSuccess: () => showNiceModal('success', 'Limit induk syariah berhasil dihapus'),
  });

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

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

  const handleNavigateToParentChildLimit = ({ facilityId, id, idFacility, isDetail = false }: any) => {
    setFacilityId(facilityId);
    const effectiveProcessId = isLegalSigning ? parentId : processId;
    const basePath =
      '/loan-processing/engagement-submission/bucket-list/' + effectiveProcessId;

    let url: any;
    if (isPK || isDetail || isLegalSigning) {
      url = `${basePath}/facility-overview/parent-child-limit?` +
          `parentSyariahLimitId=${id}&fromLimitInduk=true`;
    } else {
      url = `${basePath}/facility-overview/parent-child-limit?` +
          `facilityId=${facilityId}&` +
          `id=${id}&` +
          `financingFacilityId=${idFacility}&fromLimitInduk=true`;
    }

    if (isDetail) {
      url += '&viewOnly=true';
    }

    if (isLegalSigning) {
      url += '&isLegalSigning=true';
    }

    let listFacility = [];
    let facilityhasUsed = [];
    if (isPK && !viewOnly) {
      facilityhasUsed = getFacilityUsed?.contents.filter((item) => item.parentSyariahLimitId !== id)
        .map((item) => item.facilityId).flat();
    } else if (isLegalSigning || (isPK && viewOnly)) {
      facilityhasUsed = getFacilityUsed?.contents.filter((item) => item.parentSyariahLimitId === id)
        .map((item) => item.facilityId).flat();
    }
    for (let i = 0; i < facilityhasUsed.length; i++) {
      if (!listFacility.includes(facilityhasUsed[i])) {
        listFacility.push(facilityhasUsed[i]);
      }
    }

    localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));

    const finalUrl = isPK ? url : setPreviewPage(url, pathname);

    router.push(finalUrl);
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
    if (viewOnly || process === TypeProcess.LEGAL_SIGNING || isBeingProcessed) {
      return [
        {
          iconName: 'detail',
          onClick: ({ facilityId, id, idFacility }) =>
            handleNavigateToParentChildLimit({ id, isDetail: true }),
        },
      ];
    }

    const actions = [];

    if (process === TypeProcess.ENGAGEMENT_AGREEMENT) {
      if (canEditDataSyariah) {
        actions.push({ iconName: 'edit', onClick: ({ facilityId, id, idFacility }) => handleNavigateToParentChildLimit({ facilityId, id, idFacility, isDetail: false }) });
      } else {
        actions.push({ iconName: 'detail', onClick: ({ facilityId, id, idFacility }) => handleNavigateToParentChildLimit({ id, isDetail: true }) });
      }
    } else {
      actions.push({ iconName: 'edit', onClick: ({ facilityId, id, idFacility }) => handleNavigateToParentChildLimit({ facilityId, id, idFacility, isDetail: false }) });
    }

    actions.push({ iconName: 'delete', onClick: ({ id }) => handleDeleteFinancingFacility({ id }) });

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
    if (isPK) {
      const facilityhasUsed = getFacilityUsed?.contents.map((item) => item.facilityId).flat();
      let listFacility = [];
      for (let i = 0; i < facilityhasUsed.length; i++) {
        if (!listFacility.includes(facilityhasUsed[i])) {
          listFacility.push(facilityhasUsed[i]);
        }
      }
      localStorage.setItem('facilityhasUsed', JSON.stringify(listFacility));
    }
    router.push('/loan-processing/engagement-submission/bucket-list/' + processId + '/facility-overview/parent-child-limit?fromLimitInduk=true');
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
    tableHeader,
    theme,
    viewOnly,
  };
};

export default useTableShariaLimit;
