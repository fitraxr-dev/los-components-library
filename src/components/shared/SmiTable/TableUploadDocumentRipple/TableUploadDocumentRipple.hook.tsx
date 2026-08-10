import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { action, modal, TABLE_HEADER_UPLOAD_DOCUMENT } from './TableUploadDocumentRipple.constants';

import type { AddEditModalDocumentProps, TableUploadDocumentRippleProps } from './TableUploadDocumentRipple.types';
import type { options, TableHeader } from '@/components/shared/Table/Table.types';


const useTableUploadDocumentRipple = (props: TableUploadDocumentRippleProps) => {
  const {
    module,
    process,
    childId,
    documentParent,
    ownership,
    rippleTo,
    type,
    isDocumentCategoryDisable,
    showModalSelector,
  } = props;
  const { processId } = useParams();
  const { debtorId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const { stepper } = state;
  const path = usePathname();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const isViewAllDocument = getLastPath(path) === 'view-all-document';
  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);
  const isDisabled = isSuperAdmin || viewOnly;
  const actionButtons = stepper.steps.find((dt) => dt.urlPath === getLastPath(path))?.action;
  const {
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_EDIT,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD,
  } = action;

  const { data: documentList, isFetching: isGetDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: childId ?? String(processId),
      documentCategory: type,
      documentParent,
      module,
      ownership,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { mutate: deleteDocument, isPending: isDeleteLoading } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteData = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteDocument(
          {
            bucketProcessId: childId ?? String(processId),
            documentParent,
            ownership,
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

  const handleOpenAddNewModal = () => {
    const createProps: AddEditModalDocumentProps = {
      childId,
      documentParent,
      isDocumentCategoryDisable,
      module,
      process,
      rippleTo,
      type,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_RIPPLE, createProps);
  };

  const handleOpenAddExistingModal = () => {
    const createProps = {
      blacklist: documentList?.contents?.map((res) => res?.id) || [],
      debtorId: debtorId,
      documentCategory: type ? [type.toString()] : [],
      documentCategoryDisabled: true,
      documentParent: documentParent,
      module,
      ownership,
      process,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };

  const handleAddDocument = () => {
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
  };

  const handleEditDocument = ({
    id,
  }) => {
    const editProps: AddEditModalDocumentProps = {
      childId,
      documentParent,
      id,
      isDocumentCategoryDisable,
      module,
      ownership,
      process,
      rippleTo,
      type,
    };

    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_RIPPLE, editProps);
  };

  const buttonTemplateQueueByKey = [
    TABLE_UPLOAD_DOCUMENT_EDIT,
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD
  ];

  const renderActionsTable = (row) => {

    let buttonResult: options = isViewAllDocument ?
      [
        { iconName: 'preview-document',
          isDisabled: isDeleteLoading,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: isDeleteLoading,
          onClick: (row) => downloadFileV2(row.document, row.fileName),
        }
      ] : [
        {
          iconName: 'detail',
          onClick: (data) => NiceModal.show(modal.MODAL_DETAIL_DOCUMENT_RIPPLE, { id: data?.id }),
        }
      ];
      // action button untuk viewAllDocument
    if (isViewAllDocument) {
      if (!isDisabled && (row.hasSubmitted || !row.isFromOtherProcess)) {
        buttonResult.unshift({
          iconName: 'edit',
          isDisabled: isDeleteLoading,
          onClick: async (row) => handleEditDocument({ id: row?.id }),
        },
        {
          iconName: 'delete',
          isDisabled: isDeleteLoading,
          onClick: async (row) => handleDeleteData(row.id),
        });
      }
    } else {
      // actionButtonTable yang ambil dari balikan actionStepper
      if (!actionButtons || Object.keys(actionButtons).length === 0) {
        return [];
      }

      let sequentialActionButtonsByTemplate = [];

      for (const key in actionButtons) {
        if (buttonTemplateQueueByKey.includes(key)) {
          sequentialActionButtonsByTemplate.push([key, actionButtons[key]]);
        }
      }
      if (sequentialActionButtonsByTemplate.length > 0) {
        sequentialActionButtonsByTemplate.map((button) => {
          const [key] = button;
          switch (key) {
            case TABLE_UPLOAD_DOCUMENT_EDIT:
              buttonResult.push({
                iconName: 'edit',
                isDisabled: viewOnly,
                onClick: (data) => handleEditDocument({ id: data?.id }),
              });
              break;
            case TABLE_UPLOAD_DOCUMENT_DELETE:
              buttonResult.push(
                {
                  iconName: 'delete',
                  isDisabled: viewOnly,
                  onClick: (data) => handleDeleteData(data?.id),
                }
              );
              break;
            case TABLE_UPLOAD_DOCUMENT_DOWNLOAD:
              buttonResult.push(
                { iconName: 'preview-document', onClick: (data) =>
                  window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
                },
                {
                  iconName: 'download',
                  onClick: (data) => downloadFileV2(data?.document, data?.fileName),
                }
              );
              break;
            default:
              break;
          }
        });
      }
    }
    return buttonResult;
  };

  const tableHeaderUploadDocument: Array<TableHeader> = [
    ...TABLE_HEADER_UPLOAD_DOCUMENT,
    {
      key: 'action',
      label: 'Action',
      options: (row) => renderActionsTable(row),
      sx: { width: '15%' },
      type: 'action',
    },
  ];

  return {
    documentList,
    handleAddDocument,
    isGetDocumentListLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadDocument,
    viewOnly,
  };
};

export default useTableUploadDocumentRipple;
