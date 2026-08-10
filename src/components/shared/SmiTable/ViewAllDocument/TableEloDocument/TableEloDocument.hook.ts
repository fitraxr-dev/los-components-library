'use client';

import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate, formatDateTime } from '@/helpers/date';
import {
  filterByDateRange,
  filterByFieldInList,
  filterByFieldValue,
  filterByNumberRange,
  filterBySearch,
  normalizeSortList,
  paginateItems,
  sortItems,
} from '@/helpers/filters';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentEloList from '@/hooks/services/useGetDocumentEloList';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  FilterListEloRequestDtoDocumentCategoryEnum,
} from '@/services/openapi/bucket-document-service';

import { MODAL_UPLOAD_DOCUMENT_ELO } from './TableEloDocument.constants';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';
import type { SearchDetail, SortConfig, SortListObject } from '@/helpers/filters';


const filterEloDocuments = (
  documents: any[],
  filter: any,
  searchDetail: SearchDetail | undefined,
  sortList: SortConfig[] | SortListObject | undefined,
): any[] => {
  console.log('filterEloDocuments documents', documents);
  console.log('filterEloDocuments filter', filter);
  console.log('filterEloDocuments searchDetail', searchDetail);
  console.log('filterEloDocuments sortList', sortList);
  let filteredData = [...documents];
  filteredData = filterBySearch(filteredData, searchDetail?.key, searchDetail?.value);

  if (filter) {
    if (filter.documentGroup) {
      filteredData = filterByFieldInList(filteredData, 'documentGroup', filter.documentGroup);
    }

    if (filter.documentGroup && filter.documentType) {
      filteredData = filterByFieldInList(filteredData, 'documentType', filter.documentType);
    }

    if (filter.isConvenant !== undefined && filter.isConvenant !== null && filter.isConvenant !== '') {
      const isConvenantValue = filter.isConvenant === 'true' || filter.isConvenant === true;
      filteredData = filterByFieldValue(filteredData, 'isConvenant', isConvenantValue);
    }

    filteredData = filterByDateRange(
      filteredData,
      'modifiedDate',
      filter.startModifiedDate,
      filter.endModifiedDate
    );

    filteredData = filterByDateRange(
      filteredData,
      'documentDate',
      filter.startDocumentDate,
      filter.endDocumentDate
    );

    filteredData = filterByDateRange(
      filteredData,
      'createdDate',
      filter.startCreatedDate,
      filter.endCreatedDate
    );

    filteredData = filterByDateRange(
      filteredData,
      'deadlineDate',
      filter.startDeadlineDate,
      filter.endDeadlineDate
    );

    filteredData = filterByDateRange(filteredData, 'dueDate', filter.startDueDate, filter.endDueDate);

    filteredData = filterByNumberRange(
      filteredData,
      'aging',
      filter.startAging ? parseInt(filter.startAging) : undefined,
      filter.endAging ? parseInt(filter.endAging) : undefined
    );
  }

  console.log('filterEloDocuments result', filteredData);

  const normalizedSorts = normalizeSortList(sortList);
  if (normalizedSorts.length > 0) filteredData = sortItems(filteredData, normalizedSorts);

  return filteredData;
};

export const useTableEloDocument = (props: TableUploadDocumentProps) => {
  const { debtorId, processId } = useIdentity();
  const { module, process, id, showModalSelector = true, clientSideFiltering = true } = props;

  const [noPage, setNoPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(10);
  const [documentGroup, setDocumentGroup] = React.useState<String[] | undefined>(undefined);
  // const [filter, setFilter] = useSessionStorage(`${module}-${process}-filter-elo-document`, null);
  const [filter, setFilter] = React.useState({});

  const bucketProcessIdValue = id !== undefined && id !== null ? String(id) : processId;

  const { data: searchByOptions } = useGetParameterList('searchByListEloDocument', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByListEloDocument', {
    label: 'value1',
    value: 'value2',
  });

  React.useMemo(() => {
    if (filter?.filter?.documentGroup) {
      setDocumentGroup(filter?.filter?.documentGroup);
    }
  }, [filter?.filter?.documentGroup]);

  const { data: documentGroupData } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.ELO,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: '',
      },
    },
  );

  const documentGroupOptions = React.useMemo(() => {
    return documentGroupData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [documentGroupData]);

  const { data: documentTypeData } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: documentGroup?.join('|'),
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: '',
      },
    },
    {
      enabled: !!documentGroup,
    }
  );

  const documentTypeOptions = React.useMemo(() => {
    return documentTypeData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [documentTypeData]);

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDocumentDate',
      key: 'documentDate',
      label: 'Tanggal Dokumen',
      startKey: 'startDocumentDate',
      type: 'period',
    },
    {
      endKey: 'endCreatedDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startCreatedDate',
      type: 'period',
    },
    {
      endKey: 'endDeadlineDate',
      key: 'deadlineDate',
      label: 'Tanggal Jatuh Tempo',
      startKey: 'startDeadlineDate',
      type: 'period',
    },
    {
      endKey: 'endDueDate',
      key: 'dueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      key: 'isConvenant',
      label: 'Covenant/Non Covenant',
      options: [
        { label: 'Covenant', value: 'true' },
        { label: 'Non Covenant', value: 'false' },
      ],
      type: 'dropdown',
    },
    {
      endKey: 'endAging',
      key: 'aging',
      label: 'Aging',
      placeholder1: 'Start Aging',
      placeholder2: 'End Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'documentGroup',
      label: 'Group Dokumen',
      options: documentGroupOptions ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => {setDocumentGroup(value);},
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: documentGroup ? documentTypeOptions : [],
      type: 'multiple-autocomplete',
    },
  ];

  const {
    data: eloDocumentData,
    isLoading: eloDocumentLoading,
    refetch,
  } = useGetDocumentEloList(
    {
      filter: {
        ...(clientSideFiltering ? {} : filter?.filter),
        bucketProcessId: bucketProcessIdValue,
        debtorId: debtorId,
        documentCategory: FilterListEloRequestDtoDocumentCategoryEnum.ELO,
        module,
        process,
      },
      ...(clientSideFiltering ? {
        page: {
          itemPerPage: clientSideFiltering ? 100 : itemPerPage,
          noPage: clientSideFiltering ? 1 : noPage,
        },
        searchDetail: clientSideFiltering ? { key: '', value: '' } : (filter?.searchDetail ?? { key: '', value: '' }),
        sortList: clientSideFiltering ? undefined : (filter?.sortList ?? undefined),
      } : {}),
    }
  );

  // Reset page when filters change in client-side filtering mode
  React.useEffect(() => {
    if (clientSideFiltering && filter) {
      setNoPage(1);
    }
  }, [clientSideFiltering, filter]);

  const { mutate: deleteDocument, isPending: isDeleteLoading } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
      refetch();
    },
  });

  const processedData = React.useMemo(() => {
    const documents = eloDocumentData?.contents || [];

    if (documents.length === 0) {
      return {
        contents: [],
        page: {
          currentPage: noPage,
          itemPerPage,
          totalItem: 0,
          totalPage: 0,
        },
      };
    }

    const filteredData = filterEloDocuments(
      documents,
      filter?.filter,
      filter?.searchDetail,
      filter?.sortList
    );

    const paginated = paginateItems(filteredData, noPage, itemPerPage);

    return {
      contents: paginated.data,
      page: {
        currentPage: paginated.currentPage,
        itemPerPage,
        totalItem: paginated.totalItems,
        totalPage: paginated.totalPages,
      },
    };
  }, [
    eloDocumentData,
    filter?.filter,
    filter?.searchDetail,
    filter?.sortList,
    noPage,
    itemPerPage,
  ]);

  const eloDocumentContents = processedData?.contents;
  const eloDocumentPage = processedData?.page;

  const lastUpdate = React.useMemo(() => {
    if (!eloDocumentData || typeof eloDocumentData !== 'object') return '';

    const additionalData = (eloDocumentData as { additionalData?: { lastUpdate?: string } }).additionalData;
    if (!additionalData || typeof additionalData !== 'object') return '';

    const lastUpdateValue = (additionalData as { lastUpdate?: string }).lastUpdate;
    return typeof lastUpdateValue === 'string' ? lastUpdateValue : '';
  }, [eloDocumentData]);

  const eloDocumentList = eloDocumentContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentName: item.documentName ?? '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel ?? '-',
    uploadedBy: item.modifiedBy ?? '-',
    uploadedDate: item.modifiedDate ? formatDateTime(item.modifiedDate) : '-',
  }));

  const handleOpenAddNewModal = React.useCallback(() => {
    NiceModal.show(MODAL_UPLOAD_DOCUMENT_ELO, {
      ...props,
      isExistingMode: false,
      onClose: refetch,
      onSuccess: refetch,
      title: 'Document ELO',
      type: DocumentTypeRequestDtoDocumentParentEnum.ELO,
    });
  }, [props, refetch]);

  const handleOpenAddExistingModal = React.useCallback(() => {
    const createProps = {
      blacklist: eloDocumentList?.map((res) => res?.id) || [],
      debtorId: debtorId,
      documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.ELO.toString()],
      documentCategoryDisabled: true,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.ELO,
      existingDocuments: eloDocumentList || [],
      isExistingMode: true,
      module,
      onClose: refetch,
      onSuccess: refetch,
      process,
    };
    NiceModal.show(MODAL_UPLOAD_DOCUMENT_ELO, createProps);
  }, [eloDocumentList, debtorId, module, process, refetch]);

  const handleAddDocument = React.useCallback(() => {
    if (showModalSelector) {
      return NiceModal.show(MODAL.GLOBAL.SELECTOR, {
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
          }
        },
        title: 'Add Document',
      });
    }
    handleOpenAddNewModal();
  }, [showModalSelector, handleOpenAddNewModal, handleOpenAddExistingModal]);

  const handleOpenEditModal = React.useCallback((id: number) => {
    NiceModal.show(MODAL_UPLOAD_DOCUMENT_ELO, {
      ...props,
      id,
      isExistingMode: false,
      onClose: refetch,
      onSuccess: refetch,
      title: 'Document ELO',
      type: DocumentTypeRequestDtoDocumentParentEnum.ELO,
    });
  }, [props, refetch]);

  const handleOpenDeleteModal = React.useCallback((id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () =>
        deleteDocument({
          bucketProcessId: processId,
          documentParent: DocumentTypeRequestDtoDocumentParentEnum.ELO,
          payload: { id },
        }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk Menghapus data Dokumen ELO?',
      type: 'warning',
    });
  }, [deleteDocument, processId]);

  return {
    eloDocumentList,
    eloDocumentLoading,
    eloDocumentPage,
    filter,
    filterContentList,
    filterDropdownList: searchByOptions,
    handleAddDocument,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isDeleteLoading,
    lastUpdate,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
  };
};
