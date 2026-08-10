import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { toDateStringNumber } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import TextStyle from '../../TextStyle';
import { modal } from '../ViewAllDocument/constants';

import type { TableDocumentCreditChekingResultProps } from './TableDocumentCreditCheckingResult.types';
import type { TableHeader } from '../../Table/Table.types';


const useTableDocumentCreditCheckingResult = ({
  processId,
  documentParent,
  status,
  process,
  ownerId,
}: TableDocumentCreditChekingResultProps) => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: documentsData, isFetching } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: documentParent ?? DocumentTypeRequestDtoDocumentParentEnum.CREDITCHECKING,
      module: 'CREDIT_CHECKING',
      ownerId,
      process: process ?? 'CREDIT_CHECKING_RESULT',
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'documentCategoryLabel',
      label: 'Kategori Dokumen',
    },
    {
      key: 'documentGroupLabel',
      label: 'Group Dokumen',
    },
    {
      key: 'documentTypeLabel',
      label: 'Jenis Dokumen',
    },
    {
      key: 'documentName',
      label: 'Nama Dokumen',
    },
    {
      key: 'fileName',
      label: 'Upload Dokumen',
      render: (row) => (
        <TextStyle variant="body4">
          {`${row.fileName}.${row.documentExtension}`}
        </TextStyle>
      ),
    },
    {
      key: 'documentNumber',
      label: 'Nomor Dokumen',
    },
    {
      key: 'documentDate',
      label: 'Tanggal Dokumen',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.documentDate ? toDateStringNumber(row.documentDate) : '-'}
        </TextStyle>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => NiceModal.show(modal.DOCUMENT_DETAIL, { id: data?.id }),
        },
        {
          iconName: 'preview-document',
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (data) => {
            downloadFileV2(data?.document, data?.fileName);
          },
        },
        {
          iconName: 'delete',
          onClick: (data) => {
            deleteDocument({
              bucketProcessId: processId,
              documentParent: DocumentTypeRequestDtoDocumentParentEnum.CREDITCHECKING,
              payload: { id: data.id },
            });
          },
        }
      ],
      sx: { width: '16%' },
      type: 'action',
    },
  ];

  return {
    isFetching,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData: documentsData?.contents,
    tableHeader,
    totalPage: documentsData?.page?.totalPage,
  };
};

export default useTableDocumentCreditCheckingResult;
