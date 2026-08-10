import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import useGetShareholderDetail from '../../hooks/useGetShareholderDetail';

import type { ModalShareholderDetailProps } from './ModalShareholderDetail.types';


type CellData = {
  label: string;
  value: string;
  url?: string;
  sx?: Record<string, unknown>;
  fileName?: string;
  extension?: string;
};


const useModalShareholderDetail = (props: ModalShareholderDetailProps) => {
  const { bucketProcessId, referenceCode, summaryId } = props;
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [noPage, setNoPage] = React.useState(1);

  const { data, isSuccess } = useGetShareholderDetail({
    bucketProcessId,
    referenceCode,
    summaryId,
  });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT,
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
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const documentContents = documentData?.contents;
  const documentPage = documentData?.page;
  const memoDocumentContents = memoDocumentData?.contents;
  const memoDocumentPage = memoDocumentData?.page;

  const resolveDocumentMeta = React.useCallback((document: any) => {
    if (!document) {
      return {
        extension: undefined,
        fileName: undefined,
        url: '',
        value: '-',
      };
    }

    const documentExtension = document.documentExtension ?? '';
    const documentName = document.documentName ?? '';
    const fileNameWithExtension = document.fileName ?? '';

    const derivedExtension = documentExtension
      || (fileNameWithExtension.includes('.') ? fileNameWithExtension.split('.').pop() ?? '' : '');

    const baseFileName = documentName
      || (derivedExtension && fileNameWithExtension
        ? fileNameWithExtension.replace(new RegExp(`\.${derivedExtension}$`, 'i'), '')
        : fileNameWithExtension);

    return {
      extension: derivedExtension || undefined,
      fileName: baseFileName || undefined,
      url: document.document ?? '',
      value: fileNameWithExtension || documentName || '-',
    };
  }, []);

  const npwpDocument = React.useMemo(() => {
    if (!isSuccess || !data?.listDocuments?.length) return null;

    return data.listDocuments.find((el) => el.documentType?.includes('NPWP')) ?? null;
  }, [data?.listDocuments, isSuccess]);

  const identityDocument = React.useMemo(() => {
    if (!isSuccess || !data?.listDocuments?.length) return null;

    return data.listDocuments.find((el) => {
      const documentValue = typeof el.document === 'string' ? el.document.trim() : el.document;

      if (!documentValue) return false;

      return !el.documentType?.includes('NPWP');
    }) ?? null;
  }, [data?.listDocuments, isSuccess]);

  const npwpFile = React.useMemo(() => resolveDocumentMeta(npwpDocument), [npwpDocument, resolveDocumentMeta]);
  const identityFile = React.useMemo(() => resolveDocumentMeta(identityDocument),
    [identityDocument, resolveDocumentMeta]);

  const cellsDataTop = React.useMemo<CellData[]>(() => {
    if (!isSuccess || !data) return [];

    const valuePerShareDisplay = [data.curValuePerShare, data.valuePerShare]
      .filter(Boolean)
      .join(' ');

    return [
      { label: 'Tipe', value: data.typeLabel ?? '-' },
      { label: 'Nama', value: data.name ?? '-' },
      { label: 'Tipe Kepemilikan', value: data.typeLabel ?? '-' },
      { label: 'NPWP', value: data.npwp ?? '-' },
      {
        label: data.identityTypeLabel ?? 'ID',
        value: data.identityNo && data.identityNo.trim() !== '' ? data.identityNo : '-',
      },
      {
        extension: npwpFile.extension,
        fileName: npwpFile.fileName,
        label: 'Document NPWP',
        url: npwpFile.url,
        value: npwpFile.value,
      },
      {
        extension: identityFile.extension,
        fileName: identityFile.fileName,
        label: data.identityTypeLabel ? `Document ${data.identityTypeLabel}` : 'Document ID',
        url: identityFile.url,
        value: identityFile.value,
      },
      { label: 'Lembar Saham', value: data.shares ?? '-' },
      { label: 'Nilai Perlembar', value: valuePerShareDisplay || '-' },
      { label: 'Persentase', sx: { gridColumn: '1 / span 2' }, value: data.percentage ? `${data.percentage}%` : '-' },
      { label: 'Nominal', sx: { gridColumn: '1 / span 2' }, value: data.value ?? '-' },
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
    documentContents,
    documentPage,
    memoDocumentContents,
    memoDocumentPage,
    setItemPerPage,
    setNoPage,
    shareholderData: data,
  };
};

export default useModalShareholderDetail;
