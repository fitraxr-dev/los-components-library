import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import useGetManagementDetail from '../../hooks/useGetManagementDetail';

import type { ModalManagementDetailProps } from './ModalManagementDetail.types';


type CellData = {
  label: string;
  value: string;
  url?: string;
  sx?: Record<string, unknown>;
  fileName?: string;
  extension?: string;
};


const useModalManagementDetail = (props: ModalManagementDetailProps) => {
  const { bucketProcessId, referenceCode, summaryId } = props;
  const [itemPerPage, setItemPerPage] = React.useState(5);
  const [noPage, setNoPage] = React.useState(1);

  const { data, isSuccess } = useGetManagementDetail({ bucketProcessId, referenceCode, summaryId });

  const { data: documentData } = useGetDocumentList({
    filter: {
      bucketProcessId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.MANAGEMENTDOCRESULT,
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

  const findDocument = React.useCallback((predicate: (doc: any) => boolean) => {
    if (!isSuccess || !data?.listDocuments?.length) return null;

    return data.listDocuments.find(predicate) ?? null;
  }, [data?.listDocuments, isSuccess]);

  const buildDocumentMeta = (document: any) => {
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
  };

  const npwpDocument = React.useMemo(
    () => findDocument((doc) => doc.documentType?.includes('NPWP')),
    [findDocument]
  );

  const nikDocument = React.useMemo(
    () => findDocument((doc) => {
      const documentValue = typeof doc.document === 'string' ? doc.document.trim() : doc.document;

      if (!documentValue) return false;

      const documentType = doc.documentType?.toUpperCase();

      return documentType !== 'NPWP_OWNER';
    }),
    [findDocument]
  );

  const npwpFile = React.useMemo(() => buildDocumentMeta(npwpDocument), [npwpDocument]);
  const nikFile = React.useMemo(() => buildDocumentMeta(nikDocument), [nikDocument]);

  const cellsDataTop = React.useMemo<CellData[]>(() => {
    if (!isSuccess || !data) return [];

    const identityTypeLabel = data.identityTypeLabel ?? '-';

    return [
      { label: 'Nama', value: data.name ?? '-' },
      { label: 'NPWP', value: data.npwp ?? '-' },
      {
        extension: npwpFile.extension,
        fileName: npwpFile.fileName,
        label: 'Dokumen NPWP',
        url: npwpFile.url,
        value: npwpFile.value ?? '-',
      },
      {
        label: data.identityTypeLabel ?? 'ID',
        value: data.identityNo ?? '-',
      },
      {
        extension: nikFile.extension,
        fileName: nikFile.fileName,
        label: data.identityTypeLabel ? `Document ${data.identityTypeLabel}` : 'Document ID',
        url: nikFile.url,
        value: nikFile.value ?? '-',
      },
      { label: 'DOB', value: data.dob ?? '-' },
    ];
  }, [
    data,
    isSuccess,
    nikFile.extension,
    nikFile.fileName,
    nikFile.url,
    nikFile.value,
    npwpFile.extension,
    npwpFile.fileName,
    npwpFile.url,
    npwpFile.value,
  ]);

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
    managementData: data,
    memoDocumentContents,
    memoDocumentPage,
    setItemPerPage,
    setNoPage,
  };
};

export default useModalManagementDetail;
