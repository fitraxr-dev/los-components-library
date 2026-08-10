import * as React from 'react';

import { formatDate, formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import useDownloadDraftMemo from '../../DraftMemo/hooks/useDownloadDraftMemo';
import useRetryGenerateDraftMemo from '../../DraftMemo/TableDraftMemoHistory/hooks/useRetryGenerateDraftMemo';
import { TABLE_HEADER } from '../constants';

import type { TableDigitalMemoProps } from './TableDigitalMemo.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const baseHeaders: TableHeader[] = [
  ...TABLE_HEADER,
  {
    key: 'createdBy',
    label: 'Created By',
    sx: { minWidth: '16vw' },
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
    sx: { minWidth: '16vw' },
  },
  {
    key: 'createdDate',
    label: 'Created Date',
    sx: {
      minWidth: '16vw',
    },
    type: 'date',
  },
];

export const useTableDigitalMemo = ({
  module,
  process,
  id,
  existingDocuments = [],
  useSelected,
  selectedItems,
  onItemSelection,
}: TableDigitalMemoProps) => {
  const { processId } = useIdentity();

  const [noPage, setNoPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [documentName, setFileName] = React.useState();
  const [documentGroup, setDocumentGroup] = React.useState<String[] | undefined>(undefined);
  const [filter, setFilter] = useSessionStorage(`${module}-${process}-filter-digital-memo`, null);

  // Extract documentNumbers from existing documents for comparison
  const existingDocumentNumbers = React.useMemo(() => {
    return existingDocuments.map((doc) => doc.documentNumber).filter(Boolean);
  }, [existingDocuments]);

  const { mutate: downloadFile } = useDownloadGeneral({
    onError: (error) => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const { data: searchByOptions } = useGetParameterList('searchByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: documentGroupData } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.DIGITALMEMO,
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

  React.useMemo(() => {
    if (filter?.filter?.documentGroup) {
      setDocumentGroup(filter?.filter?.documentGroup);
    }
  }, [filter?.filter?.documentGroup]);

  const dataGroups = React.useMemo(() => {
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
    { enabled: !!documentGroup },
  );

  const dataTypes = React.useMemo(() => {
    return documentTypeData?.map((item) => ({
      label: item.label,
      value: String(item.id),
    }));
  }, [documentTypeData]);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
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
      options: dataGroups ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => {setDocumentGroup(value);},
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: dataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const { mutate: downloadDraftMemo } = useDownloadDraftMemo({
    onSuccess: (data) => handleFileDownload(data),
  });

  const { mutate: retryGenerateDraftMemo, isPending: retryLoading } = useRetryGenerateDraftMemo({
    onError: (data) => {
      const title = `${data?.response?.data?.errorDetail ?? 'Terjadi Kesalahan, Coba lagi nanti.'}`;
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
  });

  const { data: digitalMemoData, isLoading: digitalMemoLoading } = useGetDocumentList({
    filter: {
      ...filter?.filter,
      bucketProcessId: id !== undefined && id !== null ? String(id) : processId,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DIGITALMEMO,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const digitalMemoContents = digitalMemoData?.contents;
  const digitalMemoPage = digitalMemoData?.page;

  const digitalMemoList = digitalMemoContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel,
    updatedBy: item.createdBy,
    updatedDate: item.modifiedDate ? formatDateTime(item.modifiedDate) : '-',
  }));

  const handleFileDownload = async (data) => {
    try {
      await downloadBinaryPdf(data, documentName);
      showNiceModalV2({
        title: 'Berhasil Download Memo',
        type: 'success',
      });
    } catch (error) {
      console.error('Error during file download:', error);
    }
  };

  const downloadBinaryPdf = (inputData, fileName) => {
    try {
      const blob = new Blob([inputData.data], { type: inputData.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      showNiceModalV2({
        title: `Gagal mengunduh file ${fileName}`,
        type: 'error',
      });
    }
  };

  const handleDownloadMemo = (data) => {
    if (data?.isSuccessUpload) {
      // Extracting the last two parts after the last "/"
      const parts = data.document.split('/'); // Split the URL into an array using "/" as the delimiter
      const lastTwoParts = parts.slice(-2).join('/'); // Get the last two parts and join them back into a string

      if (data.type === 'MANUAL') {
        setFileName(data.documentName);
        downloadFile({ fileName: data.documentName, id: data.id });
      } else {
        setFileName(data.fileName);
        //documentName di hardcode deal dengan BE Bagus
        downloadDraftMemo({
          bucketProcessId: processId,
          documentName: 'DIGITAL_MEMO',
          file: lastTwoParts,
          fileExtension: data.documentExtension,
          module,
          process,
        });
      }
    }
  };

  const handleRetryUpload = (data) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        retryGenerateDraftMemo({
          bucketProcessId: data.bucketProcessId,
          id: Number(data.ownerId),
          module: data.module,
          ownerId: data.ownerId,
          process: data.process,
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk mencoba generate ulang dokumen ini?',
      type: 'warning',
    });
  };

  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const showRefreshButton = React.useCallback((row) => {
    if (!row) return false;
    if (row.isSuccessUpload !== false && row.document) return false;

    const createdTime = new Date(row.createdDate).getTime();
    return Date.now() - createdTime >= 5 * 60 * 1000;
  }, [now]);

  const actionColumn: TableHeader = React.useMemo(() => {
    return {
      key: 'action',
      label: 'Action',
      options: (row) => {
        let list = [];

        if (row?.document) {
          list.push({
            iconName: 'preview-document',
            onClick: (data) => {
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer');
            },
          });
        }

        list.push({
          iconName: 'download',
          onClick: handleDownloadMemo,
        });

        if (showRefreshButton(row)) {
          list.push({
            iconName: 'refresh',
            isDisabled: retryLoading,
            isLoading: retryLoading,
            onClick: handleRetryUpload,
            tooltip: 'Retry Upload',
          });
        }

        return list;
      },
      sx: { width: '12%' },
      type: 'action',
    };
  }, [handleDownloadMemo, handleRetryUpload, retryLoading, showRefreshButton]);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return useSelected ? [
      {
        isDisabled: (row: any) => existingDocumentNumbers.includes(row.documentNumber),
        isSelected: (row: any) =>
          existingDocumentNumbers.includes(row.documentNumber) ||
          selectedItems.some((item) => item.id === row.id),
        key: 'checkbox',
        label: '',
        onSelectChange: (row: any) => {
          if (!existingDocumentNumbers.includes(row.documentNumber)) {
            onItemSelection?.(row, !selectedItems.some((item) => item.id === row.id));
          }
        },
        sx: {
          width: '50px',
        },
        type: 'checkbox',
      },
      ...baseHeaders,
    ] : [
      ...baseHeaders,
      actionColumn,
    ];
  }, [
    useSelected,
    showRefreshButton,
    actionColumn,
    existingDocumentNumbers,
    onItemSelection,
    selectedItems
  ]);

  return {
    digitalMemoList,
    digitalMemoLoading,
    digitalMemoPage,
    filter,
    filterContentList,
    filterDropdownList,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};
