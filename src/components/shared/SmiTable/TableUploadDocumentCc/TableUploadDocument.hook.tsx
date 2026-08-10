import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { eligibilityReview, ESDD, KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
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


const useTableUploadDocument = ({
  module,
  process,
  childId,
  title = 'Upload Dokumen',
  showModalSelector = false,
  actions = {},
  ownerId = null,
  approvedMandatory,
}: TableUploadDocumentProps) => {
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
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


  let ownership;
  let documentParent;

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
      ownership = DocumentTypeRequestDtoOwnershipEnum.BAR;
      break;
    case TypeProcess.RISALAH_RAPAT:
      ownership = DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT;
      break;
    case TypeProcess.APU_PPT_DPOP:
      if (showModalSelector) {
        documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
        ownership = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;

      } else {
        documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      }
      break;
    case TypeProcess.CREDIT_CHECKING_DPOP:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTCREDITCHECKING;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
    case TypeProcess.TECHNICAL_REVIEW_DELST:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.HIGH_RISK_DK:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.APU_PPT:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
      ownership = pathDocumentParentListApuppt.find((item) => item?.path === path?.split('/')[5])?.documentParent;

      break;
    default:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
  }

  const { data: documentList, isFetching: isGetDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: childId ?? String(processId),
      documentParent,
      documentParentApprovedMandatory: approvedMandatory,
      module: module,
      ownerId,
      ownership,
      process: process,
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
      module,
      ownerId,
      process,
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
    process,
    ownership,
    childId,
  }: EditDocumentProps) => NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
    childId, id, module, ownerId, ownership, process,
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
              isDisabled: (data) => viewOnly || !data?.isEditable,
              onClick: (data) => handleEditDocument({ childId, id: data?.id, module, ownership, process }),
            });
            break;
          case TABLE_UPLOAD_DOCUMENT_DELETE:
            buttonResult.push(
              {
                iconName: 'delete',
                isDisabled: (data) => viewOnly || !data?.isDeletable,
                onClick: (data) => handleDeleteData(data?.id),
              }
            );
            break;
          case TABLE_UPLOAD_DOCUMENT_DOWNLOAD:
            buttonResult.push(
              {
                iconName: 'preview-document', onClick: (data) =>
                  window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
              },
              {
                iconName: 'download',
                onClick: (data) => downloadFileV2(`${data?.document}?preview=false`, data?.fileName),
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
            isDisabled: viewOnly,
            onClick: (data) => handleEditDocument({ id: data?.id, module, process }),
          },
          {
            iconName: 'delete',
            isDisabled: viewOnly,
            onClick: (data) => handleDeleteData(data?.id),
          },
          {
            iconName: 'preview-document', onClick: (data) =>
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            onClick: (data) => downloadFileV2(`${data?.document}?preview=false`, data?.fileName),
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
            onClick: (data) => handleEditDocument({ id: data?.id, module, process }),
          },
          {
            iconName: 'delete',
            onClick: (data) => handleDeleteData(data?.id),
          },
          {
            iconName: 'preview-document', onClick: (data) =>
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            onClick: (data) => downloadFileV2(`${data?.document}?preview=false`, data?.fileName),
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
