'use client';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import { useSelectedDocuments } from '../../context/SelectedDocumentsContext';

import {
  RATING_UPLOAD_FILE_RATING_HISTORY,
  SUPPORTING_DOCUMENT_DEPI,
} from './components/ModalUploadDocument/ModalUploadDocument.constants';
import { modal, TABLE_HEADER_LIST } from './TableDocumentDRD.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDocumentDrd = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const [appState] = useApp();
  const { selectedDocuments, handleSelectDocument, resetSelectedDocuments } = useSelectedDocuments();
  const isStaffOrMaker = appState.currentRole.includes(roles.RM) || appState.currentRole.includes(roles.MAKER);
  const { data, isLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT,
      documentGroup: [SUPPORTING_DOCUMENT_DEPI],
      documentType: [RATING_UPLOAD_FILE_RATING_HISTORY],
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
  });

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

  const currentStatus = debtorInfoData?.status;

  const drdDocumentList = data?.contents?.map((item) => ({
    ...item,
    createdDate: toDateString(item.createdDate) ?? '-',
    documentDate: toDateString(item.documentDate) ?? '-',
    status: item?.statusDrd ?? '-',
  }));

  const { mutate: deleteDocument } = useDeleteDocument({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data Berhasil Di hapus', type: 'success' });
    },
  });

  const handleDeleteDocument = (id: any, documentName: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => { deleteDocument(
        {
          bucketProcessId: String(processId),
          payload: {
            id,
          },
        }
      );},
      submitText: 'Ya',
      title: `Apakah anda yakin untuk menghapus dokumen DRD ${documentName} ?`,
      type: 'warning',
    });
  };

  const handleOpenAddModal = async () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      autoSelectGroupId: SUPPORTING_DOCUMENT_DEPI,
      documentParent: null,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      type: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
    });
  };

  const handleEditDocument = (documentData: any) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      autoSelectGroupId: SUPPORTING_DOCUMENT_DEPI,
      documentParent: null,
      id: documentData?.id,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      type: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
    });
  };

  const isApprovedStatus = (currentStatus?.includes('APPROVED') || currentStatus?.includes('COMPLETED') || currentStatus?.includes('DRD')) && isStaffOrMaker;

  const tableAction = [
    {
      iconName: 'detail',
      onClick: (data) => NiceModal.show(modal.DOCUMENT_DETAIL, { id: data?.id }),
    },
    {
      iconName: 'edit',
      isDisabled: (row) => {
        if (isApprovedStatus && !row?.isApprovedKadiv) {
          return false;
        }
        return viewOnly;
      },
      onClick: (data) => handleEditDocument(data),
    },
    {
      iconName: 'preview-document',
      onClick: (data) =>
        window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
    },
    {
      iconName: 'download',
      onClick: (row) => downloadFile(row.document, row.documentName),
    },
    {
      iconName: 'delete',
      isDisabled: (row) => {

        if (isApprovedStatus && !row?.isApprovedKadiv) {
          return false;
        }

        return viewOnly;
      },
      onClick: (row) => handleDeleteDocument(row.id, row.documentName),
    }
  ];

  const tableHeader: Array<TableHeader> = [

    ...(isApprovedStatus ? [{
      isDisabled: (row) => row?.status.toLowerCase() === 'drd ok',
      isSelected: (data: any) => selectedDocuments.some((item: any) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: handleSelectDocument,
      sx: { width: '4%' },
      type: 'checkbox' as const,
    }] : []),

    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    ...TABLE_HEADER_LIST,
    {
      key: 'action',
      label: 'Action',
      options: tableAction,
      sx: { minWidth: '12vw' },
      type: 'action',
    },
  ];

  return {
    drdDocumentList,
    handleDeleteDocument,
    handleOpenAddModal,
    isApprovedStatus,
    isLoading,
    modal,
    resetSelectedDocuments,
    selectedDocuments,
    tableHeader,
    theme,
    viewOnly,
  };
};

export default useTableDocumentDrd;
