'use client';
import React, { useContext, useState, useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ESDD } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';

import { useESDDAccess } from '../hooks/useESDDAccess';

import useGetSummary from './hooks/useGetSummary';
import useSaveSummary from './hooks/useSaveSummary';


const useSummaryPage = () => {
  const { processId }: { processId: string } = useParams();
  const [container, setContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const [{ currentRole }] = useApp();
  const { redirectToFromPage } = useNavigationFromPage();
  const { data } = useGetSummary({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DELST,
  });

  const [state] = useApp();
  const { stepper } = state;
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const path = usePathname();
  const actionButtons = stepper.steps.filter((dt) => dt.urlPath === getLastPath(path))[0]?.action;
  const isTL = currentRole?.includes(roles.TL);
  const isMaker = currentRole?.includes(roles.MAKER);
  const {
    hasAnyUpdateAccess,
  } = useESDDAccess();

  const canUpdateSummary = hasAnyUpdateAccess();

  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
      });
    }
  }, [data, processId, recordActivity]);

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];


  const modifiedObject = {};
  const sortArray = [
    'SAVE',
    'RETURN_TO_STAFF',
    'RETURN_TO_TL',
    'RETURN_TO_MAKER',
    'APPROVE_ASK_FOR_INFO',
    'SUBMIT_ASK_FOR_INFO_MODAL',
    'ASK_FOR_INFO',
    'NO_CHANGE',
    'APPROVE',
    'SUBMIT',
  ];
  let isEdit = false;

  // Iterate through the keys of the original object
  for (const key in actionButtons) {
    if (key.includes('TABLE_UPLOAD_DOCUMENT')) {
      continue;
    }

    if (!canUpdateSummary) continue;

    if (key.includes('APPROVE_ASK_FOR_INFO')) {
      if (actionButtons['APPROVE_ASK_FOR_INFO_BUSINESS']) {
        modifiedObject['APPROVE_ASK_FOR_INFO_MODAL'] = 'APPROVE_ASK_FOR_INFO_MODAL';
      } else {
        modifiedObject['APPROVE_ASK_FOR_INFO'] = actionButtons['SUBMIT'];
      }
    } else if (key.includes('ASK_FOR_INFO_TL') || key.includes('ASK_FOR_INFO_BUSINESS')) {
      modifiedObject['ASK_FOR_INFO'] = 'ASK_FOR_INFO';
    } else if (key.includes('EDIT')) {
      isEdit = true;
    } else if (['SUBMIT', 'APPROVE', 'RETURN_TO_STAFF', 'RETURN_TO_TL', 'RETURN_TO_MAKER', 'NO_CHANGE', 'SUBMIT_ASK_FOR_INFO_MODAL'].includes(key)) {
      modifiedObject[key] = actionButtons[key];
    }
  }

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
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

  const { mutate: saveSummary } = useSaveSummary();

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error) => {
        const errorMessage = error?.message;
        showNiceModalV2({ title: errorMessage, type: 'error' });
      },
      onSuccess: (data, variables) => {
        const action = variables.submitRequestDto.action;

        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        if (action === 'EDIT') {
          showNiceModalV2({
            title: '',
            type: 'success',
          });
          window.location.reload();
        } else {

          showNiceModalV2({
            onClose: () => {
              const pathArr = path.split('/');
              pathArr.splice(-2, 2);
              const url = pathArr.join('/');
              router.push(url);
            },
            title: 'Data berhasil di simpan',
            type: 'success',
          });
        }
      },
    }
  );

  const saveThenOpenComment = async (action: string) => {
    if (!canUpdateSummary) return;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: `initiate save before action: ${action}`,
    });

    try {
      const blob = await convertToDocx(container);

      saveSummary({
        bucketProcessId: processId,
        description: blob,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
      }, {
        onError: () => {
          showNiceModalV2({
            title: 'Data Gagal disimpan',
            type: 'error',
          });
        },
        onSuccess: (data) => {
          recordActivity({
            activity: ActivityType.SAVE,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(data),
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
            remarks: 'summary saved (save before submit)',
          });

          setDirtyMsg(undefined);
          queryClient.invalidateQueries({
            queryKey: ['bucket-stepper', { bucketProcessId: processId }],
          });
          queryClient.invalidateQueries({
            queryKey: ['get-summary', { bucketProcessId: processId }],
          });

          NiceModal.show(MODAL.GLOBAL.COMMENT, {
            onSave: ({ comment }) => {

              submitBucket({
                submitRequestDto: {
                  action: action,
                  bucketProcessId: processId,
                  comment,
                  module: TypeModule.MIP_REVIEW,
                  process: TypeProcess.REVIEWER_DELST,
                },
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
    if (!canUpdateSummary) return null;
    const isProgressComplete = stepper?.progress === 100;


    switch (key) {
      case 'SUBMIT':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.SUBMIT,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Submit button clicked',
              });
              saveThenOpenComment(value);
            }}
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
            onClick={() => {
              recordActivity({
                activity: ActivityType.RETURN_TO_STAFF,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Return to Staff button clicked',
              });
              handleSubmit(value);
            }}
            variant="contained"
            color="darkBlue"
          >
            Return to Staff
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: isTL ? ActivityType.SUBMIT : ActivityType.APPROVE,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Approve button clicked',
              });
              saveThenOpenComment(value);
            }}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'RETURN_TO_TL':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.RETURN_TO_TL,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Return to TL button clicked',
              });
              handleSubmit(value);
            }}
            variant="contained"
            color="info"
          >
            Return to TL
          </Button>
        );
      case 'RETURN_TO_MAKER':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.RETURN_TO_MAKER,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Return to Maker button clicked',
              });
              saveThenOpenComment(value);
            }}
            variant="contained"
            color="info"
          >
            Return to Maker
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.ASK_FOR_INFO,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Approve ask for info modal button clicked',
              });
              handleApproveAskForInfo();
            }}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO_MODAL':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.ASK_FOR_INFO,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Submit ask for info modal button clicked',
              });
              handleApproveAskForInfo();
            }}
            variant="contained"
            color="warning"
          >
            Submit ask for info
          </Button>
        );
      case 'APPROVE_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.ASK_FOR_INFO,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Approve ask for info button clicked',
              });
              saveThenOpenComment(value);
            }}
            variant="contained"
            color="warning"
          >
            Approve ask for info
          </Button>
        );
      case 'SUBMIT_ASK_FOR_INFO':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.ASK_FOR_INFO,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Submit ask for info button clicked',
              });
              saveThenOpenComment(value);
            }}
            variant="contained"
            color="warning"
          >
            Submit ask for info
          </Button>
        );
      case 'NO_CHANGE':
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.NO_CHANGE,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'No Changes button clicked',
              });
              handleNoChange();
            }}
            variant="contained"
            color="orange"
          >
            No Changes
          </Button>
        );
      default: {
        return (
          <Button
            onClick={() => {
              recordActivity({
                activity: ActivityType.ASK_FOR_INFO,
                bucketProcessId: processId,
                module: TypeModule.MIP_REVIEW,
                process: TypeProcess.REVIEWER_DELST,
                remarks: 'Ask for info button clicked',
              });
              handleAskForInfo();
            }}
            variant="contained"
            color="warning"
          >
            Ask for info
          </Button>
        );
      }
    }
  };


  const handleApproveAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        recordActivity({
          activity: 'APPROVE_ASK_FOR_INFO',
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: `Approve ask for info: ${radioValue}, Comment: ${comment} `,
        });
      },
      radioLabel: 'Forward to:',
      radioOptions: [
        { label: 'Business', value: 'ASK_FOR_INFO_BUSINESS' },
        { label: 'Kadiv', value: 'SUBMIT' }
      ],
    });

  };


  const handleSaveKesimpulan = (blob: Blob) => {
    recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'Save summary button clicked',
    });

    saveSummary({
      bucketProcessId: processId,
      description: blob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
    }, {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        setDirtyMsg(undefined);
        showNiceModalV2({ title: 'Data berhasil di simpan', type: 'success' });

        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(data?.content),
          changeBefore: JSON.stringify(data?.content),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: 'Summary kesimpulan saved',
        });
      },
    });
  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        }, {});
        closeNiceModal(MODAL.GLOBAL.COMMENT);

        recordActivity({
          activity: ActivityType.ASK_FOR_INFO,
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: `Ask For Info: ${radioValue}, Comment: ${comment} `,
        });
      },
      radioLabel: 'Forward to:',
      radioOptions: formatRadioBtn(),
    });
  };

  const handleNoChange = () => {

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: ActivityType.NO_CHANGE,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };
  const handleSubmit = (action: string) => {

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        recordActivity({
          activity: action,
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: `Action: ${action}, Comment: ${comment} `,
        });
      },
    });

  };

  const handleEdit = () => {
    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'Edit button clicked - showing confirmation modal',
    });

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DELST,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);

        recordActivity({
          activity: ActivityType.EDIT,
          bucketProcessId: processId,
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DELST,
          remarks: 'Edit digital memo confirmed and submitted',
        });
      },
      title: 'DATA sebelumnya akan dirubah dengan Penerbitan Digital Memo yang baru,apakah anda yakin?',
    });

  };

  const handleClose = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
      remarks: 'close  Summary page',
    });
    if (redirectToFromPage()) return;

    router.push(replacePath(ESDD.BASE_PATH, { module: moduleIndex }));
  };

  const renderActionButtons =
    sortedObject
      ? Object.entries(sortedObject).map(([key, value]: [string, string]) => (
        <React.Fragment key={key}>
          {handleButton(key, value)}
        </React.Fragment>
      ))
      : null;

  const autoSavePayload = useMemo(() => async () => {

    const blob = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: blob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdateSummary && !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.summary.save',
  });

  return {
    canUpdateSummary,
    container,
    data,
    handleAskForInfo,
    handleButton,
    handleClose,
    handleEdit,
    handleSaveKesimpulan,
    handleSubmit,
    isAutoSaveFetching,
    isEdit,
    modifiedObject,
    renderActionButtons,
    setContainer,
    theme,
    viewOnly,
  };
};

export default useSummaryPage;
