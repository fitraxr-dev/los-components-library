import { useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useCheckSyncRefinaStatus from '../shared/hooks/useCheckSyncRefinaStatus';
import useGetSiteVisitHistory from '../shared/hooks/useGetSiteVisitHistory';
import useSaveClearanceVisitSelected from '../shared/hooks/useSaveClearanceVisitSelected';
import useSaveSiteVisitSelected from '../shared/hooks/useSaveSiteVisitSelected';
import useSiteVisitContext from '../shared/hooks/useSiteVisitContext';
import useSyncVisitRefina from '../shared/hooks/useSyncVisitRefina';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useDataSiteVisit = () => {
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const goToNextStep = useGoToNextStep();
  const { debtorId, processId } = useIdentity();
  const { updateState, siteVisitDetail } = useSiteVisitContext();

  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useSessionStorage('filter-component-sitevisit-history', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isSyncRefina, setIsSyncRefina] = useState(false);

  const { data: debtorInfoDataMaster } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoDataMaster?.institutionType);

  const { data: detailMasterDebtor } = useGetDetailMasterDebtor(
    { debtorId: debtorInfoDataMaster?.debtorId },
    { enabled: !!debtorInfoDataMaster }
  );

  const {
    data: siteVisitHistoryList,
    isFetching: isLoading,
    refetch: refetchSiteVisitHistory,
  } = useGetSiteVisitHistory({
    filter: {
      ...filter?.filter,
      bucketProcessId: processId,
      debtorId: debtorId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: !!processId && !!debtorId,
  });

  const tablePage = siteVisitHistoryList?.data?.page;
  const tableDataHistory = siteVisitHistoryList?.data?.contents?.map((data) => ({
    ...data,
    siteVisitLocation: `${data?.province ?? '-'}, ${data?.city ?? '-'}, ${data?.district ?? '-'}, ${data?.subdistrict ?? '-'}`,
  }));

  useEffect(() => {
    const tempArray = [];
    tableDataHistory?.forEach((item) => {
      if (item?.isSelect === 1) {
        tempArray?.push(item);
      }
    });
    setSelected(tempArray);
  }, [JSON.stringify(tableDataHistory)]);

  const { mutate: saveSelectedVisitHistory } = useSaveSiteVisitSelected({
    onError() {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [
          'bucket-stepper',
          {
            bucketProcessId: processId,
            module: TypeModule.SITE_VISIT,
            process: TypeProcess.SITE_VISIT,
          }
        ],
      });

      showNiceModalV2({ type: 'success' });
    },
  });

  const { mutate: saveClearanceVisitHistory } = useSaveClearanceVisitSelected({
    onError() {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess() {
      showNiceModalV2({ type: 'success' });
    },
  });

  const { data: dataVisitCode, isFetching } = useSyncVisitRefina({
    bucketMasterId: debtorInfoDataMaster?.bucketMaster,
    bucketProcessId: processId,
    debtorId: debtorInfoDataMaster?.debtorId,
    debtorName: debtorInfoDataMaster?.debtorName,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
    refinaId: detailMasterDebtor?.refinaId ?? '',
  }, isSyncRefina);

  const { data: statusRefina } = useCheckSyncRefinaStatus({
    visitCode: dataVisitCode,
  }, dataVisitCode && !isFetching);

  // Single useEffect to handle sync completion and data refresh
  useEffect(() => {
    if (dataVisitCode && !isFetching) {
      console.log('Sync initiated with visit code:', dataVisitCode);
    }
  }, [dataVisitCode, isFetching]);

  useEffect(() => {
    if (statusRefina?.status?.toLowerCase() === 'completed') {
      // Invalidate all site visit history queries
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ['site-visit-history'],
      });
      // Add a small delay to ensure the API has processed the sync
      setTimeout(() => {
        refetchSiteVisitHistory().then(() => {
          // Only stop loading after data is successfully refetched
          setIsSyncRefina(false);
        }).catch(() => {
          // If refetch fails, still stop loading to prevent infinite loading
          setIsSyncRefina(false);
        });
      }, 1000);
    } else if (statusRefina?.status?.toLowerCase() === 'failed') {
      setIsSyncRefina(false);
    }
  }, [statusRefina?.status, queryClient, refetchSiteVisitHistory]);


  const nonPemdaHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.6vw' },
      type: 'index',
    },
    {
      key: 'visitCode',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'startDate',
      label: 'Actual Start Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'endDate',
      label: 'Actual End Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'reportDate',
      label: 'Tanggal Dokumen',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'siteVisitLocation',
      label: 'Lokasi Site Visit',
      sx: { minWidth: '10vw' },
    },
  ];

  const pemdaHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.6vw' },
      type: 'index',
    },
    {
      key: 'facilityNumber',
      label: 'Nomor Fasilitas',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'project',
      label: 'Proyek',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'creator',
      label: 'Creator',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'startDate',
      label: 'Actual Start Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'endDate',
      label: 'Actual End Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'siteVisitLocation',
      label: 'Lokasi Site Visit',
      sx: { minWidth: '10vw' },
    },
  ];

  const siteVisitHistoryHeader: TableHeader[] = [
    {
      isDisabled: () => viewOnly || isLoading,
      isSelected: (data) => selected.some((el) => el.visitCode === data.visitCode),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.visitCode === data.visitCode)) {
          const unselect = selected.filter((el) => el.visitCode !== data.visitCode);
          setSelected(unselect);
        } else {
          setSelected([data, ...selected]);
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox',
    },
    ...(isPemda ? pemdaHeader : nonPemdaHeader),
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            updateState({
              siteVisitDetail: {
                bucketId: debtorInfoDataMaster?.bucketProcessId,
                id: data.id,
                isFromHistory: true,
                masterDebtor: debtorInfoDataMaster,
                visitCode: data.visitCode,
              },
            });
          },
        },
      ],
      sx: { minWidth: '4vw' },
      type: 'action',
    },
  ];

  const handleSaveSiteVisitHistory = ({ shouldGoToNext = false }: { shouldGoToNext?: boolean }) => {
    const historySiteVisit = selected.map((item) => ({
      bucketMasterId: debtorInfoDataMaster?.bucketMaster,
      bucketProcessId: processId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      refinaId: item?.refinaId,
      visitCode: item?.visitCode,
    }));

    if (historySiteVisit?.length) {
      saveSelectedVisitHistory(historySiteVisit, {
        onSuccess: () => shouldGoToNext ? goToNextStep() : undefined,
      });
    } else {
      saveClearanceVisitHistory({
        bucketProcessId: processId,
        module: TypeModule.SITE_VISIT,
        process: TypeProcess.SITE_VISIT,
      }, {
        onSuccess: () => shouldGoToNext ? goToNextStep() : undefined,
      });
    }
  };

  useMemo(() => {
    updateState({ siteVisitDetail: undefined });
  }, []);

  const handleSyncRefina = async () => {
    setIsSyncRefina(true);
  };

  const anomalyRow = (val: any) => {
    if (val.visitCode === siteVisitDetail?.visitCode)
      return { bgcolor: 'rgba(87, 235, 87, 0.2)' };
  };

  const isLoadingSyncRefina = isSyncRefina || isFetching ||
    (
      statusRefina?.status?.toLowerCase() !== 'completed' &&
      statusRefina?.status?.toLowerCase() !== 'failed' &&
      Boolean(dataVisitCode)
    );

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const historySiteVisit = selected.map((item) => ({
      bucketMasterId: debtorInfoDataMaster?.bucketMaster,
      bucketProcessId: processId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      refinaId: item?.refinaId,
      visitCode: item?.visitCode,
    }));

    if (historySiteVisit?.length > 0) {
      return Promise.resolve(historySiteVisit);
    } else {
      return Promise.resolve({
        bucketProcessId: processId,
        module: TypeModule.SITE_VISIT,
        process: TypeProcess.SITE_VISIT,
      });
    }
  }, [selected, debtorInfoDataMaster, processId]);

  const autoSaveUrl = useMemo(() => {
    const historySiteVisit = selected.map((item) => ({
      bucketMasterId: debtorInfoDataMaster?.bucketMaster,
      bucketProcessId: processId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      refinaId: item?.refinaId,
      visitCode: item?.visitCode,
    }));

    return historySiteVisit?.length > 0
      ? 'siteVisit.siteVisit.saveSelect'
      : 'siteVisit.siteVisit.saveClearance';
  }, [selected, debtorInfoDataMaster, processId]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !!processId && !!debtorId && !!debtorInfoDataMaster,
    payload: autoSavePayload,
    url: autoSaveUrl,
  });

  return {
    anomalyRow,
    handleSaveSiteVisitHistory,
    handleSyncRefina,
    isAutoSaveFetching,
    isFetching,
    isLoading,
    isLoadingSyncRefina,
    isPemda,
    page,
    setFilter,
    setPage,
    setPageSize,
    siteVisitHistoryHeader,
    tableDataHistory,
    tablePage,
  };
};
