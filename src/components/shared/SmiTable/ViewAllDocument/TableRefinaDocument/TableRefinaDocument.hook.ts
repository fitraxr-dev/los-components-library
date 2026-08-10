import { useState, useMemo, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetRefinaDocumentList from '@/hooks/services/useGetRefinaDocumentList';
import usePreviewRefinaDocument from '@/hooks/services/usePreviewRefinaDocument';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentCategoryEnum } from '@/services/openapi/bucket-document-service';

import { modal } from '../constants';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';


const useTableRefinaDocument = (props: TableUploadDocumentProps) => {
  const { module, process, id, showModalSelector, useDataMaster = false } = props;
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const { viewOnly } = useViewOnly();
  const [filter, setFilter] = useSessionStorage(`${props.module}-${props.process}-filter-refina-document`, null);

  // Use 'key' as value to avoid null mapping from value2
  const { data: searchByOptions } = useGetParameterList('searchByListRefinaDocument', { label: 'value1', value: 'key' });
  const { data: sortByOptions } = useGetParameterList('sortByListRefinaDocument', { label: 'value1', value: 'key' });

  const filterDropdownList = searchByOptions;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endCreatedDate',
      key: 'updateAt',
      label: 'Diperbaharui Pada',
      startKey: 'startCreatedDate',
      type: 'period',
    }
  ];

  const listReadOnly = [
    TypeProcess.REVIEWER_DK,
    TypeProcess.REVIEWER_DH
  ];
  const readOnly = listReadOnly.includes(props.process);

  const { divisionCode } = useDivision();
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION
  ];
  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);

  // Get debtor data to access refinaId
  const { data: debtorData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: module || TypeModule.PIPELINE,
    process: process || TypeProcess.PIPELINE,
  }, {
    enabled: !useDataMaster,
  });

  const { data: debtorDataMaster } = useGetDetailMasterDebtor({
    debtorId: processId,
  }, {
    enabled: useDataMaster,
  });

  // State for offline mode
  const [allRefinaDocuments, setAllRefinaDocuments] = useState<any[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [currentRefinaId, setCurrentRefinaId] = useState<number | null>(null);

  // Get the correct refinaId - prioritize debtorData.refinaId, then fallback to id or processId
  const refinaId = useMemo(() => {
    if (useDataMaster ? debtorDataMaster?.refinaId : debtorData?.refinaId) {
      return parseInt(useDataMaster ? debtorDataMaster?.refinaId : debtorData?.refinaId);
    }
    if (id !== undefined && id !== null) {
      return parseInt(String(id));
    }
    return parseInt(processId);
  }, [useDataMaster ? debtorDataMaster?.refinaId : debtorData?.refinaId, id, processId]);

  const { data: refinaDocumentData, isLoading: refinaDocumentLoading, refetch } = useGetRefinaDocumentList({
    submissionId: refinaId,
  }, {
    enabled: !!refinaId,
  });

  // Store all documents when data is loaded
  useEffect(() => {
    if (refinaDocumentData?.contents && refinaId) {
      // Only update data if this is for the current refinaId
      if (currentRefinaId !== refinaId) {
        setAllRefinaDocuments([]);
        setCurrentRefinaId(refinaId);
      }

      setAllRefinaDocuments(refinaDocumentData.contents);
      setIsInitialDataLoaded(true);
    }
  }, [refinaDocumentData?.contents, refinaId, currentRefinaId]);

  // Reset when refinaId changes
  useEffect(() => {
    if (refinaId && currentRefinaId !== refinaId) {
      setIsInitialDataLoaded(false);
      setCurrentRefinaId(refinaId);
    }
  }, [refinaId, currentRefinaId]);

  // Retry mechanism for empty data
  useEffect(() => {
    if (
      refinaDocumentData?.contents &&
      refinaDocumentData.contents.length === 0 &&
      !refinaDocumentLoading
    ) {
      const timer = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [refinaDocumentData?.contents, refinaDocumentLoading, refetch]);

  // Reset to first page when filters change (FE pagination)
  useEffect(() => {
    if (filter) {
      setNoPage(1);
    }
  }, [filter]);

  // Refetch data when component becomes visible (handles navigation back to this page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && refinaId) {
        // Small delay to ensure the component is fully mounted
        setTimeout(() => {
          refetch();
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refetch when component mounts if we have a refinaId
    if (refinaId) {
      const timer = setTimeout(() => {
        refetch();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refinaId, refetch]);

  // Fallback mechanism: if we have refinaId but no data after 2 seconds, force refetch
  useEffect(() => {
    if (refinaId && allRefinaDocuments.length === 0 && !refinaDocumentLoading) {
      const timer = setTimeout(() => {
        refetch();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [refinaId, allRefinaDocuments.length, refinaDocumentLoading, refetch]);

  // Helper function to filter data on client side
  const filterRefinaDocuments = (
    documents: any[],
    filter: any,
    searchDetail: any,
    sortList: any
  ) => {
    let filteredData = [...documents];

    // Map parameter keys (from BE params) to actual data fields
    const keyMap: Record<string, string> = {
      description: 'description',
      destination: 'documentTo',
      document_name: 'documentName',
      updated_date: 'updateAt',
    };
    const mapKey = (key?: string) => (key && keyMap[key]) || key;

    // Apply search filter
    if (searchDetail?.key && searchDetail?.value) {
      const searchValue = searchDetail.value.toLowerCase();
      filteredData = filteredData.filter((item) => {
        const effectiveKey = mapKey(searchDetail.key);
        const searchField = item[effectiveKey as keyof typeof item];
        return searchField && searchField.toString().toLowerCase().includes(searchValue);
      });
    }

    // Apply other filters (period handling)
    if (filter) {
      // Check for period filter in nested filter object (this is where the actual values are)
      if (filter.filter && (filter.filter.startCreatedDate || filter.filter.endCreatedDate)) {

        filteredData = filteredData.filter((item) => {
          // Parse item date - normalize to start of day
          const itemDate = Array.isArray(item.rawDate)
            ? new Date(item.rawDate[0], (item.rawDate[1] || 1) - 1, item.rawDate[2] || 1)
            : new Date(item.updateAt);

          // Parse filter dates - normalize to start of day
          const startDate = filter.filter.startCreatedDate
            ? new Date(new Date(filter.filter.startCreatedDate).setHours(0, 0, 0, 0))
            : null;
          const endDate = filter.filter.endCreatedDate
            ? new Date(new Date(filter.filter.endCreatedDate).setHours(23, 59, 59, 999))
            : null;

          // Normalize item date to start of day for comparison
          const normalizedItemDate = new Date(itemDate.setHours(0, 0, 0, 0));

          if (startDate && endDate) return normalizedItemDate >= startDate && normalizedItemDate <= endDate;
          if (startDate) return normalizedItemDate >= startDate;
          if (endDate) return normalizedItemDate <= endDate;
          return true;
        });
      }

      // Also check for period filter at root level (fallback)
      if (filter.startCreatedDate || filter.endCreatedDate) {
        filteredData = filteredData.filter((item) => {
          // Parse item date - normalize to start of day
          const itemDate = Array.isArray(item.rawDate)
            ? new Date(item.rawDate[0], (item.rawDate[1] || 1) - 1, item.rawDate[2] || 1)
            : new Date(item.updateAt);

          // Parse filter dates - normalize to start of day
          const startDate = filter.startCreatedDate
            ? new Date(new Date(filter.startCreatedDate).setHours(0, 0, 0, 0))
            : null;
          const endDate = filter.endCreatedDate
            ? new Date(new Date(filter.endCreatedDate).setHours(23, 59, 59, 999))
            : null;

          // Normalize item date to start of day for comparison
          const normalizedItemDate = new Date(itemDate.setHours(0, 0, 0, 0));

          if (startDate && endDate) return normalizedItemDate >= startDate && normalizedItemDate <= endDate;
          if (startDate) return normalizedItemDate >= startDate;
          if (endDate) return normalizedItemDate <= endDate;
          return true;
        });
      }
    }

    // Apply sorting
    // Normalize sort input from Search component
    let normalizedSorts: Array<{ key: string; order: 'asc' | 'desc' } > = [];
    if (Array.isArray(sortList)) {
      normalizedSorts = sortList.map((s) => ({ key: s.key, order: s.order }));
    } else if (sortList && typeof sortList === 'object' && (sortList.columnName || sortList.sortType)) {
      const key = mapKey(sortList.columnName);
      const order = (sortList.sortType || 'ASC').toLowerCase() === 'asc' ? 'asc' : 'desc';
      if (key) normalizedSorts = [{ key, order }];
    }

    if (normalizedSorts.length > 0) {
      filteredData.sort((a, b) => {
        for (const sort of normalizedSorts) {
          const aValue = a[sort.key as keyof typeof a];
          const bValue = b[sort.key as keyof typeof b];

          if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  // Process data with client-side filtering and pagination
  const processedData = useMemo(() => {
    // Client-side filtering and pagination
    const filteredData = filterRefinaDocuments(
      allRefinaDocuments,
      filter,
      filter?.searchDetail,
      filter?.sortList
    );

    // Apply pagination
    const startIndex = (noPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      contents: paginatedData,
      page: {
        currentPage: noPage,
        itemPerPage: itemPerPage,
        totalItem: filteredData.length,
        totalPage: Math.ceil(filteredData.length / itemPerPage),
      },
    };
  }, [
    allRefinaDocuments,
    filter?.filter,
    filter?.searchDetail,
    filter?.sortList,
    noPage,
    itemPerPage,
  ]);

  const refinaDocumentList = processedData?.contents;
  const refinaDocumentPage = processedData?.page;

  // Preview refina document functionality
  const { mutate: previewRefinaDocument, isPending: isPreviewLoading } = usePreviewRefinaDocument({
    onError: (err: any) => {
      // Show warning modal when file is not found (404)
      if (err?.status === 404) {
        NiceModal.show(MODAL.GLOBAL.WARNING, {
          title: 'File tidak ditemukan',
        });
        return;
      }
      // Other errors → show error modal
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: 'Terjadi kesalahan',
      });
    },
    onSuccess: (data) => {
      // Create blob URL and open in new tab only
      const url = window.URL.createObjectURL(data.data);

      // Create a temporary link element to force opening in new tab
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';

      // Add to DOM, click, and remove immediately
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after a short delay to prevent memory leaks
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    },
  });

  const handlePreviewRefinaDocument = (data: any) => {
    // Parse downloadUrl to extract parameters without decoding
    const parseDownloadUrl = (downloadUrl: string) => {
      try {
        const url = new URL(downloadUrl);
        const searchParams = url.search.substring(1);

        // Extract raw encoded values without decoding using regex
        const getRawParam = (paramName: string) => {
          const regex = new RegExp(`${paramName}=([^&]*)`);
          const match = searchParams.match(regex);
          return match ? match[1] : '';
        };

        return {
          menu: getRawParam('menu'),
          path: getRawParam('path'),
          subMenu: getRawParam('subMenu'),
          title: getRawParam('title'),
        };
      } catch (error) {
        return {
          menu: '',
          path: '',
          subMenu: '',
          title: '',
        };
      }
    };

    // Extract parameters from downloadUrl (keeping them URL-encoded)
    const urlParams = parseDownloadUrl(data.downloadUrl);

    // Construct payload for preview API with raw encoded values
    const payload = {
      menu: urlParams.menu,
      path: urlParams.path,
      subMenu: urlParams.subMenu,
      title: urlParams.title,
    };

    previewRefinaDocument(payload);
  };

  const handleAddDocument = () => {
    if (showModalSelector) return NiceModal.show(
      MODAL.GLOBAL.SELECTOR,
      {
        data: [
          {
            description: 'Tambah dokumen baru',
            key: 'new',
            label: 'Create New',
          },
          {
            description: 'Menambahkan dari dokumen eksisting',
            key: 'existing',
            label: 'Tambahkan dari Dokumen Eksisting',
          },
        ],
        onSubmit: (val: any) => {
          if (val === 'new') {
            handleOpenAddNewModal();
          } else {
            handleOpenAddExistingModal();
          };
        },
        title: 'Add Document',
      });
    handleOpenAddNewModal();
  };

  const handleOpenAddNewModal = () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, title: 'Document Refina', type: DocumentTypeRequestDtoDocumentCategoryEnum.REFINA });
  };

  const handleOpenAddExistingModal = () => {
    const createProps = {
      blacklist: refinaDocumentList?.map((res) => res?.id) || [],
      debtorId: debtorId,
      documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.REFINA],
      documentCategoryDisabled: true,
      documentParent: DocumentTypeRequestDtoDocumentCategoryEnum.REFINA,
      module,
      process,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddDocument,
    handlePreviewRefinaDocument,
    isBusinessDivision,
    isPreviewLoading,
    noPage,
    readOnly,
    refinaDocumentList,
    refinaDocumentLoading: refinaDocumentLoading,
    refinaDocumentPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    viewOnly,
  };
};

export default useTableRefinaDocument;
