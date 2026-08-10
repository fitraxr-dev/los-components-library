import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';


import {
  BUSINESS_DIVISION,
  roles,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DPOP_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { SyncfusionFormatGenerate } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useGenerateDraftMemo from '@/hooks/services/useGenerateDraftMemo';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import CheckboxSelectAll from '@/components/shared/CheckboxSelectAll';
import TextStyle from '@/components/shared/TextStyle';


import { TABLE_HEADER } from './DocumentChecklist.constants';
import useSaveDocumentChecklist from './hooks/useSaveDocumentChecklist';

import type { DocumentChecklistProps } from './DocumentChecklist.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { DocumentCreationResponseDto } from '@/services/openapi/bucket-service';


const useDocumentChecklist = (props: DocumentChecklistProps) => {
  const { onSelectedChecked } = props;
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [selectedMap, setSelectedMap] = useState<Map<number, any>>(new Map());
  const [isResetting, setIsResetting] = useState(true);
  const selected = useMemo(() => Array.from(selectedMap.values()), [selectedMap]);
  const [{ currentRole }] = useApp();
  const { divisionCode } = useDivision();
  const path = usePathname();
  const goToNextStep = useGoToNextStep();
  const isRecordingRef = useRef(false);
  const { recordActivity } = useRecordLog();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[2];
  const isCore = moduleIndex?.toLowerCase() === 'core';
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isSuperAdmin = isMaker || isChecker;
  const memoKey = `${props.module}-${props.process}-filter-digital-memo`;
  const [memoFilter, setMemoFilter] = useSessionStorage(memoKey, null);
  const [memoDocumentGroup, setMemoDocumentGroup] =
    useState<string[] | undefined>(undefined);
  const isDpopDivision = divisionCode.includes(DPOP_DIVISION);
  const financingKey = `${props.module}-${props.process}-filter-financing`;
  const [financingFilter, setFinancingFilter] = useSessionStorage(financingKey, null);
  const [financingDocumentGroup, setFinancingDocumentGroup] =
    useState<string[] | undefined>(undefined);

  const supportingKey = `${props.module}-${props.process}-filter-supporting`;
  const [supportingFilter, setSupportingFilter] = useSessionStorage(supportingKey, null);
  const [supportingDocumentGroup, setSupportingDocumentGroup] =
    useState<string[] | undefined>(undefined);

  const [memoPage, setMemoPage] = useState(1);
  const [memoItemPerPage, setMemoItemPerPage] = useState(5);
  const [financingPage, setFinancingPage] = useState(1);
  const [financingItemPerPage, setFinancingItemPerPage] = useState(5);
  const [supportingPage, setSupportingPage] = useState(1);
  const [supportingItemPerPage, setSupportingItemPerPage] = useState(5);
  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isDivisiBisnis = divisiBisnisArray?.includes(divisionCode);

  const { data: searchByOptions } = useGetParameterList('searchByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: detailData } = useGetBucketById({
    bucketProcessId: processId, module: props.module, process: props.process,
  });

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: props.module,
    process: props.process,
  });

  const debtorName = debtorInfoData?.debtorName;
  const isCompleted = detailData?.statusLabel?.toLowerCase() === 'new los completed';

  const { data: memoDocumentGroupData } = useGetParameterDocumentGroup({
    filter: {
      documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.DIGITALMEMO,
    },
    page: { itemPerPage: 100, noPage: 1 },
    searchDetail: { key: 'documentTypeName', value: '' },
  });

  const { data: financingDocumentGroupData } = useGetParameterDocumentGroup({
    filter: {
      documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
    },
    page: { itemPerPage: 100, noPage: 1 },
    searchDetail: { key: 'documentTypeName', value: '' },
  });

  const { data: supportingDocumentGroupData } = useGetParameterDocumentGroup({
    filter: {
      documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT,
    },
    page: { itemPerPage: 100, noPage: 1 },
    searchDetail: { key: 'documentTypeName', value: '' },
  });

  useMemo(() => {
    if (memoFilter?.filter?.documentGroup) {
      setMemoDocumentGroup(memoFilter?.filter?.documentGroup);
    }
  }, [memoFilter?.filter?.documentGroup]);

  const { data: memoDocumentTypeData } = useGetParameterDocumentType(
    {
      filter: { documentGroupCode: memoDocumentGroup?.join('|') },
      page: { itemPerPage: 100, noPage: 1 },
      searchDetail: { key: 'documentGroupName', value: '' },
    },
    { enabled: !!memoDocumentGroup },
  );

  useMemo(() => {
    if (financingFilter?.filter?.documentGroup) {
      setFinancingDocumentGroup(financingFilter?.filter?.documentGroup);
    }
  }, [financingFilter?.filter?.documentGroup]);

  const { data: financingDocumentTypeData } = useGetParameterDocumentType(
    {
      filter: { documentGroupCode: financingDocumentGroup?.join('|') },
      page: { itemPerPage: 100, noPage: 1 },
      searchDetail: { key: 'documentGroupName', value: '' },
    },
    { enabled: !!financingDocumentGroup },
  );

  useMemo(() => {
    if (supportingFilter?.filter?.documentGroup) {
      setSupportingDocumentGroup(supportingFilter?.filter?.documentGroup);
    }
  }, [supportingFilter?.filter?.documentGroup]);

  const { data: supportingDocumentTypeData } = useGetParameterDocumentType(
    {
      filter: { documentGroupCode: supportingDocumentGroup?.join('|') },
      page: { itemPerPage: 100, noPage: 1 },
      searchDetail: { key: 'documentGroupName', value: '' },
    },
    { enabled: !!supportingDocumentGroup },
  );

  const memoDataGroups = useMemo(() => {
    return memoDocumentGroupData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [memoDocumentGroupData]);

  const memoDataTypes = useMemo(() => {
    return memoDocumentTypeData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [memoDocumentTypeData]);

  const financingDataGroups = useMemo(() => {
    return financingDocumentGroupData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [financingDocumentGroupData]);

  const financingDataTypes = useMemo(() => {
    return financingDocumentTypeData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [financingDocumentTypeData]);

  const supportingDataGroups = useMemo(() => {
    return supportingDocumentGroupData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [supportingDocumentGroupData]);

  const supportingDataTypes = useMemo(() => {
    return supportingDocumentTypeData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [supportingDocumentTypeData]);

  const memoFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'uploadedEndDate',
      key: 'modifiedDate',
      label: 'Tanggal Dokumen',
      startKey: 'uploadedStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'documentGroup',
      label: 'Group Dokumen',
      options: memoDataGroups ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => { setMemoDocumentGroup(value); },
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: memoDataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const financingFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'uploadedEndDate',
      key: 'modifiedDate',
      label: 'Tanggal Dokumen',
      startKey: 'uploadedStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'documentGroup',
      label: 'Group Dokumen',
      options: financingDataGroups ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => { setFinancingDocumentGroup(value); },
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: financingDataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const supportingFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'uploadedEndDate',
      key: 'modifiedDate',
      label: 'Tanggal Dokumen',
      startKey: 'uploadedStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'documentGroup',
      label: 'Group Dokumen',
      options: supportingDataGroups ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => { setSupportingDocumentGroup(value); },
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: supportingDataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const checkBtnHideGenerateBast = () => {
    const array = [{
      buttons: [{
        color: 'info',
        disabled: viewOnly,
        label: 'Generate BAST',
        onClick: handleOpenGenerateDraftModal,
        variant: 'contained',
      }],
      isHideAddNew: false,
      role: roles.TL,
    },
    {
      buttons: [{
        color: 'info',
        disabled: viewOnly,
        label: 'Generate BAST',
        onClick: handleOpenGenerateDraftModal,
        variant: 'contained',
      }],
      isHideAddNew: false,
      role: roles.KADIV,
    },
    {
      buttons: [{
        color: 'info',
        disabled: viewOnly,
        label: 'Generate BAST',
        onClick: handleOpenGenerateDraftModal,
        variant: 'contained',
      }],
      isHideAddNew: false,
      role: roles.RM,
    },
    {
      buttons: [{
        color: 'info',
        disabled: viewOnly,
        label: 'Generate BAST',
        onClick: handleOpenGenerateDraftModal,
        variant: 'contained',
      }],
      isHideAddNew: false,
      role: roles.MAKER,
    },
    {
      buttons: [{
        color: 'info',
        disabled: viewOnly,
        label: 'Generate BAST',
        onClick: handleOpenGenerateDraftModal,
        variant: 'contained',
      }],
      isHideAddNew: false,
      role: roles.CHECKER,
    },
    ];

    const button = (isSuperAdmin || isDivisiBisnis) ? array.find((item) =>
      currentRole?.includes(item.role))?.buttons : [];
    const isHideAddNew = (isSuperAdmin || isDivisiBisnis) ? array.find((item) =>
      currentRole?.includes(item.role))?.isHideAddNew : true;

    return {
      button,
      isHideAddNew,
    };
  };

  const { data: digitalMemoData,
    isLoading: isLoadingMemo,
    refetch: refetchMemo,
  } = useGetDocumentList({
    filter: {
      ...memoFilter?.filter,
      bucketProcessId: String(props.id) ?? String(processId),
      debtorName: debtorName,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DIGITALMEMO,
    },
    page: {
      itemPerPage: memoItemPerPage,
      noPage: memoPage,
    },
    searchDetail: memoFilter?.searchDetail ?? { key: '', value: '' },
    sortList: memoFilter?.sortList ?? undefined,
  });


  const {
    data: financingData,
    isLoading: isLoadingFinancing,
    refetch: refetchFinancing,
  } = useGetDocumentList({
    filter: {
      ...financingFilter?.filter,
      bucketProcessId: String(props.id) ?? String(processId),
      debtorName: debtorName,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
    },
    page: {
      itemPerPage: financingItemPerPage,
      noPage: financingPage,
    },
    searchDetail: financingFilter?.searchDetail ?? { key: '', value: '' },
    sortList: financingFilter?.sortList ?? undefined,
  });

  const {
    data: supportingData,
    isLoading: isLoadingSupporting,
    refetch: refetchSupport,
  } = useGetDocumentList({
    filter: {
      ...supportingFilter?.filter,
      bucketProcessId: String(props.id) ?? String(processId),
      debtorName: debtorName,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
    },
    page: {
      itemPerPage: supportingItemPerPage,
      noPage: supportingPage,
    },
    searchDetail: supportingFilter?.searchDetail ?? { key: '', value: '' },
    sortList: supportingFilter?.sortList ?? undefined,
  });

  const handleRefetch = async () => {
    await refetchFinancing();
    await refetchMemo();
    await refetchSupport();
  };

  /**
   * Clears local state and purges React Query cache to force fresh data from server.
   * This ensures multi-page checkbox state stays in sync with actual server values.
   */
  const handleResetFromServer = async () => {
    setIsResetting(true);

    try {
      setSelectedMap(new Map());

      queryClient.removeQueries({
        queryKey: ['documents'],
      });

      const [memoResult, financingResult, supportingResult] = await Promise.all([
        refetchMemo(),
        refetchFinancing(),
        refetchSupport(),
      ]);

      const freshItems = [
        ...(memoResult.data?.contents ?? []),
        ...(financingResult.data?.contents ?? []),
        ...(supportingResult.data?.contents ?? []),
      ];

      const freshMap = new Map<number, any>();
      freshItems.forEach((item) => {
        freshMap.set(item.id, {
          ...item,
          documentDate: item.documentDate
            ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY')
            : '-',
          isChecked: item.isCheckedByCurrentProcess || false,
        });
      });
      setSelectedMap(freshMap);
    } finally {
      setIsResetting(false);
    }
  };

  const { mutate: saveDocumentChecklist, isPending: isSaveLoading } = useSaveDocumentChecklist({
    onError: () => { /* handled per-call in handleSave */ },
    onSuccess: () => { /* handled per-call in handleSave */ },
  });

  const { mutate: generateDraftMemo } = useGenerateDraftMemo(
    {
      onError: (data) => {
        const title = `${data.response.data.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
        showNiceModalV2({ title, type: 'error' });
      },
      onSuccess: () => {
        showNiceModalV2({
          cancelText: 'Tutup',
          submitText: 'OK',
          title: 'Mohon Tunggu, Dokumen Sedang di Proses Maksimal 5 Menit',
          type: 'warning',
        });
      },
    }
  );

  useEffect(() => {
    handleResetFromServer();
  }, []);

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        module: props.module,
        process: props.process,
        remarks: `View Document Checklist LPS ${props.lpsType?.toUpperCase() ?? ''}`,
      });
    }

  }, [processId]);

  const digitalMemoList = useMemo(() => (digitalMemoData?.contents ?? []).map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
  })), [digitalMemoData]);

  const financingList = useMemo(() => (financingData?.contents ?? []).map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
  })), [financingData]);

  const supportingList = useMemo(() => (supportingData?.contents ?? []).map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
  })), [supportingData]);

  useEffect(() => {

    const newItems = [...digitalMemoList, ...financingList, ...supportingList];
    if (!newItems.length) return;

    setSelectedMap((prev) => {
      const next = new Map(prev);
      newItems.forEach((newItem) => {
        if (!next.has(newItem.id)) {
          // New item found: fallback to server state
          next.set(newItem.id, {
            ...newItem,
            isChecked: newItem.isCheckedByCurrentProcess || false,
          });
        } else {
          // Known item: preserve current local state
          const existing = next.get(newItem.id);
          next.set(newItem.id, {
            ...newItem,
            isChecked: existing.isChecked,
          });
        }
      });
      return next;
    });
  }, [digitalMemoList, financingList, supportingList]);

  useEffect(() => {
    const isAnyChecked = selected.some((item) => item.isChecked);
    onSelectedChecked && onSelectedChecked(isAnyChecked);

    const isDirty = selected.some((item) => !!item.isChecked !== !!item.isCheckedByCurrentProcess);
    if (isDirty && !viewOnly) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [selected, onSelectedChecked, viewOnly, setDirtyMsg]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    if (!selected?.length) {
      return Promise.resolve(null);
    }

    const formatSelected = selected?.map((res) => ({
      id: res?.id,
      isChecked: res?.isChecked,
    }));

    const payload = {
      bucketProcessId: processId,
      documentList: formatSelected,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
    };

    return Promise.resolve(payload);
  }, [selected, processId]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'bucketDocument.document.save',
  });


  const handleSave = useCallback((isSaveAndNext: boolean) => {
    if (viewOnly) return goToNextStep();
    if (!selected?.length) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onCancel: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
        onSubmit: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
        submitText: 'Ya',
        title: 'Mohon Pilih Dokumen Terlebih Dahulu',
        type: 'warning',
      });
      return;
    }

    const formatSelected = selected.map((res) => ({ id: res?.id, isChecked: res?.isChecked }));

    const payload = {
      bucketProcessId: processId,
      documentList: formatSelected,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_BAST,
    };

    saveDocumentChecklist(payload, {
      onError: (error: any) => {
        showNiceModalV2({
          title: error?.message,
          type: 'error',
        });
      },
      onSuccess: async () => {

        if (!isRecordingRef.current) {
          isRecordingRef.current = true;
          try {
            await recordActivity({
              activity: ActivityType.SAVE,
              bucketProcessId: processId,
              module: props.module,
              process: props.process,
              remarks: `Document Checklist LPS ${props.lpsType?.toUpperCase() ?? ''} - Save`,
            });
          } finally {
            isRecordingRef.current = false;
          }
        }

        await handleResetFromServer();
        await queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', { bucketProcessId: processId }],
        });

        if (isSaveAndNext) {
          showNiceModalV2({
            onClose: () => {
              goToNextStep();
            },
            title: 'Data berhasil disimpan',
            type: 'success',
          });
        } else {
          showNiceModalV2({
            onClose: () => { },
            title: 'Data berhasil disimpan',
            type: 'success',
          });
        }
      },
    });
  }, [
    selected,
    processId,
    props.module,
    props.process,
    props.lpsType,
    viewOnly,
    recordActivity,
    saveDocumentChecklist,
    goToNextStep,
    queryClient,
  ]);

  const handleSelected = (data: DocumentCreationResponseDto) => {
    const itemId = (data as any)?.id;

    setSelectedMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId);
      if (!existing) {
        next.set(itemId, { ...data, isChecked: !(data as any)?.isChecked });
      } else {
        next.set(itemId, { ...existing, isChecked: !existing.isChecked });
      }
      return next;
    });
  };

  /**
   * Select All is per-page only.
   * Rows with statusUploadElo are excluded — they should never be toggled.
   */
  const handleSelectAll = (category: string) => {
    // Get current page items for this category
    let currentPageItems: any[] = [];
    if (category === DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO) {
      currentPageItems = digitalMemoList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT) {
      currentPageItems = financingList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT) {
      currentPageItems = supportingList;
    }

    // Filter out items with statusUploadElo (they must not be touched)
    const toggleableItems = currentPageItems.filter((item) => !item.statusUploadElo);
    if (!toggleableItems.length) return;

    // Determine new state based on toggleable items only
    const allChecked = toggleableItems.every((item) => {
      const mapItem = selectedMap.get(item.id);
      return mapItem ? mapItem.isChecked : false;
    });
    const newCheckedState = !allChecked;

    // Apply only to current page toggleable items
    setSelectedMap((prev) => {
      const next = new Map(prev);
      toggleableItems.forEach((item) => {
        const existing = next.get(item.id);
        if (existing) {
          next.set(item.id, { ...existing, isChecked: newCheckedState });
        } else {
          next.set(item.id, { ...item, isChecked: newCheckedState });
        }
      });
      return next;
    });
  };

  const getIsIndeterminate = (category: string) => {
    let currentPageItems: any[] = [];
    if (category === DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO) {
      currentPageItems = digitalMemoList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT) {
      currentPageItems = financingList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT) {
      currentPageItems = supportingList;
    }

    if (!currentPageItems.length) return false;

    const checkedCount = currentPageItems.filter((item) => {
      const mapItem = selectedMap.get(item.id);
      return mapItem ? mapItem.isChecked : false;
    }).length;

    return checkedCount > 0 && checkedCount < currentPageItems.length;
  };

  /**
   * All checked — only for current page items, excluding statusUploadElo.
   */
  const getIsAllChecked = (category: string) => {
    let currentPageItems: any[] = [];
    if (category === DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO) {
      currentPageItems = digitalMemoList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT) {
      currentPageItems = financingList;
    } else if (category === DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT) {
      currentPageItems = supportingList;
    }

    const toggleableItems = currentPageItems.filter((item) => !item.statusUploadElo);
    if (!toggleableItems.length) return false;

    return toggleableItems.every((item) => {
      const mapItem = selectedMap.get(item.id);
      return mapItem ? mapItem.isChecked : false;
    });
  };

  const TABLE_HEADER_DIGITAL_MEMO: TableHeader[] = [
    {
      isDisabled: (data) => {
        if (viewOnly || data?.statusUploadElo) return true;
        if (isSuperAdmin || !viewOnly) return false;
        return data?.isChecked !== data?.isCheckedByCurrentProcess || viewOnly || !isDivisiBisnis;
      },
      isSelected: (data) => {
        if (isCompleted && data?.statusUploadElo) return true;
        if (isCompleted && !data?.statusUploadElo) return false;
        return selected.some((item) => item.id === data?.id && item?.isChecked === true);
      },
      key: 'checkbox',
      label: (
        <CheckboxSelectAll
          checked={getIsAllChecked(DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO)}
          disabled={isLoadingMemo || isResetting || viewOnly || (!isSuperAdmin && !isDivisiBisnis)}
          indeterminate={getIsIndeterminate(DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO)}
          onChange={() => handleSelectAll(DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO)}
        />
      ),
      onSelectChange: (data) => handleSelected(data),
      sx: { width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'isChecked',
      label: 'Tersedia di ELO?',
      render: (data) => {
        if (isCompleted && data?.statusUploadElo) return <TextStyle>Ya</TextStyle>;
        if (isCompleted && !data?.statusUploadElo) return <TextStyle>Tidak</TextStyle>;
        return <TextStyle>{data?.statusUploadElo ? 'Ya' : 'Tidak'}</TextStyle>;
      },
      sx: { minWidth: '12vw' },
    },
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download', onClick: (row) => downloadFile(row?.document, row?.fileName?.split('.')[0]),
        }
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const TABLE_HEADER_FINANCE: TableHeader[] = [
    {
      isDisabled: (data) => {
        if (viewOnly || data?.statusUploadElo) return true;
        if (isSuperAdmin || !viewOnly) return false;
        return data?.isChecked !== data?.isCheckedByCurrentProcess || viewOnly || !isDivisiBisnis;
      },

      isSelected: (data) => {
        if (isCompleted && data?.statusUploadElo) return true;
        if (isCompleted && !data?.statusUploadElo) return false;

        return selected.some((item) => item.id === data?.id && item?.isChecked === true);
      },
      key: 'checkbox',
      label: (
        <CheckboxSelectAll
          checked={getIsAllChecked(DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT)}
          disabled={isLoadingFinancing || isResetting || viewOnly || (!isSuperAdmin && !isDivisiBisnis)}
          indeterminate={getIsIndeterminate(DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT)}
          onChange={() => handleSelectAll(DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT)}
        />
      ),
      onSelectChange: (data) => handleSelected(data),
      sx: { width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'isChecked',
      label: 'Tersedia di ELO?',
      render: (data) => {
        if (isCompleted && data?.statusUploadElo) return <TextStyle>Ya</TextStyle>;
        if (isCompleted && !data?.statusUploadElo) return <TextStyle>Tidak</TextStyle>;
        return <TextStyle>{data?.statusUploadElo ? 'Ya' : 'Tidak'}</TextStyle>;
      },
      sx: { minWidth: '12vw' },
    },
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download', onClick: (row) => downloadFile(row?.document, row?.fileName?.split('.')[0]),
        }
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const TABLE_HEADER_SUPPORT: TableHeader[] = [
    {
      isDisabled: (data) => {
        if (viewOnly || data?.statusUploadElo) return true;
        if (isSuperAdmin || !viewOnly) return false;
        return data?.isChecked !== data?.isCheckedByCurrentProcess || viewOnly || !isDivisiBisnis;
      },

      isSelected: (data) => {
        if (isCompleted && data?.statusUploadElo) return true;
        if (isCompleted && !data?.statusUploadElo) return false;
        return selected.some((item) => item.id === data?.id && item?.isChecked === true);
      },
      key: 'checkbox',
      label: (
        <CheckboxSelectAll
          checked={getIsAllChecked(DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT)}
          disabled={isLoadingSupporting || isResetting || viewOnly || (!isSuperAdmin && !isDivisiBisnis)}
          indeterminate={getIsIndeterminate(DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT)}
          onChange={() => handleSelectAll(DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT)}
        />
      ),
      onSelectChange: (data) => handleSelected(data),
      sx: { width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'isChecked',
      label: 'Tersedia di ELO?',
      render: (data) => {
        if (isCompleted && data?.statusUploadElo) return <TextStyle>Ya</TextStyle>;
        if (isCompleted && !data?.statusUploadElo) return <TextStyle>Tidak</TextStyle>;
        return <TextStyle>{data?.statusUploadElo ? 'Ya' : 'Tidak'}</TextStyle>;
      },
      sx: { minWidth: '12vw' },
    },
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'preview-document', onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download', onClick: (row) => downloadFile(row?.document, row?.fileName?.split('.')[0]),
        }
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const handleOpenGenerateDraftModal = () => {
    NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          key: 'pdf',
          label: 'PDF',
        },
        {
          key: 'word',
          label: 'WORD',
        }
      ],
      onSubmit: (file) => {
        if (file === 'pdf') {
          generateDraftMemo({
            bucketProcessId: isCore ? String(props.id) : processId,
            formatGenerate: SyncfusionFormatGenerate.PDF,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_BAST,
          });
        } else {
          generateDraftMemo({
            bucketProcessId: isCore ? String(props.id) : processId,
            formatGenerate: SyncfusionFormatGenerate.DOCX,
            module: TypeModule.LPS,
            process: TypeProcess.LPS_BAST,
          });
        }
      },
      submitText: 'Generate',
      title: 'Generate draft memo',
    });
  };


  return {
    TABLE_HEADER_DIGITAL_MEMO,
    TABLE_HEADER_FINANCE,
    TABLE_HEADER_SUPPORT,
    checkBtnHideGenerateBast,
    digitalMemoData,
    digitalMemoList,
    financingData,
    financingFilter,
    financingFilterContentList,
    financingItemPerPage,
    financingList,
    financingPage,
    handleOpenGenerateDraftModal,
    handleSave,
    isAutoSaveFetching,
    isDpopDivision,
    isLoadingFinancing,
    isLoadingMemo,
    isLoadingSupporting,
    isResetting,
    isSaveLoading,
    memoFilter,
    memoFilterContentList,
    memoItemPerPage,
    memoPage,
    moduleIndex,
    searchByOptions,
    setFinancingFilter,
    setFinancingItemPerPage,
    setFinancingPage,
    setMemoFilter,
    setMemoItemPerPage,
    setMemoPage,
    setSupportingFilter,
    setSupportingItemPerPage,
    setSupportingPage,
    supportingData,
    supportingFilter,
    supportingFilterContentList,
    supportingItemPerPage,
    supportingList,
    supportingPage,
    viewOnly,
  };
};

export default useDocumentChecklist;
