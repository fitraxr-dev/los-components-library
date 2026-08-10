import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile, downloadFileV2 } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useViewOnly from '@/hooks/useViewOnly';

import useGetVisitDetail from '@/components/pages/SiteVisit/shared/hooks/useGetVisitDetail';
import useSiteVisitContext from '@/components/pages/SiteVisit/shared/hooks/useSiteVisitContext';
import useViewAllDocument from '@/components/pages/SiteVisit/ViewAllDocumentPage/ViewAllDocument.hook';
import TextStyle from '@/components/shared/TextStyle';

import { PREVIEW_FORMAT, TABLE_HEADER_UPLOAD_DOCUMENT, modal } from './TableUploadDocumentSiteVisit.contants';

import type { TableUploadDocumentSiteVisitProps } from './TableUploadDocumentSiteVisit.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


const useTableUploadDocument = (props: TableUploadDocumentSiteVisitProps) => {
  const { isPemda } = useViewAllDocument();
  const { siteVisitDetail } = useSiteVisitContext();
  const { viewOnly } = useViewOnly();

  // Get visit detail data using the visit-detail API
  const { data: visitDetailData, isLoading: isVisitDetailLoading } = useGetVisitDetail({
    bucketMasterId: siteVisitDetail?.bucketMasterId,
    bucketProcessId: siteVisitDetail?.bucketProcessId || siteVisitDetail?.bucketId,
    enabled: !!siteVisitDetail?.bucketProcessId || !!siteVisitDetail?.bucketId,
    visitCode: siteVisitDetail?.visitCode,
  });

  const {
    process,
    module,
    ownership,
    documentParent,
    documentCategory,
    isValid,
    bucketProcessId,
  } = props;

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  // Use bucketProcessId from props as priority for GET data only
  const currentBucketId = bucketProcessId || siteVisitDetail?.bucketId;

  const { data: documentList, isFetching: isGetDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: currentBucketId, // ← Use priority for GET
      documentParent,
      module: module,
      multiDocsParents: `${documentParent}|${documentCategory}`,
      ownerId: siteVisitDetail?.visitCode,
      ownership: ownership,
      process: process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, { enabled: !!currentBucketId });

  console.log(documentList, 'documentList');

  const { mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteData = (id: number, documentParent: DocumentTypeRequestDtoDocumentParentEnum) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteDocument(
          {
            bucketProcessId: siteVisitDetail?.bucketId, // ← Use context for DELETE
            documentParent,
            payload: {
              id,
            },
          }
        );
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data? ',
      type: 'warning',
    });
  };

  const handleAddDocument = () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, ownerId: siteVisitDetail?.visitCode });
  };

  const handleDownload = async (dataUrl: string, filename: string) => {
    try {
      // Check if file exists first
      const response = await fetch(dataUrl, { method: 'HEAD' });
      if (!response.ok) {
        NiceModal.show(MODAL.GLOBAL.ERROR, {
          title: 'File tidak ditemukan',
        });
        return;
      }
      await downloadFileV2(dataUrl, filename);
    } catch (error) {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: 'File tidak ditemukan',
      });
    }
  };

  const handlePreview = async (dataUrl: string) => {
    try {
      // Check if file exists first
      const response = await fetch(dataUrl, { method: 'HEAD' });
      if (!response.ok) {
        NiceModal.show(MODAL.GLOBAL.ERROR, {
          title: 'File tidak ditemukan',
        });
        return;
      }
      window.open(`${dataUrl}?preview=true`, '_blank', 'noopener,noreferrer');
    } catch (error) {
      NiceModal.show(MODAL.GLOBAL.ERROR, {
        title: 'File tidak ditemukan',
      });
    }
  };


  const tableHeaderUploadDocument: Array<TableHeader> = [
    ...TABLE_HEADER_UPLOAD_DOCUMENT.map((header) => {
      // Jika header adalah createdBy, modifikasi untuk menggunakan visitDetailData
      if (header.key === 'createdBy') {
        return {
          ...header,
          render: (row) => {
            const visitData = visitDetailData?.data?.content;
            const uploadedBy = visitData?.creator || row?.creator || row?.createdBy || '-';
            return (
              <TextStyle variant="body4">
                {uploadedBy}
              </TextStyle>
            );
          },
        };
      }
      return header;
    }),
    {
      key: 'action',
      label: 'Action',
      options: (data) => {
        // Check if document data is available
        const hasDocument = !!data?.document;
        const hasFileName = !!data?.fileName;
        const isDocumentReady = hasDocument && hasFileName;

        const list = [
          { iconName: 'edit', isDisabled: props?.disabled, onClick: (data) => NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, data) },
          { iconName: 'delete', isDisabled: props?.disabled, onClick: (data) => handleDeleteData(data?.id, data?.documentParent) },
          {
            iconName: 'preview-document',
            isDisabled: !isDocumentReady,
            onClick: (data) => handlePreview(data?.document),
          },
          {
            iconName: 'download',
            isDisabled: !isDocumentReady,
            onClick: (data) => handleDownload(data?.document, data?.fileName),
          }
        ];

        if (isPemda || viewOnly || siteVisitDetail?.isFromHistory)
          return list.filter((val) => val.iconName === 'download' || val.iconName === 'preview-document');

        return list;
      },
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  return {
    documentList,
    handleAddDocument,
    isGetDocumentListLoading,
    isValid,
    isVisitDetailLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadDocument,
    // Visit detail data from API
    visitDetailData,
  };
};

export default useTableUploadDocument;
