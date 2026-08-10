import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  ASK_FOR_INFO,
  CANCELED,
  CLOSE,
  DECLINE,
  DPOP_DIVISION,
  MAX_STEP_PERCENTAGE,
  REJECTED,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { apuPpt } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetValidateResult from '../../../../hooks/services/useGetValidateResult';


import {
  FORWARD_SUBMIT_HIGH_RISK,
  FORWARD_TO_DK,
  FORWARD_TO_DPOP,
  listTitleModalSubmitBucket,
  tableHeaderChild,
  tableHeaderGrandChild,
  tableHeaderParent,
} from './CustomerDueDiligance.constants';
import useGetCustomerDueDataDelta from './hooks/useGetCustomerDueDataDelta';
import useGetCustomerDueDiligenceListChild from './hooks/useGetCustomerDueDiligenceListChild';
import useGetCustomerDueDiligenceRemark from './hooks/useGetCustomerDueDiligenceRemark';
import useSaveCustomerDueDiligenceRemark from './hooks/useSaveCustomerDueDiligenceRemark';

import type { TableHeaderVerification } from '../components/TableDocumentVerification/TableDocumentVerification.types';


const useCustomerDueDiligence = () => {
  const { processId } = useIdentity();
  const { viewOnly, setViewOnly } = useViewOnly();
  const router = useCustomRouter();
  const pathname = usePathname();
  const [{ stepper }] = useApp();
  const queryClient = useQueryClient();
  const {
    currentUserDivision,
    isRM,
    isTL,
    isKadiv,
    goToNextStep,
    actions,
    isBusinessDivision,
  } = useApuPptContext();
  const [act, setAct] = useState('');
  const { process } = useApuPpt();
  const { setDirtyMsg } = useContext(DirtyContext);
  const isDpopDivision = process === TypeProcess.APU_PPT_DPOP;

  const { control, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      remark: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, pathname]);
  const needCheckMaster = useMemo(() => {
    let checkMaster = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [actions]);

  const isAskforInfoKadiv = useMemo(() => {
    let askForInfoKadiv = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('COMPLETED_ASK_FOR_INFO')) {
      askForInfoKadiv = true;
    }
    return askForInfoKadiv;
  }, [actions]);

  const showTableUpload = useMemo(() => {
    let showTable = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('MAIN_TABLE_UPLOAD_DOCUMENT')) {
      showTable = true;
    }
    return showTable;
  }, [actions]);


  const isDisabledFromAction = useMemo(() => {
    let disabled = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('VIEW_ONLY')) {
      disabled = true;
    }
    return disabled;
  }, [actions]);

  const [isNextStep, setIsNextStep] = useState(false);

  const currentBucketStatus = stepper.from;
  const isAskForInfo = currentBucketStatus === 'ASK_FOR_INFO';

  const isDpop = currentUserDivision === DPOP_DIVISION;

  const isNoEditAskForInfoBusiness = isBusinessDivision && isAskForInfo;
  const submitDisabled = stepper.progress < MAX_STEP_PERCENTAGE;

  const currentProcess = pathname.split('/')[3];
  const listPagePathByCurrentProcess = `/loan-processing/apu-ppt/${currentProcess}`;
  const dynamicPathEditPage = `/loan-processing/apu-ppt/${currentProcess}/[processId]/customer-due-diligence/edit/[id]`;

  const buttonListTemplateByKey = [CLOSE, DECLINE, SAVE, 'SAVE_NEXT', RETURN_TO_STAFF, RETURN_TO_TL, SUBMIT, 'FORWARD_SUBMIT', 'FORWARD_SUBMIT_HIGH_RISK', 'NEXT'];
  const isStaffDpop = isRM && isDpopDivision;
  const isTLDpop = isTL && isDpopDivision;

  const generateRadioNormal = () => {

    if (isStaffDpop) {
      return [
        { label: 'Bisnis', value: 'ASK_FOR_INFO' },
        { label: 'TL', value: 'SUBMIT_ASK_FOR_INFO' }
      ];
    } else if (isTLDpop) {
      return [
        { label: 'Bisnis', value: 'ASK_FOR_INFO' },
        { label: 'Kadiv', value: 'SUBMIT_ASK_FOR_INFO' }
      ];
    }
  };

  const handleAskForInfo = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        let isCompleteEditAskForInfo = false;
        if (isAskforInfoKadiv) isCompleteEditAskForInfo = true;
        submitBucket({
          submitRequestDto: {
            action: isKadiv ? 'ASK_FOR_INFO' : radioValue,
            bucketProcessId: processId,
            comment,
            isCompleteEditAskForInfo,
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT_DPOP,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      ...(!isKadiv ? {
        radioLabel: 'Forward to:',
        radioOptions: generateRadioNormal(),
      } : {}),
    });
  };

  const renderActionButtons = () => {
    if (JSON.stringify(actions) === '{}') {
      return null;
    }

    let buttonContents = [];
    if (viewOnly && currentBucketStatus !== 'ASK_FOR_INFO') {
      buttonContents.push('NEXT');
    }

    for (const key in actions) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actions[key]];
      }
    }

    const buttonlist = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              color="error"
              onClick={handleButtonClose}
            >
              Close
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              disabled={submitDisabled}
              onClick={() => handleSubmit(value)}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              disabled={submitDisabled}
              onClick={() => handleSubmit(value)}
            >
              Return to TL
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              color="success"
              disabled={submitDisabled || isSubmitedDisabled}
              onClick={() => handleSubmit(value)}
            >
              {(isRM || isTL) ? 'Submit' : 'Approve'}
            </Button>
          );
        case 'FORWARD_SUBMIT':
          return (
            <Button
              color="success"
              disabled={submitDisabled || isSubmitedDisabled}
              onClick={handleSubmitAskForInfo}
            >
              {isRM ? 'Submit' : 'Approve'}
            </Button>
          );
        case 'FORWARD_SUBMIT_HIGH_RISK':
          return (
            <Button
              color="success"
              disabled={submitDisabled || isSubmitedDisabled}
              onClick={() => {
                isKadiv ? handleSubmit('SUBMIT') : handleSubmitAskForInfo();
              }}
            >
              Submit
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
        case SAVE:
          return (
            <Button onClick={() => handleOnSave()}>
              Save
            </Button>
          );
        case 'SAVE_NEXT':
          return (
            <>
              <Button
                disabled={isAutoSaveFetching}
                onClick={() => {
                  handleOnSave();
                }}
              >
                {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => {
                  setIsNextStep(true);
                  handleOnSave();
                }}
              >
                Next
              </Button>
            </>

          );
        case 'NEXT':
          return (
            <Button onClick={goToNextStep}>
              Next
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              onClick={handleAskForInfo}
            >
              Ask For Info
            </Button>
          );
        default:
          break;
      }
    });

    return buttonlist;
  };

  const handleButtonClose = () => {
    router.push(listPagePathByCurrentProcess);
  };

  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        setAct(radioValue);
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.APU_PPT,
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

  const {
    data: bucketDetail,
    isLoading: isLoadingBucket,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  const isSubmitedDisabled = validateResult?.content?.isSubmitButtonEnable === false;
  const warningBoxMassage = validateResult?.content?.result;

  const { data, isLoading } = useGetCustomerDueDiligenceListChild({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { data: dataDelta } = useGetCustomerDueDataDelta({
    bucketProcessId: bucketDetail?.bucketParentId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT,
  }, {
    enabled: !!bucketDetail?.bucketParentId && isDpop && needCheckMaster,
  });


  const listDiff = dataDelta?.differencesData?.length > 0 ?
    dataDelta?.differencesData?.map((item) => item?.docId) : [];


  const tableData = data?.map((item) => ({
    ...item,
    document: item.document ?? '-',
    id: item.id ?? '-',
  }));

  const { data: customerRemarkData, isLoading: isCustomerRemarkLoading } = useGetCustomerDueDiligenceRemark({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  useEffect(() => {
    if (!isCustomerRemarkLoading) {
      setValue('remark', customerRemarkData?.remark);
    }
  }, [customerRemarkData]);

  useEffect(() => {
    if (isDisabledFromAction) setViewOnly(true);
  }, [isDisabledFromAction]);

  const { mutate: saveCustomerDueDiligence } = useSaveCustomerDueDiligenceRemark({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {
          if (isNextStep) goToNextStep();
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });

    },
  });

  const hasInvalidAssessmentOrVerif = (data, key) => {
    let result = false;
    for (const item of data) {
      if (item.isEditable === true && item[key] === null) {
        result = false;
      } else {
        result = true;
      }

      if (item.childList && item.childList.length > 0) {
        hasInvalidAssessmentOrVerif(item.childList, key);
      }
    }
    return result;
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketProcessId: processId,
      module: TypeModule.APU_PPT,
      process,
      remark: watch('remark'),
    });
  }, [processId, process, watch]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !isDisabledFromAction,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveCddRemark',
  });


  const handleOnSave = (resultVal?: boolean) => {
    if (viewOnly) return goToNextStep();
    const isResult = resultVal ? resultVal : isDpop ?
      hasInvalidAssessmentOrVerif(data, 'verificationResult')
      :
      hasInvalidAssessmentOrVerif(data, 'assessmentResult');
    const message = isDpop ? 'VERIFICATION RESULT' : 'ASSESSMENT RESULT';

    if (isResult) {
      saveCustomerDueDiligence({
        bucketProcessId: processId,
        module: TypeModule.APU_PPT,
        process,
        remark: watch('remark'),
      });

    } else {
      showNiceModalV2({
        cancelText: 'Batal',
        onSubmit: () => handleOnSave(true),
        submitText: 'Simpan',
        title: `${message} ada yang belum terisi, tetap simpan perubahan?`,
        type: 'warning',
      });
    }

  };

  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      const title = act?.length > 0 ? listTitleModalSubmitBucket?.find((item) => item?.action === act)?.title : 'Data berhasil disimpan';
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      if (!(actions?.hasOwnProperty(FORWARD_SUBMIT_HIGH_RISK) && isKadiv)) {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      }
      showNiceModalV2({
        onClose: () => {
          router.push(listPagePathByCurrentProcess);
          setAct('');
        },
        title: title,
        type: 'success',
      });
    },
  });

  const hasForwardSubmitHighRisk = actions?.hasOwnProperty(FORWARD_SUBMIT_HIGH_RISK);

  const generateRadioOptions = () => {
    if (isRM) {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'TL',
          value: SUBMIT,
        },
      ];
    } else if (isTL) {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'KADIV',
          value: SUBMIT,
        },
      ];
    } else {
      return [
        {
          label: hasForwardSubmitHighRisk ? 'DK' : 'DPOP',
          value: hasForwardSubmitHighRisk ? FORWARD_TO_DK : FORWARD_TO_DPOP,
        },
        {
          label: 'TL',
          value: SUBMIT,
        },
      ];
    }
  };

  const handleSubmitAskForInfo = () => {
    let isCompleteEditAskForInfo = false;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment, radioValue }) => {
        if (isAskforInfoKadiv) isCompleteEditAskForInfo = true;
        submitBucket({
          submitRequestDto: {
            action: isKadiv ? 'ASK_FOR_INFO' : radioValue,
            bucketProcessId: processId,
            comment,
            isCompleteEditAskForInfo,
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT,

          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Forward to:',
      radioOptions: generateRadioOptions(),
    });
  };

  const handleSubmit = (action: string) => {
    let isCompleteEditAskForInfo = false;
    if (isAskforInfoKadiv && isBusinessDivision && isKadiv && action === 'SUBMIT') isCompleteEditAskForInfo = true;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {

        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            isCompleteEditAskForInfo,
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const generateTableHeader = useMemo(() => {
    const tableArray = [];
    const isApdb = processId?.split('-')[0] === 'APDP';
    if (isApdb) {
      tableArray.push({
        key: 'assessment',
        label: 'Assessment Summary',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.assessmentSummary ? 'Ya' : row.assessmentSummary === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: {
          width: '10%',
        },
      },
      {
        key: 'verification',
        label: 'Verification Summary',
        render: (row) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.verificationSummary ? 'Ya' : row.verificationSummary === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: {
          width: '10%',
        },
      });
    } else {
      tableArray.push({
        key: 'assessmentSummary',
        label: 'Assessment Summary',
        render: (row: typeof tableData[0]) => (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {!row?.isEditable ? '' : row.assessmentSummary ? 'Ya' : row.assessmentSummary === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ),
        sx: {
          width: '10%',
        },
      });
    }
    return tableArray;
  }, [processId]);


  const gotoEdit = (row) => {
    const editPath = replacePath(dynamicPathEditPage, { id: row.id, processId });
    router.push(`${editPath}?ownerId=${row?.docId}`);
  };
  const gotoDetail = (row) => {
    const detailPath = replacePath(
      apuPpt.CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE, { id: row?.id, module: currentProcess, processId }
    );
    router.push(setPreviewPage(`${detailPath}?ownerId=${row?.docId}`));
  };

  const actionTable = useMemo(() => {
    const actArr = [];
    if (viewOnly || isDisabledFromAction) {
      actArr.push({
        iconName: 'detail',
        onClick: (row) => {
          gotoDetail(row);
        },
        sx: { width: '5.5vw' },

      });
    } else {
      actArr.push({
        iconName: 'edit',
        isDisabled: (data) => !data?.isEditable || viewOnly,
        onClick: (row) => {
          gotoEdit(row);
        },
        sx: { width: '5.5vw' },
      },
      );
    }
    return actArr;

  }, [viewOnly, isDisabledFromAction]);

  const tableHeader: Array<TableHeaderVerification> = [
    ...tableHeaderParent,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: {
        width: '8%',
      },
      type: 'action',
    },
  ];

  const tableHeadChildVerif: Array<TableHeaderVerification> = [
    ...tableHeaderChild,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: {
        width: '8%',
      },
      type: 'action',
    },
  ];
  const tableHeadGrandChildVerif: Array<TableHeaderVerification> = [
    ...tableHeaderGrandChild,
    ...generateTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: actionTable,
      sx: {
        width: '8%',
      },
      type: 'action',
    },
  ];

  return {
    control,
    isDisabledFromAction,
    isLoading,
    isLoadingBucket,
    isSubmitedDisabled,
    listDiff,
    process,
    renderActionButtons,
    showTableUpload,
    tableData,
    tableHeadChildVerif,
    tableHeadGrandChildVerif,
    tableHeader,
    warningBoxMassage,
  };
};

export default useCustomerDueDiligence;
