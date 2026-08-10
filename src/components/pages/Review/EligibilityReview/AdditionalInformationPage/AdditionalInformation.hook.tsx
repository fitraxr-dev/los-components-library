import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { TableCell, TableRow } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { EDIT, roles, SUBMIT } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import {
  useEligibilityReviewContext,
  EligibilityReviewContext,
} from '@/components/layouts/EligibilityReviewLayout/EligibilityReview.context';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import TextStyle from '@/components/shared/TextStyle';


import { useEligibilityReviewAccess } from '../hooks/useEligibilityReviewAccess';

import { ListSuccessSubmit } from './AdditionalInformation.constants';
import useGetAdditionalInformationById from './hooks/useGetAdditionalInformationById';
import useSaveAdditionalInformation from './hooks/useSaveAdditionalInformation';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useAdditionalInformation = () => {
  const { processId }: { processId: string } = useParams();
  const [{ currentRole, stepper }] = useApp();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [isIconEdit, setIsIconEdit] = useState<boolean>(false);
  const { viewOnly } = useViewOnly();
  const [appState] = useApp();
  const path = usePathname();
  const [openedCollabsible, setOpenedCollabsible] = useState([]);
  const [state] = useContext(EligibilityReviewContext);
  const { goToNextStep } = useEligibilityReviewContext();
  const actionButtons = state?.actionButtons;
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const [disclaimer, setDisclaimer] = useState('');
  const isStaff = currentRole?.includes(roles.RM);
  const isKadiv = currentRole?.includes(roles.KADIV);
  const isTL = currentRole?.includes(roles.TL);
  const isMaker = currentRole?.includes(roles.MAKER);
  const { recordActivity } = useRecordLog();
  const [containerAdditionalInformation, setContainer] = useState(null);
  const { redirectToFromPage } = useNavigationFromPage();

  const {
    hasAnyCreateAccess: canCreateEligibilityReview,
    hasAnyUpdateAccess: canUpdateEligibilityReview,
  } = useEligibilityReviewAccess();

  let isEdit = false;
  const modifiedButtonObj = {};

  for (const key in actionButtons) {
    if (key === 'ASK_FOR_INFO' && canUpdateEligibilityReview) {
      modifiedButtonObj['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key === 'APPROVE_ASK_FOR_INFO' && canUpdateEligibilityReview) {
      modifiedButtonObj['APPROVE_ASK_FOR_INFO'] = 'SUBMIT';
    } else if (key.includes('EDIT') && canUpdateEligibilityReview) {
      isEdit = true;
    } else if (canUpdateEligibilityReview) {
      modifiedButtonObj[key] = actionButtons[key];
    }
  }

  const buttonOrder = ['RETURN_TO_STAFF', 'RETURN_TO_TL', 'RETURN_TO_MAKER', 'NO_CHANGE', 'ASK_FOR_INFO', 'SUBMIT', 'APPROVE_ASK_FOR_INFO', 'SUBMIT_ASK_FOR_INFO_MODAL', 'APPROVE'];

  const formattedActionButton = {};
  buttonOrder.forEach((button) => {
    if (modifiedButtonObj.hasOwnProperty(button)) {
      formattedActionButton[button] = modifiedButtonObj[button];
    }
  });

  const formatRadioBtn = () => {
    let radioButtons = [
      { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
      { label: isMaker ? 'Checker' : 'TL', value: isMaker ? 'ASK_FOR_INFO_CHECKER' : 'ASK_FOR_INFO_TL' }
    ];
    if (isTL) {
      radioButtons = [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ];
    }
    return radioButtons;
  };

  const {
    data: additionalInformationDetail,
    isFetching: isFetchLoading,
  } = useGetAdditionalInformationById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

  const debtorInstitutionType = debtorInfoData?.institutionType;
  const isPemda = DebtorNamesetResponseDtoRegionalGovernEnum
    ? Object.values(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
      debtorInstitutionType as DebtorNamesetResponseDtoRegionalGovernEnum)
    : false;

  useEffect(() => {
    const currentDisclaimer = disclaimer || '';
    const originalDisclaimer = additionalInformationDetail?.disclaimer || '';
    const isDisclaimerChanged = currentDisclaimer !== originalDisclaimer;

    if (isDisclaimerChanged) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [disclaimer, additionalInformationDetail?.disclaimer, setDirtyMsg]);

  useEffect(() => {
    if (additionalInformationDetail) {
      const disclaimerValue = additionalInformationDetail?.disclaimer === 'null'
        ? ''
        : additionalInformationDetail?.disclaimer;

      setDisclaimer(disclaimerValue);

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DEPI,
        remarks: 'view additional information detail page',
      });
    }
  }, [additionalInformationDetail, processId, recordActivity]);

  const { isPending: isSaveLoading, mutate: saveAdditionalInformation } = useSaveAdditionalInformation();

  const { isSuccess: submitBucketIsSuccess, mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error) => {
        const errorMessage = error?.message;
        showNiceModalV2({
          title: errorMessage,
          type: 'error',
        });
      },
      onSuccess: (data, variables) => {
        const action = variables.submitRequestDto.action;
        let activityType = ActivityType.SUBMIT;
        let remarks = 'submit additional information';

        if (action === ActivityType.APPROVE || action.includes(ActivityType.APPROVE)) {
          activityType = ActivityType.APPROVE;
          remarks = 'approve additional information';
        } else if (action === ActivityType.RETURN_TO_STAFF || action === ActivityType.RETURN_TO_TL) {
          activityType = ActivityType.REJECT;
          remarks = `reject and return additional information (${action})`;
        } else if (action === ActivityType.NO_CHANGE) {
          activityType = ActivityType.SUBMIT;
          remarks = 'submit additional information with no change';
        } else if (action.includes(ActivityType.ASK_FOR_INFO)) {
          activityType = ActivityType.SUBMIT;
          remarks = `ask for information: ${action}`;
        } else if (action === 'EDIT') {
          activityType = ActivityType.EDIT;
          remarks = 'initiate edit additional information';
        }

        recordActivity({
          activity: activityType,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(variables),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DEPI,
          remarks: remarks,
        });

        queryClient.invalidateQueries({ queryKey: ['bucket-list']});
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        if (action === 'EDIT') {
          showNiceModalV2({
            title: '',
            type: 'success',
          });
          window.location.reload();
        } else {
          showNiceModalV2({
            onClose: () => handleBackToTable(),
            title: 'Data berhasil dikirim',
            type: 'success',
          });
        }
      },
    }
  );

  const handleSaveAdditionalInfo = (blob: Blob) => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'initiate save additional information',
    });

    if (viewOnly) {
      goToNextStep();
    } else {
      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        disclaimer: disclaimer,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DEPI,
      }, {
        onError: () => {
          setDirtyMsg(undefined);
          showNiceModalV2({ type: 'error' });
        },
        onSuccess: (data) => {
          recordActivity({
            activity: ActivityType.ADD,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(data),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
            remarks: 'save additional information',
          });

          setDirtyMsg(undefined);
          showNiceModalV2({ type: 'success' });
        },
      });
      setDirtyMsg(undefined);
    }
  };

  const handleSubmit = (action: string) => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: `open submit modal for action: ${action}`,
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleNoChange = () => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'initiate no change action',
    });
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: ActivityType.NO_CHANGE,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleAskForInfo = () => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'open ask for info modal',
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: formatRadioBtn(),
    });
  };

  const handleApproveAskForInfo = () => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'open approve ask for info modal',
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ],
    });
  };

  const handleBackToTable = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'close additional information page',
    });
    if (redirectToFromPage()) return;

    const pathModule = path?.split('/')[4];
    ListSuccessSubmit.filter((item) => {
      if ((appState?.currentRole?.includes(item.role) && item.module === pathModule) && !isIconEdit) {
        router.replace(item.url);
      }
    });
  };


  const saveThenOpenComment = async (action: string) => {
    if (!canUpdateEligibilityReview) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: `initiate save before action: ${action}`,
    });

    try {
      const blob = await convertToDocx(containerAdditionalInformation);

      saveAdditionalInformation({
        bucketProcessId: String(processId),
        description: blob,
        disclaimer: disclaimer,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DEPI,
      }, {
        onError: () => {
          showNiceModalV2({
            title: 'Data Gagal disimpan',
            type: 'error',
          });
        },
        onSuccess: (data) => {
          recordActivity({
            activity: ActivityType.ADD,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(data),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
            remarks: 'save additional information (save before submit)',
          });

          setDirtyMsg(undefined);
          queryClient.invalidateQueries({
            queryKey: ['reviewer-depi-step', { bucketProcessId: processId }],
          });
          queryClient.invalidateQueries({
            queryKey: ['mip-additional-information', { bucketProcessId: processId }],
          });


          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            onSave: ({ comment }) => {
              const submitPayload: any = {
                action: action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DEPI,
              };
              if (action === SUBMIT && isKadiv) {
                submitPayload.debtorName = `${debtorInfoData?.institutionTypeLabel || ''} ${debtorInfoData?.debtorName || ''}`.trim(),
                submitPayload.isPemda = isPemda;
              }
              submitBucket({
                submitRequestDto: submitPayload,
              });
              closeNiceModal(MODAL.GLOBAL.COMMENT);
            },
          });
        },
      });
    } catch (error) {
      showNiceModalV2({
        title: 'Gagal mengkonversi dokumen. Silakan coba lagi',
        type: 'error',
      });
    }
  };

  const handleButton = (key: string, value: string) => {
    if (!canUpdateEligibilityReview) return null;
    const isProgressComplete = stepper?.progress === 100;


    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
            disabled={!isProgressComplete}
          >
            Submit
          </Button>
        );
      case 'RETURN_TO_STAFF':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="darkBlue"
          >
            Return to Staff
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="info"
          >
            Return to Maker
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="info"
          >
            Return to TL
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={handleApproveAskForInfo}
            variant="contained"
            color="warning"
          >
            Submit ask for info
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={handleApproveAskForInfo}
            variant="contained"
            color="warning"

          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="warning"

          >
            Submit ask for info
          </Button>
        );
      case 'NO_CHANGE':
        return (
          <Button
            onClick={() => handleNoChange()}
            variant="contained"
            color="orange"
          >
            No Changes
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleAskForInfo}
            variant="contained"
            color="warning"
          >
            Ask for info
          </Button>
        );
    }
  };

  const handleEdit = () => {
    if (!canUpdateEligibilityReview) return;

    setIsIconEdit(true);
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
      remarks: 'open edit confirmation modal',
    });

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: EDIT,
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DEPI,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan dirubah dengan Penerbitan Digital Memo yang baru,apakah anda yakin?',
    });
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'type',
      label: 'Group  Dokumen',
      render: (data) => {
        return (
          <>
            <TextStyle variant="body4">{data.shareholderName}</TextStyle>
            {data.subItem && (
              <Button
                variant="text"
                sx={{
                  minWidth: 0,
                  padding: 1,
                }}
                onClick={() => {
                  if (openedCollabsible.includes(data?.id)) {
                    setOpenedCollabsible(openedCollabsible.filter((id) => id !== data?.id));
                  } else {
                    setOpenedCollabsible([data?.id]);
                  }
                }}
              >
              </Button>
            )}
          </>
        );
      },
    },
    {
      key: 'shareholderName',
      label: 'Jenis Dokumen',
    },
    {
      key: 'shares',
      label: 'Nama Dokumen',
    },
    {
      key: 'percentage',
      label: 'Nomor Dokumen',
    },
    {
      key: 'beneficialOwner',
      label: 'Tanggal Dokumen',
    },
    {
      key: 'beneficialOwner',
      label: 'Uploaded By',
    },
    {
      key: 'beneficialOwner',
      label: 'Divisi',
    },
    {
      key: 'beneficialOwner',
      label: 'Uploaded Date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'edit', onClick: () => { } },
        { iconName: 'download', onClick: () => { } },
        { iconName: 'delete', onClick: () => { } }
      ],
      sx: { minWidth: '7.5vw' },
      type: 'action',
    },
  ];

  const renderTableInBetweenRow = (data, depth = 0) => {
    return openedCollabsible.includes(data?.id)
      && data?.subItem?.map((item) => (
        <>
          <TableRow>
            <TableCell />
            <TableCell>
              <TextStyle sx={{ ml: 2 + (depth * 2) }} variant="body4">{item.type}</TextStyle>
              {item.subItem && (
                <IconButton
                  iconName={openedCollabsible.includes(item?.id) ? 'arrow-square-up' : 'arrow-square-down'}
                  onClick={() => {
                    if (openedCollabsible.includes(item?.id)) {
                      setOpenedCollabsible(openedCollabsible.filter((id) => id !== item?.id));
                    } else {
                      setOpenedCollabsible([...openedCollabsible, item?.id]);
                    }
                  }}
                />
              )}
            </TableCell>
            <TableCell>
              <TextStyle variant="body4">{item.shareholderName}</TextStyle>
            </TableCell>
            <TableCell>
              <TextStyle variant="body4">{item.shares}</TextStyle>
            </TableCell>
            <TableCell>
              <TextStyle variant="body4">{item.percentage}</TextStyle>
            </TableCell>
            <TableCell>
              <TextStyle variant="body4">{item.beneficialOwner}</TextStyle>
            </TableCell>
            <TableCell>
              <IconButton iconName="add" onClick={() => { }} />
              <IconButton iconName="edit" onClick={() => { }} />
              <IconButton iconName="delete" onClick={() => { }} />
            </TableCell>
          </TableRow>
          {renderTableInBetweenRow(item, depth + 1)}
        </>
      ));
  };

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(containerAdditionalInformation);

    return {
      bucketProcessId: String(processId),
      description: blob,
      disclaimer: disclaimer,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    };
  }, [containerAdditionalInformation, processId, disclaimer]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdateEligibilityReview && !viewOnly && !!additionalInformationDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.additionalInformation.save',
  });

  return {
    additionalInformationDetail,
    canCreateEligibilityReview,
    canUpdateEligibilityReview,
    containerAdditionalInformation,
    disclaimer,
    formattedActionButton,
    handleBackToTable,
    handleButton,
    handleEdit,
    handleSaveAdditionalInfo,
    isAutoSaveFetching,
    isEdit,
    isFetchLoading,
    isSaveLoading,
    isStaff,
    renderTableInBetweenRow,
    setContainer,
    setDisclaimer,
    submitBucketIsSuccess,
    tableHeader,
    viewOnly,
  };
};
