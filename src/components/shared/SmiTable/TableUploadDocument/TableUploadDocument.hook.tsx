import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { eligibilityReview, ESDD, KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { DocumentTypeRequest } from '@/enums/DocumentTypeRequest';
import { TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import {
  pathDocumentParentListApuppt,
} from '../../SmiModal/ModalUploadDocumentExisting/ModalUploadDocumentExisting.constants';

import { TABLE_HEADER_UPLOAD_DOCUMENT, action, modal } from './TableUploadDocument.constants';

import type { EditDocumentProps, TableUploadDocumentProps } from './TableUploadDocument.types';
import type { options, TableHeader } from '@/components/shared/Table/Table.types';


const whiteListRoute = [
  'apu-ppt',
];

const useTableUploadDocument = ({
  module,
  process,
  childId,
  title = 'Upload Dokumen',
  showModalSelector = false,
  actions = {},
  withDocElo = true,
  ownerId = '',
  approvedMandatory,
  excludeProcess = false,
  isDepi = false,
  checkDataMigrate = false,
  canAddWhenViewOnly = false,
}: TableUploadDocumentProps) => {
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const { debtorId } = useIdentity();
  const [state] = useApp();
  const { stepper } = state;
  const path = usePathname();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const isEligibilityReview = replacePath(eligibilityReview.ADDITIONAL_INFORMATION_PAGE, {
    module: moduleIndex,
    processId,
  });

  const actionButtons = JSON.stringify(actions) === '{}' ?
    stepper.steps.find((dt) => dt.urlPath === getLastPath(path))?.action : actions;

  const {
    TABLE_UPLOAD_DOCUMENT_EDIT,
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD,
  } = action;

  const downloadMutation = useDownloadGeneral({
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

  const handleDownload = (id: number, fileName?: string) => {
    downloadMutation.mutate({ fileName, id });
  };

  let ownership;
  let documentParent;
  const pathDocumentParent = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;
  switch (process) {
    case TypeProcess.CREDIT_CHECKING:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.REVIEWER_DK:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDK;
      break;
    case TypeProcess.REVIEWER_DH:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDH;
      break;
    case TypeProcess.REVIEWER_DEPI:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDEPI;
      break;
    case TypeProcess.REVIEWER_DELST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTREVIEWERDELST;
      break;
    case TypeProcess.LEGAL_SIGNING:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
    case TypeProcess.TECHNICAL_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEW;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.LPA:
      ownership = DocumentTypeRequestDtoOwnershipEnum.LPA;
      break;
    case TypeProcess.LPA_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.LPAREVIEW;
      break;
    case TypeProcess.PROCESSING_TYPE_PK:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTUPLOADPKPT;
      break;
    case TypeProcess.BAR:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
    case TypeProcess.RISALAH_RAPAT:
      ownership = DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT;
      break;
    case TypeProcess.APU_PPT_DPOP:
      if (showModalSelector) {
        documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
        ownership = pathDocumentParent;
      } else {
        documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      }
      break;
    case TypeProcess.CREDIT_CHECKING_DPOP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.TECHNICAL_REVIEW_DELST:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTTECHNICALREVIEWDELST;
      break;
    case TypeProcess.HIGH_RISK_DK:
      ownership = DocumentTypeRequest.HIGH_RISK_CONCLUSION;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP_ANALYST:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIPANALYST;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MIP_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.MUP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.MUP;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.APU_PPT:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE && !!ownerId) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.CUSTOMERDUEDILIGENCE;
      } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.BENEFICIALOWNER;
      } else if (pathDocumentParent === DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR) {
        ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTDEBTOR;
      } else {
        ownership = DocumentTypeRequestDtoOwnershipEnum.ADDITIONALDOCUMENT;
      }
      break;
    default:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
  }

  const allowOwnerId = whiteListRoute.some((item) => path.includes(item));

  const { data: documentList, isFetching: isGetDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: childId ?? String(processId),
      debtorId: debtorId ?? undefined,
      documentParent: process === TypeProcess.APU_PPT || process === TypeProcess.APU_PPT_DPOP
        ? documentParent : undefined,
      module: module,
      ownership,
      process: excludeProcess ? undefined : (process ?? undefined),
      ...(ownerId !== undefined && allowOwnerId ? { ownerId } : {}),
    },
    page: {
      itemPerPage,
      noPage,
    },
    sortList: {
      columnName: 'modifiedDate',
      sortType: 'DESC',
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

  const handleDeleteData = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteDocument(
          {
            bucketProcessId: String(processId),
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

  const handleOpenModalUploadDocument = () => {
    // childId optional sesuai kebutuhan (pk, ls)
    const createProps = {
      childId,
      isDepi,
      module,
      ownerId,
      ownership,
      process,
      withDocElo,
    };
    if (!childId) delete createProps.childId;
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, createProps);
  };

  const handleOpenExistingModalUploadDocument = () => {
    const createProps = {
      blacklist: documentList?.contents?.map((res) => res?.id) || [],
      documentParent,
      module,
      ownership,
      process,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };


  const handleAddDocument = () => {
    if (showModalSelector) return NiceModal.show(MODAL.GLOBAL.SELECTOR, {
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
        if (val === 'new') handleOpenModalUploadDocument();
        else handleOpenExistingModalUploadDocument();
      },
      title: 'Add Document',
    });
    handleOpenModalUploadDocument();
  };

  const handleEditDocument = ({
    id,
    module,
    withDocElo,
    process,
    ownership,
    childId,
  }: EditDocumentProps) => NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
    childId, id, module, ownerId, ownership, process, withDocElo,
  });

  const buttonTemplateQueueByKey = [
    TABLE_UPLOAD_DOCUMENT_EDIT,
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD
  ];

  const renderActionsTable = () => {
    if (!actionButtons || Object.keys(actionButtons).length === 0) {
      return [];
    }

    let sequentialActionButtonsByTemplate = [];

    for (const key in actionButtons) {
      if (buttonTemplateQueueByKey.includes(key)) {
        sequentialActionButtonsByTemplate.push([key, actionButtons[key]]);
      }
    }

    let buttonResult: options = [
      {
        iconName: 'detail',
        onClick: (data) => NiceModal.show(modal.DOCUMENT_DETAIL, { id: data?.id }),
      }
    ];

    if (sequentialActionButtonsByTemplate.length > 0) {
      sequentialActionButtonsByTemplate.map((button) => {
        const [key] = button;
        switch (key) {
          case TABLE_UPLOAD_DOCUMENT_EDIT:
            buttonResult.push({
              iconName: 'edit',
              isDisabled: (data) => checkDataMigrate
                ? (viewOnly && !canAddWhenViewOnly) || !data?.isEditable || !data?.isEdiDataMigrate
                : (viewOnly && !canAddWhenViewOnly) || !data?.isEditable,
              onClick: (data) => handleEditDocument({ childId, id: data?.id, module, ownership, process, withDocElo }),
            });
            break;
          case TABLE_UPLOAD_DOCUMENT_DELETE:
            buttonResult.push(
              {
                iconName: 'delete',
                isDisabled: (data) => checkDataMigrate
                  ? (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable || !data?.isDeletableDataMigrate
                  : (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable,
                onClick: (data) => handleDeleteData(data?.id),
              }
            );
            break;
          case TABLE_UPLOAD_DOCUMENT_DOWNLOAD:
            buttonResult.push(
              {
                iconName: 'preview-document',
                onClick: (data) => {

                  if (data?.document) {
                    window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer');
                  } else {
                    NiceModal.show(MODAL.GLOBAL.WARNING, {
                      title: 'File tidak ditemukan',
                    });
                  }
                },
              },
              {
                iconName: 'download',
                onClick: (data) => handleDownload(data?.id, data?.fileName),
              },
            );
            break;
          default:
            break;
        }
      });
    } else {
      if (matchesPathname(path, isEligibilityReview)) {

        buttonResult = [
          {
            iconName: 'edit',
            isDisabled: (data) => checkDataMigrate
              ? (viewOnly && !canAddWhenViewOnly) || !data?.isEditable || !data?.isEdiDataMigrate
              : (viewOnly && !canAddWhenViewOnly) || !data?.isEditable,
            onClick: (data) => handleEditDocument({ id: data?.id, module, process, withDocElo }),
          },
          {
            iconName: 'delete',
            isDisabled: (data) => checkDataMigrate
              ? (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable || !data?.isDeletableDataMigrate
              : (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable,
            onClick: (data) => handleDeleteData(data?.id),
          },
          {
            iconName: 'preview-document', onClick: (data) => {

              if (data?.document) {
                window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer');
              } else {
                NiceModal.show(MODAL.GLOBAL.WARNING, {
                  title: 'File tidak ditemukan',
                });
              }
            },
          },
          {
            iconName: 'download',
            onClick: (data) => handleDownload(data?.id, data?.fileName),
          }
        ];
      } else {
        buttonResult = [
          {
            iconName: 'detail',
            onClick: (data) => NiceModal.show(modal.DOCUMENT_DETAIL, { id: data?.id }),
          },
          {
            iconName: 'edit',
            isDisabled: (data) => checkDataMigrate
              ? (viewOnly && !canAddWhenViewOnly) || !data?.isEditable || !data?.isEdiDataMigrate
              : (viewOnly && !canAddWhenViewOnly) || !data?.isEditable,
            onClick: (data) => handleEditDocument({ id: data?.id, module, process, withDocElo }),
          },
          {
            iconName: 'delete',
            isDisabled: (data) => checkDataMigrate
              ? (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable || !data?.isDeletableDataMigrate
              : (viewOnly && !canAddWhenViewOnly) || !data?.isDeletable,
            onClick: (data) => handleDeleteData(data?.id),
          },
          {
            iconName: 'preview-document',
            onClick: (data) => {

              if (data?.document) {
                window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer');
              } else {
                NiceModal.show(MODAL.GLOBAL.WARNING, {
                  title: 'File tidak ditemukan',
                });
              }
            },
          },
          {
            iconName: 'download',
            onClick: (data) => handleDownload(data?.id, data?.fileName),
          }
        ];
      }
    }

    return buttonResult;
  };

  const tableHeaderUploadDocument: Array<TableHeader> = [
    ...TABLE_HEADER_UPLOAD_DOCUMENT,
    {
      key: 'action',
      label: 'Action',
      options: renderActionsTable(),
      sx: { minWidth: '12vw' },
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

export default useTableUploadDocument;
