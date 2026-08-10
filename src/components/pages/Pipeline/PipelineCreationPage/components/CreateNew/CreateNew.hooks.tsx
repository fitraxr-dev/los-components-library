import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetValidateResult from '@/hooks/services/useGetValidateResult';
import useValidateCheckDk from '@/hooks/services/useValidateCheckDk';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { PipelineContext } from '@/components/layouts/PipelineLayout/Pipeline.context';
import useValidateName from '@/components/pages/BusinessActivityReport/InformationPage/hooks/useValidateName';
import TextStyle from '@/components/shared/TextStyle';

import useGetMasterDebtorById from '../../hooks/useGetMasterDebtorById';
import useSavePipeline from '../../hooks/useSavePipeline';

import {
  EXISTING_DISABLED_FIELDS,
  EXISTING_MANDATORY_FIELDS,
  modal,
  NEW_DISABLED_FIELDS,
  NEW_MANDATORY_FIELDS,
  VALIDATION_SCHEMA,
} from './CreateNewPipelineCustom.constant';

import type { DebtorListResponseDto } from '@/services/openapi/master-service';


export const useCreateNew = () => {
  const router = useCustomRouter();
  const [{ userData }] = useApp();
  const { divisionName } = useDivision();
  const { debtorId, setDebtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { setViewOnly } = useViewOnly();
  const { state, setState } = useContext(PipelineContext);
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    trigger,
    reset,
    resetField,
    watch,
  } = useForm({
    context: { isExistingDebtor: state?.isExistingDebtor },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(VALIDATION_SCHEMA),
  });

  const [validatedDebtorId, setValidatedDebtorId] = useState(null);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { data: validateResultData } = useGetValidateResult({
    debtorId: validatedDebtorId,
  }, {
    enabled: validatedDebtorId !== null && state?.isExistingDebtor,
  });

  const { mutate: dkValidation } = useValidateCheckDk({
    onError: () => { },
  });

  const [formDebtorData, setFormDebtorData] = useState<any>({
    divisionId: divisionName,
    isNewClient: true,
    rmId: userData?.user?.fullName,
  });

  const { data: debtorDetail, isSuccess: isGetDetailSuccess } = useGetMasterDebtorById(
    { debtorId: state.existingDebtorId },
    { enabled: state?.isExistingDebtor && state?.existingDebtorId !== null }
  );

  const isValidationInvalid = useMemo(() => {
    if (!validateResultData?.content?.invalid) return false;

    if (validateResultData?.content?.isSubmitButtonEnable) return false;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = validateResultData.content.result || '';
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    const isNotDisabled = (plainText.includes('Terdapat kemiripan dengan database DK')
      || plainText.includes('Profil Customer : High Risk')
      || plainText.includes('Terjadi pelanggaran BMPP')) &&
      !plainText.includes('Sedang dilakukan perubahan Data Customer');

    return !(isNotDisabled);
  }, [
    validateResultData?.content?.invalid,
    validateResultData?.content?.result,
    validateResultData?.content?.isSubmitButtonEnable,
  ]);

  useEffect(() => {
    if (state.isExistingDebtor && isGetDetailSuccess && debtorDetail) {
      setDebtorId(debtorDetail?.debtorId);

      if (debtorDetail?.debtorId && debtorDetail?.debtorId !== validatedDebtorId) {
        setValidatedDebtorId(debtorDetail?.debtorId);
        setHasShownWarning(false);
      }

      setFormDebtorData({
        analystId: debtorDetail?.analystId,
        createdDate: new Date(),
        dataSource: debtorDetail?.dataSource,
        debtorName: debtorDetail?.name,
        debtorType: debtorDetail.debtorType,
        divisionId: divisionName,
        documentNpwp: debtorDetail?.npwpFile ? {
          extension: `.${debtorDetail?.npwpFile.split('/').pop().split('.').pop()}`,
          name: debtorDetail?.npwpFile.split('/').pop().split('.')[0],
          url: debtorDetail?.npwpFile,
        } : null,
        gam: {
          id: debtorDetail?.gamId ?? '',
          label: debtorDetail?.gamId ? debtorDetail?.gamName : '',
        },
        group: {
          id: debtorDetail?.groupId?.toString() ?? '',
          label: debtorDetail?.groupId ? debtorDetail?.groupName : '',
        },
        institutionTypeId: debtorDetail?.type,
        isExisting: debtorDetail?.isExisting,
        isGroup: debtorDetail?.isGroup,
        isRelatedToSmi: debtorDetail?.isRelatedToSmi,
        npwp: debtorDetail?.npwp,
        rmId: userData?.user?.fullName,
      });
    }
  }, [debtorDetail, isGetDetailSuccess, validatedDebtorId]);

  useEffect(() => {
    if (!state?.isExistingDebtor) {
      setValidatedDebtorId(null);
      setHasShownWarning(false);
    }
  }, [state?.isExistingDebtor]);

  useEffect(() => {
    if (
      validateResultData?.content?.invalid &&
      !hasShownWarning &&
      validatedDebtorId &&
      state?.isExistingDebtor &&
      debtorId === validatedDebtorId
    ) {
      setHasShownWarning(true);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = validateResultData.content.result || '';

      const listItems = tempDiv.querySelectorAll('li');
      let formattedText = '';

      if (listItems.length > 0) {
        formattedText = Array.from(listItems)
          .map((item) => `• ${item.textContent || item.innerText || ''}`)
          .join('\n');
      } else {
        formattedText = tempDiv.textContent || tempDiv.innerText || 'Terdapat pelanggaran pada data customer';
      }

      setTimeout(() => {
        NiceModal.show(MODAL.GLOBAL.WARNING, {
          onClose: () => {
          },
          title: formattedText,
        });
      }, 100);
    }
  }, [
    validateResultData?.content?.invalid,
    validateResultData?.content?.result,
    hasShownWarning,
    validatedDebtorId,
    state?.isExistingDebtor,
    debtorId
  ]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      percentage: 0,
    }));
  }, []);

  const { isSuccess, isPending: isSaveLoading, mutate: savePipeline, status: statusSavePipeline } = useSavePipeline({
    onError: (data) => {
      const errorDetail = data.response.data.errorDetail;
      const errorData = data.response.data.data;

      if (errorDetail && (
        errorDetail.includes('duplicate') ||
        errorDetail.includes('similar') ||
        errorDetail.includes('sudah ada') ||
        errorDetail.includes('sama')
      )) {
        handleShowRecommendedGroups();
      } else {
        let errorMessage = errorData || errorDetail || 'Terjadi Kesalahan, Coba lagi nanti.';

        // Customize specific error messages
        if (errorMessage === 'Nama Customer memiliki kapital pada huruf pertama') {
          errorMessage = 'Nama Customer harus memiliki kapital pada huruf pertama';
        }

        showNiceModalV2({ title: errorMessage, type: 'error' });
      }
    },
    onSuccess: (res) => {
      // Record activity for creating pipeline
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: res?.data?.content?.bucketProcessId || '',
        changeAfter: JSON.stringify({
          bucketProcessId: res?.data?.content?.bucketProcessId,
          debtor: lastSavedPayload?.debtor,
          pipeline: lastSavedPayload?.pipeline,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully created new pipeline',
      });

      setViewOnly(false);
      showNiceModalV2({
        onClose: () => {
          router.replace(replacePath(pipeline.DETAIL_PAGE, { processId: res?.data?.content.bucketProcessId }));
        },
        type: 'success',
      });
    },
  });

  const { mutate: validateName } = useValidateName({});

  const isSaveStatusIdle = statusSavePipeline === 'idle' || statusSavePipeline === 'error';

  const isInstitutionTypeCentral = watch('institutionTypeId') === DebtorNamesetResponseDtoRegionalGovernEnum.CENTRALGOVERNMENT;

  const handleViewData = (data: DebtorListResponseDto[]) => {
    NiceModal.show(modal.CUSTOMER_DK_VALIDATION, { data });
  };

  const handleClose = () => {
    router.replace(pipeline.LIST_PAGE);
  };

  const handleShowRecommendedGroups = () => {
    const recommendedGroups = [
      {
        groupType: 'Technology',
        id: 'GRP-001',
        isRelatedToSmi: true,
        memberCount: 5,
        name: 'Tech Startup Group',
        sector: 'Information Technology',
        yearFounded: 2020,
      },
      {
        groupType: 'Manufacturing',
        id: 'GRP-002',
        isRelatedToSmi: false,
        memberCount: 8,
        name: 'Manufacturing Alliance',
        sector: 'Manufacturing',
        yearFounded: 2018,
      },
      {
        groupType: 'Financial',
        id: 'GRP-003',
        isRelatedToSmi: true,
        memberCount: 12,
        name: 'Financial Services Group',
        sector: 'Financial Services',
        yearFounded: 2019,
      },
    ];

    NiceModal.show(modal.RECOMMENDED_GROUP, {
      onCreateNew: handleCreateNewGroup,
      onSelectGroup: handleSelectGroup,
      recommendedGroups,
    });
  };

  const handleSelectGroup = (selectedGroup: any) => {
    showNiceModalV2({
      title: `Group "${selectedGroup.name}" has been selected`,
      type: 'success',
    });
  };

  const handleCreateNewGroup = () => {
    showNiceModalV2({
      title: 'Tidak bisa menambah Group yang sama',
      type: 'warning',
    });
  };

  const handleSave = async (value) => {
    const _debtorId = state?.isExistingDebtor ? debtorId : null;

    const debtorName = isInstitutionTypeCentral ? value?.debtorNameOthers : value?.debtorName;

    const payload = {
      bucketMasterCode: null,
      debtor: {
        debtorId: _debtorId,
        debtorName: debtorName,
        gamId: value?.gam?.id ? +value?.gam?.id : null,
        institutionType: value?.institutionTypeId,
        isExisting: state?.isExistingDebtor,
        npwp: value?.npwp,
      },
      newDebtor: state?.isExistingDebtor ? false : true,
      pipeline: {
        analystId: value?.analyst?.id ? +value?.analyst?.id : null,
        dataSource: value?.dataSource,
        financeType: value?.financingType,
        groupId: value?.group?.id,
        pipelineId: null,
        remarks: value?.remarks,
        totalPlafond: value?.totalPlafond,
        typeProcess: value?.typeProcess,
      },
    };

    const handleValidationSuccess = (resp, data) => {
      dkValidation({
        debtorName: watch('debtorName'),
        feature: 'DK',
      }, {
        onSuccess: (dkData) => {
          const proceedAfterDkValidation = () => {
            if (resp.similarDebtorList.length >= 1) {
              NiceModal.show(modal.EXISTING_USER, {
                ...resp,
                callback: () => {
                  setLastSavedPayload(payload);
                  savePipeline(payload);
                },
                checkedName: data,
              });
            } else {
              setLastSavedPayload(payload);
              savePipeline(payload);
            }
          };

          if (dkData.hasDuplicate) {
            showNiceModalV2({
              cancelText: 'Close',
              title: 'Terdaftar dalam database DK. proses tidak dapat dilanjutkan.',
              type: 'error',
            });
          } else if (dkData.hasSimilar) {
            showNiceModalV2({
              cancelText: 'Cancel',
              onSubmit: proceedAfterDkValidation,
              submitText: 'Save',
              title: (
                <TextStyle sx={{ textAlign: 'center' }}>
                  Terdapat kemiripan dengan database DK.
                  <TextStyle
                    sx={{
                      color: '#0C8CE9',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() => handleViewData(dkData.similarDebtorList)}
                  >
                    View Data Details
                  </TextStyle>
                </TextStyle>
              ),
              type: 'warning',
            });
          } else {
            proceedAfterDkValidation();
          }
        },
      });
    };

    const handleValidationError = () => {
      showNiceModalV2({
        onClose: () => { },
        type: 'error',
      });
    };

    if (!state?.isExistingDebtor) {
      validateName(debtorName, {
        onError: handleValidationError,
        onSuccess: handleValidationSuccess,
      });
    } else {
      setLastSavedPayload(payload);
      savePipeline(payload);
    }
  };

  useEffect(() => {
    reset(formDebtorData);
  }, [formDebtorData]);

  useEffect(() => {
    if (isSuccess) {
      setDirtyMsg(undefined);
    } else {
      if ((JSON.stringify(watch()) !== JSON.stringify(formDebtorData)) && isSaveStatusIdle) {
        setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      } else {
        setDirtyMsg(undefined);
      }
    }
  }, [isSuccess, watch(), formDebtorData]);

  return {
    control,
    dirtyMsg,
    disabledFields: isValidationInvalid
      ? {}
      : (
        state.isExistingDebtor
          ? EXISTING_DISABLED_FIELDS
          : NEW_DISABLED_FIELDS
      ),
    formDebtorData,
    handleClose,
    handleSave,
    handleSubmit,
    isExistingDebtor: state.isExistingDebtor,
    isInstitutionTypeCentral,
    isSaveLoading,
    isSaveStatusIdle,
    isSuccess,
    isValid,
    isValidationInvalid,
    mandatoryFields: state.isExistingDebtor ? EXISTING_MANDATORY_FIELDS : NEW_MANDATORY_FIELDS,
    resetField,
    validateResult: validateResultData,
    validationSchema: VALIDATION_SCHEMA,
    watch,
  };
};
