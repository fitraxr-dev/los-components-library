import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  APPROVE_ASK_FOR_INFO,
  ASK_FOR_INFO,
  CLOSE,
  DPOP_DIVISION,
  MAX_STEP_PERCENTAGE,
  RETURN_TO_STAFF,
  RETURN_TO_STAFF_DPOP,
  RETURN_TO_TL,
  RETURN_TO_TL_DPOP,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailNotes from '@/hooks/services/mip/apuppt/useGetDetailNotes';
import useSaveNotes from '@/hooks/services/mip/apuppt/useSaveNotes';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useSubmitNewWorkflow from '@/hooks/services/useSubmitNewWorkflow';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';

import useGetConfirmationHistory from '../components/ConfirmationLatest/hooks/useGetConfirmationHistory';


const useNotes = () => {
  const theme = useTheme();
  const [{ stepper }] = useApp();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { viewOnly } = useViewOnly();
  const { currentUserDivision, currentListPage, actions, isKadiv, isRM, isTL, isBusinessDivision } = useApuPptContext();
  const [container, setContainer] = useState(null);
  const [selectedCDD, setSelectedCDD] = useState('');
  // jika muncul status ini dari stepper btn nya always enabled gak perlu ngecheck progress
  const statusAskForInfo = ['ASK_FOR_INFO_WAITING_APPROVAL_TL_DPOP', 'ASK_FOR_INFO_WAITING_APPROVAL_KADIV_DPOP', 'ASK_FOR_INFO_RETURN_TO_TL_DPOP'];

  const { setDirtyMsg } = useContext(DirtyContext);
  const currentBucketStatus = stepper.from;

  const isDpop = currentUserDivision === DPOP_DIVISION;
  const isStaffDpop = isRM && isDpop;
  const isTLDpop = isTL && isDpop;
  const isKadivDpop = isKadiv && isDpop;
  const isEditable = stepper.steps.find((step) => step.key === 'notes')?.enable;


  const isEnabled = useMemo(() => {
    let enabled = false;
    const bucketId = processId?.split('-')[0];
    const isApdp = bucketId === 'APDP';
    if (isApdp && !viewOnly) enabled = true;

    return enabled;
  }, [processId, viewOnly]);


  const isAskforInfoKadiv = useMemo(() => {
    let askForInfoKadiv = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('COMPLETED_ASK_FOR_INFO')) {
      askForInfoKadiv = true;
    }
    return askForInfoKadiv;
  }, [actions]);


  const { data } = useGetConfirmationHistory({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT_DPOP,
  }, {
    enabled: isEnabled,
  });


  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
  });

  const { data: validateResult } = useGetValidateResult({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: !!bucketDetail?.debtorId,
  });

  const isCompletedStepper = stepper?.progress === MAX_STEP_PERCENTAGE;
  const isSubmitedEnable = validateResult?.content?.isSubmitButtonEnable && isCompletedStepper;

  const { data: detailNotesData, isLoading: isDetailNotesLoading } = useGetDetailNotes({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT_DPOP,
  });

  const { control, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      cddImplementationRemark: detailNotesData?.cddImplementationRemark || '',
      eddImplementationRemark: detailNotesData?.eddImplementationRemark || '',
      simpleCddImplementationRemark: detailNotesData?.simpleCddImplementationRemark || '',
    },
    mode: 'onChange',
  });

  // Set form values when detailNotesData loads
  useEffect(() => {
    if (detailNotesData) {
      setValue('eddImplementationRemark', detailNotesData.eddImplementationRemark || '');
      setValue('cddImplementationRemark', detailNotesData.cddImplementationRemark || '');
      setValue('simpleCddImplementationRemark', detailNotesData.simpleCddImplementationRemark || '');
    }
  }, [detailNotesData, setValue]);

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, pathname]);

  const cddImplementationData = [
    { id: 'eddImplementationRemark', label: 'Enhanced Due Diligence (EDD)', remark: detailNotesData?.eddImplementationRemark, value: 'EDD' },
    { id: 'cddImplementationRemark', label: 'Customer Due Diligence (CDD)', remark: detailNotesData?.cddImplementationRemark, value: 'CDD' },
    { id: 'simpleCddImplementationRemark', label: 'CDD Sederhana', remark: detailNotesData?.simpleCddImplementationRemark, value: 'SIMPLE_CDD' },
  ];


  const submitDisbaledWaitingAppTLDpop = !statusAskForInfo?.includes(stepper.from);
  const submitDisabled = (stepper.progress < MAX_STEP_PERCENTAGE && submitDisbaledWaitingAppTLDpop) || data !== null;


  useEffect(() => {
    if (!isDetailNotesLoading) {
      setSelectedCDD(detailNotesData?.cddImplementation);
    }
  }, [detailNotesData]);


  const { mutate: saveNotes, isPending: isSaveNotesLoading } = useSaveNotes({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSucess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket } = useSubmitBucket({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {

      showNiceModalV2({
        onClose: () => {
          handleOnClose();
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitNewWorkflow, isPending: isSubmitNewWorkflowLoading } = useSubmitNewWorkflow({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.GLOBAL.SUCCESS)
            .then(() => {
              router.push(currentListPage);
            });
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });


  const isMandatoryEmpty = selectedCDD === '' || selectedCDD === null;
  const isRemarkEmpty = () => {
    if (selectedCDD === 'EDD') {
      return watch('eddImplementationRemark') === '';
    } else if (selectedCDD === 'CDD') {
      return watch('cddImplementationRemark') === '';
    } else {
      return watch('simpleCddImplementationRemark') === '';
    }
  };

  const handleOnSave = async () => {
    const additionalInformation = await convertToDocx(container);
    const payload = {
      bucketProcessId: processId,
      cddImplementation: selectedCDD === null ? undefined : selectedCDD,
      cddImplementationRemark: watch('cddImplementationRemark'),
      description: additionalInformation,
      eddImplementationRemark: watch('eddImplementationRemark'),
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
      simpleCddImplementationRemark: watch('simpleCddImplementationRemark'),
    };

    if (isMandatoryEmpty || isRemarkEmpty()) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveNotes(payload);
        },
        submitText: 'Ya',
        title: 'Data mandatory belum terisi, simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveNotes(payload);
    }
  };

  const generateRadioOptions = () => {

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
        radioOptions: generateRadioOptions(),
      } : {}),
    });
  };

  const handleSubmit = (action: string) => {
    const hasRequestHighRisk = actions.hasOwnProperty('REQUEST_HIGH_RISK');
    const isRequestHighRisk = detailNotesData.cddImplementation === 'EDD' && hasRequestHighRisk;
    let isCompleteEditAskForInfo = false;
    if (isAskforInfoKadiv && isBusinessDivision && isKadiv && action === 'SUBMIT') isCompleteEditAskForInfo = true;
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        if (isRequestHighRisk && action === 'SUBMIT') {
          submitNewWorkflow({
            action: SUBMIT,
            bucketProcessId: bucketDetail?.bucketParentId,
            comment,
            module: TypeModule.HIGH_RISK,
            process: TypeProcess.HIGH_RISK_DK,
          });
          submitBucket({
            submitRequestDto: {
              action: 'REQUEST_HIGH_RISK',
              bucketProcessId: processId,
              comment,
              isCompleteEditAskForInfo,
              module: TypeModule.APU_PPT,
              process: TypeProcess.APU_PPT_DPOP,
            },
          });
        } else {
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: processId,
              comment,
              isCompleteEditAskForInfo,
              module: TypeModule.APU_PPT,
              process: TypeProcess.APU_PPT_DPOP,
            },
          });
        }

        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleOnClose = () => {
    router.push(currentListPage);
  };

  const listOptions = cddImplementationData.map((val, index) => {
    const isLastItem = index === cddImplementationData.length - 1;

    return ({
      label: (
        <ColumnWrapper
          key={val.value}
          sx={{
            ...(isLastItem ? {} : {
              borderBottom: '0.1vw solid',
              borderColor: theme.palette.custom.gray30,
            }),
            display: 'block',
            paddingY: theme.spacing(2),
            width: '100%',
          }}
        >
          <Controller
            control={control}
            name={val.id as 'cddImplementationRemark' | 'eddImplementationRemark' | 'simpleCddImplementationRemark'}
            render={({ field }) => (
              <Input
                {...field}
                type="area"
                label={val.label}
                rows={2}
                value={field.value || ''}
                disabled={!isEditable}
                containerSx={{
                  '& .MuiInputBase-input': {
                    padding: '1em',
                    width: '100%',
                  },
                  '& .MuiInputBase-root': {
                    padding: '1em',
                    width: '100%',
                  },
                  maxWidth: '100%',
                  minWidth: '100%',
                  width: '100%',
                }}
              />
            )}
          />
        </ColumnWrapper>
      ),
      value: val.value,
    });
  });

  const buttonListTemplateByKey = [
    CLOSE,
    SAVE,
    RETURN_TO_STAFF,
    RETURN_TO_STAFF_DPOP,
    RETURN_TO_TL,
    RETURN_TO_TL_DPOP,
    ASK_FOR_INFO,
    APPROVE_ASK_FOR_INFO,
    SUBMIT
  ];

  const renderActionButtons = () => {
    if (JSON.stringify(actions) === '{}') {
      return null;
    }

    let buttonContents = [];

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
              onClick={handleOnClose}
            >
              Close
            </Button>
          );
        case SAVE:
          return (
            <Button
              onClick={handleOnSave}
            >
              Save
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              disabled={data !== null}
              color="lightYellow"
              onClick={handleAskForInfo}
            >
              Ask For Info
            </Button>
          );
        case APPROVE_ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              // disabled={submitDisabled}
              onClick={handleAskForInfo}
            >
              Approve Ask For Info
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
              disabled={!isSubmitedEnable}
              onClick={() => handleSubmit(value)}
            >
              {isKadiv ? 'Approve' : 'Submit'}
            </Button>
          );
        default:
          break;
      }
    });

    return buttonlist;
  };

  const initialSectionFormat = {
    bottomMargin: 5.00,
    footerDistance: 0,
    headerDistance: 0,
    leftMargin: 5.00,
    pageHeight: 792,
    pageWidth: 447.30,
    rightMargin: 5.00,
    topMargin: 0.00,
  };

  return {
    container,
    currentBucketStatus,
    detailNotesData,
    handleAskForInfo,
    handleOnClose,
    handleOnSave,
    handleSubmit,
    initialSectionFormat,
    isDetailNotesLoading,
    isDpop,
    isKadivDpop,
    isMandatoryEmpty,
    isStaffDpop,
    isTLDpop,
    listOptions,
    renderActionButtons,
    selectedCDD,
    setContainer,
    setSelectedCDD,
  };
};

export default useNotes;
