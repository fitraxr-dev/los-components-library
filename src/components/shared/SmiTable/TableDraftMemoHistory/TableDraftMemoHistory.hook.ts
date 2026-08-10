import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { TABLE_HEADER_DRAFT_MEMO_HISTORY } from './TableDraftMemoHistory.constants';

import type { TableDraftMemoHistoryProps } from './TableDraftMemoHistory.types';
import type { options, TableHeader } from '@/components/shared/Table/Table.types';

import useDeleteDraftMemo from '@/hooks/services/useDeleteDraftMemo';
import useGetDraftMemoHistory from '@/hooks/services/useGetDraftMemoHistory';


const useTableDraftMemoHistory = ({
  module,
  process,
  childId,
  title = 'Draft Memo History',
  actions = {},
  ownerId = '',
}: TableDraftMemoHistoryProps) => {
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const { stepper } = state;

  const actionButtons = JSON.stringify(actions) === '{}' ?
    stepper.steps.find((dt) => dt.urlPath === 'draft-memo-history')?.action : actions;

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
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
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
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.LPA_REVIEW:
      ownership = DocumentTypeRequestDtoOwnershipEnum.LPAREVIEW;
      break;
    case TypeProcess.PROCESSING_TYPE_PK:
      ownership = DocumentTypeRequestDtoOwnershipEnum.DOCUMENTUPLOADPKPT;
      break;
    case TypeProcess.RISALAH_RAPAT:
      ownership = DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT;
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL;
      break;
    case TypeProcess.APU_PPT_DPOP:
      documentParent = DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT;
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
      break;
    default:
      ownership = DocumentTypeRequestDtoOwnershipEnum.OTHERRELATED;
      break;
  }

  const { data: draftMemoHistoryList, isFetching: isGetDraftMemoHistoryLoading } = useGetDraftMemoHistory({
    filter: {
      bucketProcessId: childId ?? String(processId),
      documentParent,
      module: module,
      ownerId,
      ownership,
      process: process,
    },
  });

  const { mutate: deleteDraftMemo } = useDeleteDraftMemo({
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
        deleteDraftMemo(
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

  const renderActionsTable = () => {
    if (!actionButtons || Object.keys(actionButtons).length === 0) {
      return [];
    }

    const buttonResult: options = [
      {
        iconName: 'detail',
        onClick: (data) => NiceModal.show(MODAL.GLOBAL.DETAIL, { id: data?.id }),
      },
      {
        iconName: 'delete',
        isDisabled: viewOnly,
        onClick: (data) => handleDeleteData(data?.id),
      },
      {
        iconName: 'download',
        onClick: (data) => handleDownload(data.id, data.documentName),
      }
    ];

    return buttonResult;
  };

  const tableHeaderDraftMemoHistory: Array<TableHeader> = [
    ...TABLE_HEADER_DRAFT_MEMO_HISTORY,
    {
      key: 'action',
      label: 'Action',
      options: renderActionsTable(),
      sx: { minWidth: '12vw' },
      type: 'action',
    },
  ];

  return {
    draftMemoHistoryList,
    isGetDraftMemoHistoryLoading,
    tableHeaderDraftMemoHistory,
    viewOnly,
  };
};

export default useTableDraftMemoHistory;
