import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  APPROVE,
  CANCELED,
  CLOSE,
  DECLINE,
  REJECTED,
  RETURN_TO_ANALYST,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  RETURN_TO_MAKER,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { mupAnalyst } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetConfirmAnalyst from '@/hooks/services/mip/mip-discussion/useGetConfirmAnalyst';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetBcmById from '@/hooks/services/useGetBcmById';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useSaveConfirmAnalyst from '@/hooks/services/useSaveConfirmAnalyst';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { useMUPAnalystContext } from '@/components/layouts/MUPAnalystLayout/MUPAnalyst.context';
import Button from '@/components/shared/Button';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';

import { modal } from './components/TableUploadDocument/TableUploadDocument.constants';
import useGetDocumentGroupByOwnerIdList from './hooks/useGetDocumentGroupByOwnerIdList';
import { PemdaEnum, tableHeaderList } from './MupDiscussion.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useMupDiscussion = () => {
  const [state] = useApp();
  const { actionButtons } = useMUPAnalystContext();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const { canView, canUpdate } = baseMUPAnalystAccess;
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [isDocumentConfirmed, setIsDocumentConfirmed] = useState(null);
  const [isDoucmentAvailable, setIsDoucmentAvailable] = useState(false);
  const router = useCustomRouter();
  const { debtorId } = useIdentity();

  const [processIdPrefix] = processId.split('-');
  const isPrefixAnalyst = processIdPrefix === 'MUPA';
  const isEnableConfirmation = isPrefixAnalyst;

  useEffect(() => {
    if (canView) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: _module,
        process,
        remarks: 'View MUP Discussion page',
      });
    }
  }, [recordActivity, processId, canView]);
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();

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
    recordActivity({
      activity: ActivityType.DOWNLOAD,
      bucketProcessId: processId,
      module: _module,
      process,
      remarks: `Download document ${fileName || id}`,
    });
    downloadMutation.mutate({ fileName, id });
  };

  const _module: TypeModule = TypeModule.MUP;
  const process: TypeProcess = TypeProcess.MUP_ANALYST;

  const { data: bucketData } = useGetBucketById({
    bucketProcessId: processId,
    module: _module,
    process: process,
  });

  const isPemda = (Object).values<string>(PemdaEnum).includes(bucketData?.institutionType);

  const currentStaffName = bucketData?.staffName;
  const analystId = bucketData?.analystId;

  const { data: bcmData, isSuccess: isGetBcmSuccess } = useGetBcmById({
    bcmId: bucketData?.bucketMaster,
    module: _module,
    process: process,
  });

  const bucketMasterId = bcmData?.bucketMaster;

  // const {
  //   data: documentGroupByOwnerData,
  //   isLoading: isDocumentGroupLoading,
  //   isFetching: isDocumentGroupFetching,
  // } = useGetDocumentGroupByOwnerIdList(
  //   {
  //     filter: {
  //       bucketProcessId: processId,
  //       documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
  //       module: 'MUP',
  //       ownerId: bcmData?.bucketMaster,
  //       process: 'MUP|MUP_ANALYST',
  //     },
  //     page: {
  //       itemPerPage,
  //       noPage,
  //     },
  //   },
  //   {
  //     enabled: isGetBcmSuccess,
  //   },
  // );

  const { data: documentList, isFetching: isGetDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      debtorId: debtorId ?? undefined,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
      module: 'MUP',
      ownership: DocumentTypeRequestDtoOwnershipEnum.MUP,
      process: 'MUP|MUP_ANALYST',
      // ownerId: bcmData?.bucketMaster,
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

  const tableUploadDocumentData = documentList?.contents;
  const tableUploadDocumentPage = documentList?.page;
  const isTableUploadDocumentLoading = isGetDocumentListLoading || !bucketMasterId;

  const { mutate: deleteDocument } = useDeleteDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const { data: confirmAnalystData } = useGetConfirmAnalyst({
    bucketMasterId,
    bucketProcessId: processId,
  });

  const { mutate: saveConfirmAnalyst } = useSaveConfirmAnalyst({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          handleBackToListPage();
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          handleBackToListPage();
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    if (confirmAnalystData) {
      setIsDocumentConfirmed(confirmAnalystData?.isAnalystConfirm);
    }
  }, [confirmAnalystData]);

  const handleDeleteDocument = (id: number) => {
    if (!canUpdate) return;

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId,
          module: _module,
          process,
          remarks: `Delete document ${id}`,
        });
        deleteDocument(
          {
            payload: {
              id,
            },
          }
        );
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus dokumen?',
      type: 'warning',
    });
  };

  const handleOpenAddDocument = () => {
    const createProps = {
      bucketMasterId: bucketMasterId,
      module: _module,
      process,
    };

    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, createProps);
  };

  const handleEditDocument = ({
    id,
    module,
    process,
    ownerId,
  }) => NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
    bucketMasterId: ownerId,
    id,
    module,
    process,
  });

  const actionOptions: TableHeader['options'] = () => {
    const actionTable = [
      {
        iconName: 'edit',
        isDisabled: (row) => !row.isEditable,
        onClick: (row) => handleEditDocument(row),
      },
      {
        iconName: 'preview-document', onClick: (data) =>
          window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
      },
      {
        iconName: 'download',
        onClick: (row) => handleDownload(row.id, row.fileName),
      },
      {
        iconName: 'delete',
        isDisabled: (row) => !row.isEditable,
        onClick: (row) => handleDeleteDocument(row.id),
      },
    ];
    return actionTable;
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: actionOptions,
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: _module,
            process,
          },
        });
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED },
      ],
    });
  };

  const handleSubmitConfirmAnalyst = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        saveConfirmAnalyst({
          action,
          analystId: bucketData?.analystId,
          bucketMasterId: bcmData?.bucketMaster,
          bucketProcessId: processId,
          comment: comment,
          isAnalystConfirm: isDocumentConfirmed,
          isPemda: isPemda,
          module: _module,
          process,
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSubmit = (action: string) => {
    if (!canUpdate) return;

    recordActivity({
      activity: ActivityType.SUBMIT,
      bucketProcessId: processId,
      module: _module,
      process,
      remarks: `Submit MUP Discussion with action ${action}`,
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: _module,
            process,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleSubmitApprove = (action: string) => {
    if (isPrefixAnalyst) {
      handleSubmitConfirmAnalyst(state?.userData?.user?.superior?.email ? 'SUBMIT' : 'COMPLETE');
    } else {
      handleSubmit(action);
    }
  };


  const handleBackToListPage = () => {
    router.push(mupAnalyst.LIST_PAGE);
  };

  const isSubmitDisabled = !isDoucmentAvailable || isDocumentConfirmed === null;
  const buttonDictionary = [
    CLOSE,
    DECLINE,
    RETURN_TO_STAFF,
    RETURN_TO_TL,
    RETURN_TO_MAKER,
    RETURN_TO_ANALYST,
    SUBMIT,
    APPROVE,
  ];
  const renderActionButtons = () => {
    if (JSON.stringify(actionButtons) === '{}') {
      return null;
    }

    let buttonContents = [];

    for (const key in actionButtons) {
      if (buttonDictionary.includes(key)) {
        const indexByKeyInButtonDictionary = buttonDictionary.indexOf(key);
        buttonContents[indexByKeyInButtonDictionary] = [key, actionButtons[key]];
      }
    }

    const buttonList = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              onClick={handleBackToListPage}
            >
              Close
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              onClick={() => handleSubmit(value)}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              onClick={() => handleSubmit(value)}
            >
              Return to TL
            </Button>
          );
        case RETURN_TO_MAKER:
          return (
            <Button
              color="darkBlue"
              onClick={() => handleSubmit(value)}
            >
              Return to Maker
            </Button>
          );
        case RETURN_TO_ANALYST:
          return (
            <Button
              color="info"
              onClick={() => handleSubmit(value)}
            >
              Return to Analyst
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmitApprove(value)}
            >
              Submit
            </Button>
          );
        case APPROVE:
          return (
            <Button
              color="success"
              disabled={isSubmitDisabled}
              onClick={() => handleSubmitApprove(value)}
            >
              Approve
            </Button>
          );
        case DECLINE:
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOnDecline}
            >
              Decline
            </Button>
          );
        default:
          break;
      }
    });

    return buttonList;
  };

  const callbackTableDocumentMUP = (params) => {
    if (params?.length > 0) {
      setIsDoucmentAvailable(true);
    } else {
      setIsDoucmentAvailable(false);
    }
  };

  return {
    _module,
    actionOptions,
    analystId,
    bucketMasterId,
    callbackTableDocumentMUP,
    canUpdate,
    canView,
    currentStaffName,
    documentList,
    handleBackToListPage,
    handleOpenAddDocument,
    isDocumentConfirmed,
    // isDocumentGroupLoading,
    isEnableConfirmation,
    isGetBcmSuccess,
    isGetDocumentListLoading,
    isTableUploadDocumentLoading,
    noPage,
    process,
    renderActionButtons,
    setIsDocumentConfirmed,
    setItemPerPage,
    setNoPage,
    tableHeader,
    tableUploadDocumentData,
    tableUploadDocumentPage,
    viewOnly,
  };
};

export default useMupDiscussion;
