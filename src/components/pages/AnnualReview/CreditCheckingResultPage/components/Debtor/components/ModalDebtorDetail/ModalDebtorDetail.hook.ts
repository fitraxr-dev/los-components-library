import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDebtorDetail from '@/hooks/services/credit-checking/debtor/useGetDebtorDetail';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import type { ModalDebtorDetailProps } from './ModalDebtorDetail.types';


type CellData = {
  label: string;
  value: string;
  url?: string;
  sx?: Record<string, unknown>;
  fileName?: string;
  extension?: string;
};


export const useModalDebtorDetail = (props: ModalDebtorDetailProps) => {
  const { bucketProcessId, referenceCode, summaryId } = props;
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [noPage, setNoPage] = React.useState(1);

  const { data, isSuccess } = useGetDebtorDetail({
    bucketProcessId,
    referenceCode,
    summaryId,
  });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DEBTORDOCRESULT,
      module: TypeModule.CREDIT_CHECKING,
      ownerId: referenceCode,
      process: TypeProcess.CREDIT_CHECKING_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { data: memoDocumentData } = useGetDocumentList({
    filter: {
      bucketProcessId,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DIGITALMEMO,
      documentType: ['CREDIT_CHECKING_REQUEST_MEMO',
        'CREDIT_CHECKING_RESULTS_MEMO'],
      noRelatedProcess: true,
    } as any,
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;
  const memoDocumentContents = memoDocumentData?.contents;
  const memoDocumentPage = memoDocumentData?.page;

  const npwpDocument = React.useMemo(() => {
    if (!isSuccess || !data?.listDocuments?.length) return null;

    return data.listDocuments.find((el) => el.documentType?.includes('NPWP')) ?? null;
  }, [data?.listDocuments, isSuccess]);

  const npwpFile = React.useMemo(() => {
    if (!npwpDocument) {
      return {
        extension: '',
        fileName: '',
        url: '',
        value: '-',
      };
    }

    const documentExtension = npwpDocument.documentExtension ?? '';
    const documentName = npwpDocument.documentName ?? '';
    const fileNameWithExtension = npwpDocument.fileName ?? '';

    const derivedExtension = documentExtension || (fileNameWithExtension.includes('.') ? fileNameWithExtension.split('.').pop() ?? '' : '');

    const baseFileName = documentName
      || (derivedExtension && fileNameWithExtension
        ? fileNameWithExtension.replace(new RegExp(`\\.${derivedExtension}$`, 'i'), '')
        : fileNameWithExtension);

    return {
      extension: derivedExtension || undefined,
      fileName: baseFileName || undefined,
      url: npwpDocument.document ?? '',
      value: fileNameWithExtension || documentName || '-',
    };
  }, [npwpDocument]);

  const cellsDataTop = React.useMemo<CellData[]>(() => {
    if (!isSuccess || !data) return [];

    return [
      { label: 'Tipe', value: data.typeLabel ?? '-' },
      { label: 'Nama', value: data.debtorName ?? '-' },
      { label: 'Tipe Kepemilikan', value: data.typeLabel ?? '-' },
      { label: 'NPWP', value: data.npwp ?? '-' },
      {
        extension: npwpFile.extension,
        fileName: npwpFile.fileName,
        label: 'Dokumen NPWP',
        url: npwpFile.url,
        value: npwpFile.value,
      },
    ];
  }, [data, isSuccess, npwpFile.extension, npwpFile.fileName, npwpFile.url, npwpFile.value]);

  const cellsDataBottom = React.useMemo<CellData[]>(() => {
    if (!isSuccess || !data) return [];

    return [
      { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: data.note ?? '-' },
      { label: 'Kolektabilitas', sx: { gridColumn: '1 / span 2' }, value: data.collectabilityLabel ?? '-' },
      { label: 'Google Search', sx: { gridColumn: '1 / span 2' }, value: data.googleResult ?? '-' },
    ];
  }, [data, isSuccess]);

  return {
    cellsDataBottom,
    cellsDataTop,
    debtorData: data,
    documentContents,
    documentPage,
    memoDocumentContents,
    memoDocumentPage,
    setItemPerPage,
    setNoPage,
  };
};
