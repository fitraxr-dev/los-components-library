import { useState, useMemo, useEffect, useRef } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useGetRefinaListSubmission from '@/hooks/useGetRefinaListSubmission';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetFinancingFacilityByPipelineId from '@/components/shared/SmiSection/FinancingFacilitySummary/hooks/useGetFinancingFacilityByPipelineId';

import useGetRefinaByPipelineProcessId from '../../hooks/useGetRefinaByProcessId';
import useSaveRefinaPipeline from '../../hooks/useSaveRefinaPipeline';
import useSyncRefina from '../../hooks/useSyncRefina';

import { MODAL_REFINA_DETAIL } from './ModalRefina.constants';
import ModalRefinaDetail from './ModalRefinaDetail';

import type { RefinaHookProps } from './ModalRefina.props';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalRefina = (props: RefinaHookProps) => {
  const { modalId } = props;
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { processId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [filter, setFilter] = useState<Record<string, any>>({});

  // State for client-side pagination
  const [allServerData, setAllServerData] = useState<any[]>([]);
  const [serverTotalItems, setServerTotalItems] = useState(0);
  const [isServerDataLoaded, setIsServerDataLoaded] = useState(false);
  const [hasEverLoadedData, setHasEverLoadedData] = useState(false);

  // Ref to track previous filter state for comparison
  const previousFilterRef = useRef<Record<string, any>>({});

  // Reset filter when modal opens (component mounts)
  useEffect(() => {
    setFilter({});
    setPage(1);
    setSelected([]);
    previousFilterRef.current = {};
  }, []);

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
  });

  const { data: facilityListData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeModule.PIPELINE,
    },
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
  });

  // Parameter list for search and sort
  const { data: searchByOptions } = useGetParameterList('searchByRefinaSubmission');
  const { data: sortByOptions } = useGetParameterList('sortByRefinaSubmission');
  const { data: statusOptions } = useGetParameterList('refinaStatus');

  // Map UI keys to API keys
  const mapSearchKey = (rawKey?: string) => {
    if (!rawKey) return '';
    const k = rawKey.toLowerCase();
    if (k === 'debitur_name') return 'debiturName';
    if (k === 'product') return 'productName';
    if (k === 'project_name') return 'projectName';
    if (k === 'refina_id') return 'refinaId';
    if (k === 'refina_status') return 'refinaStatus';
    if (k === 'rm_name') return 'rmName';
    if (k === 'submission_date') return 'submissionDate';
    return rawKey;
  };

  const SORT_KEY_MAP: Record<string, string> = {
    debitur_name: 'debiturName',
    product: 'productName',
    project_name: 'projectName',
    refina_id: 'refinaId',
    refina_status: 'refinaStatus',
    rm_name: 'rmName',
    submission_date: 'submissionDate',
  };
  const mapSortKey = (rawKey?: string) => {
    if (!rawKey) return '';
    return SORT_KEY_MAP[rawKey.toLowerCase()] ?? rawKey;
  };

  const uiFilter = filter?.filter ?? {};
  const searchDetail = filter?.searchDetail ?? {};

  const finalSort = filter?.sortList
    ? {
      columnName: mapSortKey(filter.sortList.columnName),
      sortType: filter.sortList.sortType ?? 'ASC',
    }
    : { columnName: '', sortType: 'ASC' };

  // Handle search parameters
  const searchKey = mapSearchKey(searchDetail?.key);
  const searchValue = searchDetail?.value ?? '';

  // Handle date filter parameters
  const startDate = uiFilter?.submissionStartDate;
  const endDate = uiFilter?.submissionEndDate;

  // Build payload for API call - fetch ALL data from server (no pagination)
  const payload = {
    limit: 1000, // Get all data from server
    page: 1, // Always get first page from server
    regionName: bucketDetail?.debtorName || '',
    regionType: bucketDetail?.institutionType || '',
    // Only include search parameters if there's actually a search value
    ...(searchKey && searchValue && searchValue.trim() !== '' && { [searchKey]: searchValue }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    sortColumn: finalSort.columnName,
    sortOrder: (finalSort.sortType || 'ASC').toLowerCase(),
    ...(uiFilter?.status && { status: uiFilter.status }),
  };

  const { data, isFetching: isLoading } = useGetRefinaListSubmission(payload);

  // Store server data when it's loaded
  useEffect(() => {
    if (data) {
      const contents = data.contents;
      if (contents && Array.isArray(contents)) {
        setAllServerData(contents);
        setServerTotalItems(contents.length);
        setIsServerDataLoaded(true);
        setHasEverLoadedData(true);

        // Record activity for viewing refina list
        recordActivity({
          activity: ActivityType.VIEW,
          bucketProcessId: processId || '',
          changeAfter: '',
          changeBefore: '',
          menuCode: 'pipeline',
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remarks: 'view refina submission list in modal refina',
        });
      } else {
        setAllServerData([]);
        setServerTotalItems(0);
        setIsServerDataLoaded(true);
        setHasEverLoadedData(true);
      }
    }
  }, [data, processId, recordActivity]);

  // Reset client pagination when server data changes (filter/search changes)
  // But only if there's actually a meaningful change (not just searchBy dropdown change)
  useEffect(() => {
    const currentFilter = {
      endDate: endDate || '',
      searchValue: searchDetail?.value || '',
      sortColumn: finalSort.columnName || '',
      sortType: finalSort.sortType || '',
      startDate: startDate || '',
      status: uiFilter?.status || '',
    };

    const previousFilter = previousFilterRef.current;

    // Check if there's a meaningful change that should trigger a new API call
    const hasSearchValue = currentFilter.searchValue && currentFilter.searchValue.trim() !== '';
    const hasDateFilter = currentFilter.startDate || currentFilter.endDate;
    const hasStatusFilter = currentFilter.status;
    const hasSort = currentFilter.sortColumn;

    // Only reset if there's a meaningful filter change
    const hasMeaningfulChange =
      (hasSearchValue && currentFilter.searchValue !== previousFilter.searchValue) ||
      (hasDateFilter && (
        currentFilter.startDate !== previousFilter.startDate ||
        currentFilter.endDate !== previousFilter.endDate
      )) ||
      (hasStatusFilter && currentFilter.status !== previousFilter.status) ||
      (hasSort && (
        currentFilter.sortColumn !== previousFilter.sortColumn ||
        currentFilter.sortType !== previousFilter.sortType
      ));

    if (hasMeaningfulChange) {
      setPage(1);
    }

    // Update the previous filter reference
    previousFilterRef.current = currentFilter;
  }, [filter, searchDetail?.value, startDate, endDate, uiFilter?.status, finalSort.columnName, finalSort.sortType]);

  const { mutate: syncRefina, isPending: syncIsLoading } = useSyncRefina({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan test ini',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const [lastSavedRefinaPayload, setLastSavedRefinaPayload] = useState<any>(null);

  const { mutate: saveRefinaPipeline, isPending: saveRefinaIsLoading } = useSaveRefinaPipeline({
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.errorDetail;

      showNiceModalV2({
        title: errorMessage || 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Record activity for saving refina pipeline
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          debtor: lastSavedRefinaPayload?.debtor,
          pipeline: lastSavedRefinaPayload?.pipeline,
          refinaId: lastSavedRefinaPayload?.refinaId,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully saved refina pipeline data',
      });

      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  // Client-side pagination logic
  const processedData = useMemo(() => {
    // If data is not loaded yet, return empty
    if (!isServerDataLoaded || !Array.isArray(allServerData)) {
      return {
        contents: [],
        totalItems: 0,
        totalPage: 1,
      };
    }

    // Transform server data
    const transformedData = allServerData.map((debtor) => ({
      ...debtor,
      createdAt: debtor.submissionDate ?? '-',
      debiturName: debtor.debiturName ?? '-',
      product: debtor.productName ?? '-',
      projectName: debtor.projectName ?? '-',
      refinaId: debtor.refinaId ?? '-',
      staffName: debtor.rmName ?? '-',
      statusLabel: debtor.refinaStatus ?? '-',
    }));

    // Apply client-side pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = transformedData.slice(startIndex, endIndex);

    return {
      contents: paginatedData,
      totalItems: transformedData.length,
      totalPage: Math.ceil(transformedData.length / pageSize),
    };
  }, [allServerData, page, pageSize, isServerDataLoaded]);

  const listMasterDebtor = processedData.contents;
  const totalPage = processedData.totalPage;

  const tableHeader: TableHeader[] = [
    {
      isDisabled: (data) => selected.some((el) => el.refinaId !== data.refinaId),
      isSelected: (data) => selected.some((el) => el.refinaId === data.refinaId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.refinaId === data.refinaId)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debiturName',
      label: 'Nama Customer',
    },
    {
      key: 'refinaId',
      label: 'ID Pengajuan Refina',
    },
    {
      key: 'product',
      label: 'Produk',
    },
    {
      key: 'projectName',
      label: 'Nama Proyek',
    },
    {
      key: 'staffName',
      label: 'Nama RM',
    },
    {
      key: 'createdAt',
      label: 'Tanggal Pengajuan',
    },
    {
      key: 'statusLabel',
      label: 'Status Refina',
      sx: {
        minWidth: '9vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleOpenDetail(parseInt(data.refinaId)),
        },
      ],
      type: 'action',
    },
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Bedasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'submissionEndDate',
      key: 'submissionDate',
      label: 'Tanggal Pengajuan',
      startKey: 'submissionStartDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status Refina',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
    },
  ];

  const handleSaveRefina = () => {
    if (facilityListData?.contents.length > 0) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit() {
          const payload = {
            bucketProcessId: processId,
            debtor: {
              debtorId: debtorId,
              debtorName: bucketDetail?.debtorName || '',
              debtorRating: null,
              debtorType: '',
              gamId: bucketDetail?.gamId || 0,
              group: bucketDetail?.groupId || '',
              groupName: bucketDetail?.groupName || '',
              institutionType: bucketDetail?.institutionType || '',
              isGroup: true,
              isRelatedToSmi: null,
              npwp: bucketDetail?.npwp || null,
            },
            newDebtor: bucketDetail?.isNewClient || true,
            pipeline: {
              analystId: bucketDetail?.analystId || null,
              dataSource: bucketDetail?.dataSource || null,
              financeType: bucketDetail?.financeType || null,
              groupId: bucketDetail?.groupId || '',
              remarks: bucketDetail?.remarks || null,
              typeProcess: bucketDetail?.typeProcess || null,
            },
            refinaId: parseInt(selected[0].refinaId),
          };
          setLastSavedRefinaPayload(payload);
          saveRefinaPipeline(payload);
        },
        submitText: 'Ya',
        title: 'Data Fasilitas Pembiayaan Anda akan digantikan dengan data dari Refina, apakah Anda yakin akan melanjutkan?',
        type: 'warning',
      });
    } else {
      const payload = {
        bucketProcessId: processId,
        debtor: {
          debtorId: debtorId,
          debtorName: bucketDetail?.debtorName || '',
          debtorRating: null,
          debtorType: '',
          gamId: bucketDetail?.gamId || 0,
          group: bucketDetail?.groupId || '',
          groupName: bucketDetail?.groupName || '',
          institutionType: bucketDetail?.institutionType || '',
          isGroup: true,
          isRelatedToSmi: null,
          npwp: null,
        },
        newDebtor: bucketDetail?.isNewClient,
        pipeline: {
          analystId: bucketDetail?.analystId || null,
          dataSource: bucketDetail?.dataSource || null,
          financeType: bucketDetail?.financeType || null,
          groupId: bucketDetail?.groupId || '',
          remarks: bucketDetail?.remarks || null,
          typeProcess: bucketDetail?.typeProcess || null,
        },
        refinaId: parseInt(selected[0].refinaId),
      };
      setLastSavedRefinaPayload(payload);
      saveRefinaPipeline(payload);
    }
    closeNiceModal(modalId);
  };

  const handleOpenDetail = (refinaId: number) => {
    // Record activity for viewing refina detail
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `view refina detail (refinaId: ${refinaId})`,
    });

    NiceModal.show(MODAL_REFINA_DETAIL, { refinaId });
  };

  return {
    filter,
    filterContentList,
    filterDropdownList: searchByOptions || [],
    handleSaveRefina,
    isLoading: isLoading || saveRefinaIsLoading,
    listMasterDebtor,
    page,
    pageSize,
    selected,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
