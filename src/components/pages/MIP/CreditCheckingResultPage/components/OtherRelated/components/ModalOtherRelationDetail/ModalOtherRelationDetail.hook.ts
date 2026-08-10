import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import useGetOtherRelatedDetail from '../../hooks/useGetOtherRelatedDetail';

import type { ModalOtherRelationDetailProps } from './ModalOtherRelationDetail.types';


type CellData = {
  label: string;
  value: string;
  url?: string;
  sx?: Record<string, unknown>;
  fileName?: string;
  extension?: string;
};


const useModalOtherRelationDetail = (props: ModalOtherRelationDetailProps) => {
  const { bucketProcessId, referenceCode, summaryId } = props;
  const { data, isSuccess } = useGetOtherRelatedDetail({ bucketProcessId, referenceCode, summaryId });
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [noPage, setNoPage] = React.useState(1);

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.OTHERRELATEDDOCRESULT,
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

    const identityLabel = data.identityTypeLabel ?? 'ID';
    const identityNumber = data.identityNo && data.identityNo.trim() !== '' ? data.identityNo : '-';
    const identityDocumentLabel = data.identityTypeLabel ? `Document ${data.identityTypeLabel}` : 'Document ID';

    return [
      { label: 'Tipe', value: data.typeLabel ?? '-' },
      { label: 'Nama', value: data.name ?? '-' },
      { label: 'Jabatan', sx: { gridColumn: '1 / span 2' }, value: data.jobPositionLabel ?? '-' },
      { label: 'NPWP', value: data.npwp ?? '-' },
      { label: identityLabel, value: identityNumber },
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
        label: identityDocumentLabel,
        url: identityFile.url,
        value: identityFile.value,
      },
    ];
  }, [
    data,
    identityFile.extension,
    identityFile.fileName,
    identityFile.url,
    identityFile.value,
    isSuccess,
    npwpFile.extension,
    npwpFile.fileName,
    npwpFile.url,
    npwpFile.value,
  ]);

  const cellsDataBottom = React.useMemo<CellData[]>(() => {
    if (!isSuccess || !data) return [];

    return [
      { label: 'Kolektabilitas', sx: { gridColumn: '1 / span 2' }, value: data.collectabilityLabel ?? '-' },
      { label: 'Hasil Laporan', sx: { gridColumn: '1 / span 2' }, value: data.resultReporting ?? '-' },
      { label: 'Catatan', sx: { gridColumn: '1 / span 2' }, value: data.note ?? '-' },
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
    otherRelationData: data,
    setItemPerPage,
    setNoPage,
  };
};

export default useModalOtherRelationDetail;
