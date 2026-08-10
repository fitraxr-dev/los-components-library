import React, { useEffect, useState, useContext, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';

import {
  APPROVED,
  COMPLETED,
  DEPI_DRD_NOT_OK,
  DEPI_DRD_OK,
  EDIT,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { eligibilityReview } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useSendMemoDrd from '../DraftMemo/hooks/useSendMemoDrd';
import { useEligibilityReviewAccess } from '../hooks/useEligibilityReviewAccess';

import useTableDocumentDrd from './components/TableDocumentDRD/TableDocumentDRD.hook';
import { useSelectedDocuments } from './context/SelectedDocumentsContext';
import useCheckDrdStatus from './hooks/useCheckDrdStatus';
import useCreateRating from './hooks/useCreateRating';
import useGetDetailRating from './hooks/useGetDetailRating';
import useSaveRating from './hooks/useSaveRating';
import useSendDrd from './hooks/useSendDrd';
import { MODAL_ID, ratingTypeOptions } from './Rating.constants';
import { formData, validation } from './Rating.form';


export const useRating = () => {
  const { processId } = useParams();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const path = usePathname();
  const { data: listRatingCategory } = useGetParameterList('ratingRate', { label: 'value1', value: 'key', value2: 'value2', value3: 'value3', value4: 'value4' });
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const { masintonForm, masintonChange, masintonReplace, masintonValidation } = useMasintonForm(formData, validation);
  const { userData } = useIdentity();
  const [supportingFactorsContainer, setSupportingFactorsContainer] = useState(null);
  const [constrainingFactorsContainer, setConstrainingFactorsContainer] = useState(null);
  const [noteContainer, setNoteContainer] = useState(null);
  const { setDirtyMsg } = useContext(DirtyContext);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const { recordActivity } = useRecordLog();
  const { drdDocumentList } = useTableDocumentDrd();
  const [isFormValid, setIsFormValid] = useState(false);
  const { selectedDocuments } = useSelectedDocuments();
  const queryClient = useQueryClient();
  const [isDisabledMkpir, setIsDisabledMkpir] = useState(true);
  const {
    rating: { value: rating },
    category: { value: category },
    ratingType: { value: ratingType },
    ratingPeriod: { value: ratingPeriod },
    description: { value: description },
    othersRatingType: { value: othersRatingType },
    categoryLabel: { value: categoryLabel },
  } = masintonForm;

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [hasCheckedDrdStatus, setHasCheckedDrdStatus] = useState(false);
  const { resetSelectedDocuments: resetTableDocuments } = useTableDocumentDrd();
  const { resetSelectedDocuments: resetContextDocuments } = useSelectedDocuments();

  const {
    hasAnyUpdateAccess: canUpdate,
  } = useEligibilityReviewAccess();

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error, variables) => {
        const action = variables.submitRequestDto.action;

        if (action !== ActivityType.SEND_TO_DRD) {
          const errorMessage = error?.message ;
          showNiceModalV2({
            title: errorMessage,
            type: 'error',
          });
        }

        queryClient.invalidateQueries({
          queryKey: ['bucket'],
        });

        queryClient.invalidateQueries({
          queryKey: ['mip-rating'],
        });
        queryClient.invalidateQueries({
          queryKey: ['documents'],
        });
      },
      onSuccess: (data, variables) => {
        const action = variables.submitRequestDto.action;

        if (action !== ActivityType.SEND_TO_DRD) {
          let successMessage = 'Data berhasil diproses';

          if (action === ActivityType.SUBMIT) {
            successMessage = 'Generate Digital Memo berhasil';
          } else if (action === ActivityType.EDIT) {
            successMessage = '';
          }

          showNiceModalV2({
            onClose: () => {
              if (action === ActivityType.SUBMIT) {
                showAlertMemoViewAllDocument();
              }
            },
            title: successMessage,
            type: 'success',
          });
        }

        queryClient.invalidateQueries({
          queryKey: ['bucket'],
        });

        queryClient.invalidateQueries({
          queryKey: ['mip-rating'],
        });
        queryClient.invalidateQueries({
          queryKey: ['documents'],
        });
      },
    }
  );

  const {
    mutate: sendToDrdFile,
    isPending: isSendingToDrd,
  } = useSendDrd({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
      resetTableDocuments();
      resetContextDocuments();
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        cancelText: 'Tutup',
        submitText: 'OK',
        title: 'Data berhasil dikirim ke DRD',
        type: 'success',
      });
      resetTableDocuments();
      resetContextDocuments();
      submitBucket({
        submitRequestDto: {
          action: ActivityType.SEND_TO_DRD,
          bucketProcessId: String(processId),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DEPI,
        },
      });
    },
  });

  const {
    data: ratingDetail,
    isFetching: isFetchLoading,
    refetch: refetchRatingDetail,
  } = useGetDetailRating({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

  const { data: debtorInfoData, refetch: refetchDebtorInfo } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });
  const { data: debtorInfoDataMip, refetch: refetchDebtorInfoMip } = useGetBucketById({
    bucketProcessId: String(debtorInfoData?.bucketParentId),
    module: TypeModule.MIP_REVIEW,
    process: TypeModule.MIP_REVIEW,
  });

  const isDrdOk = debtorInfoData?.status === DEPI_DRD_OK;
  const isDrdNotOk = debtorInfoData?.status === DEPI_DRD_NOT_OK;
  const isApproved = debtorInfoData?.status === APPROVED;
  const isCompleted = debtorInfoData?.status === COMPLETED;
  const isShowSendAndDRDInterface = isDrdOk || isDrdNotOk || isApproved || isCompleted;
  const isStatusDrd = isDrdOk || isDrdNotOk || isCompleted;
  const idDrd = debtorInfoData?.idDrd;

  const {
    data: drdStatusData,
    isLoading: isCheckingDrdStatus,
    refetch: refetchDrdStatus,
  } = useCheckDrdStatus(
    {
      bucketProcessId: String(processId),
      debtorName: debtorInfoDataMip?.debtorName || '',
      moduleName: TypeModule.MIP_REVIEW,
      processName: TypeProcess.REVIEWER_DEPI,
    },
    {
      enabled: !!debtorInfoDataMip?.debtorName,
    }
  );

  const {
    mutate: createRating,
    isPending: isCreatingRating,
  } = useCreateRating({
    onError: (error) => {
      const errorMessage = error?.message ;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        onClose: () => showAlertDownloadDocumentTemplate(),
        title: 'Berhasil membuat rating baru',
        type: 'success',
      });
      refetchRatingDetail();
      refetchDebtorInfoMip();
      refetchDebtorInfo();
      refetchDrdStatus();
    },
  });

  const { mutate: sendMemoMkpirToDrd } = useSendMemoDrd({
    onError: (error) => {
      const errorMessage = error?.message ;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      showNiceModalV2({
        cancelText: 'Tutup',
        submitText: 'OK',
        title: 'Memo berhasil dikirim ke DRD',
        type: 'success',
      });
    },
  });

  const currentStatus = debtorInfoData?.status;
  const debtorInstitutionType = debtorInfoData?.institutionType;
  const isDrdExist = drdStatusData?.exist;

  /**
  * Determine if the debtor is of PEMDA (Regional Government) type.
  * If the enum `DebtorNamesetResponseDtoRegionalGovernEnum` is null or undefined,
  * `isPemda` is set to false, indicating that the debtor is not classified as PEMDA.
  * This allows the process to continue smoothly, treating the debtor as a non-PEMDA type.
  */
  const isPemda = DebtorNamesetResponseDtoRegionalGovernEnum
    ? Object.values(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
      debtorInstitutionType as DebtorNamesetResponseDtoRegionalGovernEnum)
    : false;
  const isDisabledSentToDrd = (isPemda ? false : selectedDocuments.length === 0) || isSendingToDrd;

  useEffect(() => {
    if (debtorInfoData?.debtorName && !hasCheckedDrdStatus) {
      refetchDrdStatus();
      setHasCheckedDrdStatus(true);
    }
  }, [debtorInfoData?.debtorName, refetchDrdStatus, hasCheckedDrdStatus]);

  useEffect(() => {
    if (debtorInfoData?.status === COMPLETED) {
      setIsDisabledMkpir(false);
    }
  }, [debtorInfoData?.status]);

  const showCreateRatingConfirmation = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => handleCancelCreateRating(),
      onSubmit: () => handleCreateRating(),
      title: 'Customer belum memiliki data rating pada DRD. Apakah akan membuat rating baru untuk customer tersebut?',
    });
  };

  const showAlertDownloadDocumentTemplate = () => {
    NiceModal.show(MODAL.GLOBAL.WARNING, {
      title: 'Pastikan Anda telah mengunduh template versi terbaru sebelum melanjutkan.',
    });
  };
  const showAlertMemoViewAllDocument = () => {
    NiceModal.show(MODAL.GLOBAL.WARNING, {
      title: 'Digital Memo telah berhasil digenerate. Silakan akses melalui stepper "View All Document" untuk melihat dan mengunduhnya.',
    });
    queryClient.invalidateQueries({ queryKey: ['bucket']});
  };


  useEffect(() => {
    if (drdStatusData && !isCheckingDrdStatus) {
      if (!isDrdExist) {
        showCreateRatingConfirmation();
      }
    }

  }, [drdStatusData, isCheckingDrdStatus, isDrdExist]);


  const updateMasintonForm = (form, details, isFound, isViewOnly = false) => {
    const {
      rating,
      ratingLabel,
      category,
      categoryLabel,
      ratingType,
      ratingPeriod,
      description,
      supportingFactor,
      constrainingFactor,
      note,
    } = details;

    const newForm = structuredClone(form);
    const ratingTypeTemp = isFound ? ratingType : 'others';
    const otherRatingTypeTemp = isFound ? null : ratingType;

    newForm.rating.value = rating === '-' ? null : rating;
    newForm.ratingLabel.value = ratingLabel === '-' ? null : ratingLabel;
    newForm.category.value = category === '-' ? null : category;
    newForm.categoryLabel.value = categoryLabel === '-' ? null : categoryLabel;
    newForm.ratingType.value = ratingTypeTemp;
    newForm.othersRatingType.value = otherRatingTypeTemp;
    newForm.ratingPeriod.value = ratingPeriod;

    newForm.description.value = isViewOnly
      ? (description === 'null' || description === null ? '-' : description)
      : description;

    newForm.supportingFactor.value = supportingFactor;
    newForm.constrainingFactor.value = constrainingFactor;
    newForm.note.value = note;

    return newForm;
  };

  const isDocumentTableValid = React.useMemo(() => {
    if (isPemda) {
      return true;
    }
    return drdDocumentList && drdDocumentList.length > 0;
  }, [drdDocumentList, isPemda]);


  const isDownloadDisabled = React.useMemo(() => {
    return !ratingType ||
           (ratingType === 'others' && !othersRatingType);
  }, [ratingType, othersRatingType]);


  const checkFormValidity = React.useCallback(() => {
    const {
      rating,
      ratingType,
      ratingPeriod,
      othersRatingType,
    } = masintonForm;

    const isRatingValid = rating.value && !rating.error;
    const isRatingTypeValid = ratingType.value && !ratingType.error;
    const isRatingPeriodValid = ratingPeriod.value && !ratingPeriod.error;

    const isOthersRatingTypeValid = ratingType.value !== 'others' ||
                                 (othersRatingType.value && !othersRatingType.error);

    const isDocumentValid = isPemda ? true : isDocumentTableValid;

    return isRatingValid &&
         isRatingTypeValid &&
         isRatingPeriodValid &&
         isOthersRatingTypeValid &&
         isDocumentValid;
  }, [masintonForm, isDocumentTableValid, isPemda]);

  useEffect(() => {
    const isValid = checkFormValidity();
    setIsFormValid(isValid);
  }, [
    masintonForm.rating.value,
    masintonForm.rating.error,
    masintonForm.ratingType.value,
    masintonForm.ratingType.error,
    masintonForm.ratingPeriod.value,
    masintonForm.ratingPeriod.error,
    masintonForm.othersRatingType.value,
    masintonForm.othersRatingType.error,
    isDocumentTableValid,
    isPemda,
  ]);

  useEffect(() => {
    if (ratingDetail) {
      const isFound = ratingTypeOptions.some((item) => item.value.includes(ratingDetail.ratingType));
      const updatedForm = updateMasintonForm(masintonForm, ratingDetail, isFound, viewOnly);
      masintonReplace(updatedForm);
    }
  }, [ratingDetail]);

  const {
    isPending: isSaveLoading,
    mutate: saveRating,
  } = useSaveRating({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ type: 'success' });
    },
  });

  useEffect(() => {
    if (viewOnly) {
      setDirtyMsg(undefined);
      return;
    }

    const isFormDirty = checkFormDirty();

    if (isFormDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [
    rating,
    ratingType,
    ratingPeriod,
    description,
    othersRatingType,
    ratingDetail,
  ]);

  useEffect(() => {
    const selectedCategory = listRatingCategory.find((item) => item.value === rating);
    masintonChange('category', selectedCategory?.value3 || '');
    masintonChange('categoryLabel', selectedCategory?.value4 || '');

  }, [rating]);

  const checkFormDirty = () => {
    if (!ratingDetail) return false;

    const isRatingChanged = rating !== (ratingDetail?.rating === '-' ? null : ratingDetail?.rating);
    const isRatingTypeChanged = ratingType !== (ratingDetail?.ratingType === '-' ? null : ratingDetail?.ratingType);
    const isRatingPeriodChanged = ratingPeriod !== ratingDetail?.ratingPeriod;
    const isDescriptionChanged = description !== ratingDetail?.description;

    const isFoundInOptions = ratingTypeOptions.some((item) => item.value.includes(ratingDetail?.ratingType));
    const originalOthersRatingType = isFoundInOptions ? null : ratingDetail?.ratingType;
    const isOthersRatingTypeChanged = othersRatingType !== originalOthersRatingType;

    return isRatingChanged || isRatingTypeChanged || isRatingPeriodChanged ||
           isDescriptionChanged || isOthersRatingTypeChanged;
  };

  const autoSavePayload = useMemo(() => async () => {

    const supportingFactorBlob = await convertToDocx(supportingFactorsContainer);
    const constrainingFactorBlob = await convertToDocx(constrainingFactorsContainer);
    const noteBlob = await convertToDocx(noteContainer);

    const selectedRatingOption = listRatingCategory?.find(
      (option) => option.value4 === categoryLabel
    );

    return {
      bucketProcessId: String(processId),
      category: selectedRatingOption ? selectedRatingOption.value3 : null,
      constrainingFactor: constrainingFactorBlob,
      module: TypeModule.MIP_REVIEW,
      note: noteBlob,
      process: TypeProcess.REVIEWER_DEPI,
      rating: rating,
      ratingPeriod: ratingPeriod ? String(new Date(ratingPeriod).getFullYear()) : null,
      ratingRemark: description,
      ratingType: ratingType === 'others' ? othersRatingType : ratingType,
      supportingFactor: supportingFactorBlob,
    };
  }, [
    processId,
    supportingFactorsContainer,
    constrainingFactorsContainer,
    noteContainer,
    rating,
    ratingType,
    ratingPeriod,
    description,
    othersRatingType,
    categoryLabel,
    listRatingCategory
  ]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: canUpdate && !viewOnly && !!ratingDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.rating.save',
  });

  const handleSave = async (options?: { goToNext?: boolean }) => {
    const { goToNext = false } = options || {};

    const ignoreValidation = [];

    if (ratingType !== 'others') {
      ignoreValidation.push('othersRatingType');
    }

    if (!masintonValidation({ ignoreValidation })) return showNiceModalV2({ title: 'Pastikan kamu telah mengisi seluruh mandatory field', type: 'error' });

    if (viewOnly) {
      goToNextStep();
    } else {
      const constrainingFactor = await convertToDocx(constrainingFactorsContainer);
      const supportingFactor = await convertToDocx(supportingFactorsContainer);
      const notes = await convertToDocx(noteContainer); // Hal-hal yang perlu diperhatikan

      const selectedRatingOption = listRatingCategory.find(
        (option) => option.value4 === categoryLabel
      );

      saveRating({
        bucketProcessId: String(processId),
        category: selectedRatingOption ? selectedRatingOption.value3 : null,
        constrainingFactor: constrainingFactor,
        module: TypeModule.MIP_REVIEW,
        note: notes, // Hal2 yang perlu di perhatikan
        process: TypeProcess.REVIEWER_DEPI,
        rating: rating,
        ratingPeriod: String(new Date(ratingPeriod).getFullYear()),
        ratingRemark: description,
        ratingType: ratingType === 'others' ? othersRatingType : ratingType,
        supportingFactor: supportingFactor,
      }, {
        onSuccess: () => {
          if (goToNext) {
            goToNextStep();
          }
        },
      });

      setDirtyMsg(undefined);
    }
  };

  const handleSaveOnly = () => handleSave({ goToNext: false });
  const handleSaveAndNext = () => handleSave({ goToNext: true });
  const handleNext = () => goToNextStep();

  const handleOpenModalConfirmSelector = () => {
    return NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          disabled: isCompleted,
          key: 'generateMemo',
          label: 'Generate Digital Memo',
        },
        {
          key: 'changeReview',
          label: 'Change Review',
        },
      ],
      onSubmit: (val: any) => {
        if (val === 'generateMemo') {

          submitBucket({
            submitRequestDto: {
              action: SUBMIT,
              bucketProcessId: String(processId),
              module: TypeModule.MIP_REVIEW,
              process: TypeProcess.REVIEWER_DEPI,
            },
          });
        } else if (val === 'changeReview') {
          submitBucket({
            submitRequestDto: {
              action: EDIT,
              bucketProcessId: String(processId),
              module: TypeModule.MIP_REVIEW,
              process: TypeProcess.REVIEWER_DEPI,
            },
          });
        }
      },
      title: 'Next Process',
    });
  };

  const handleCreateRating = () => {
    if (!debtorInfoData) {
      showNiceModalV2({
        title: 'Debtor information is not available',
        type: 'error',
      });
      return;
    }

    const picData = debtorInfoData.pic && debtorInfoData.pic.length > 0 ? debtorInfoData.pic[0] : null;

    const createRatingPayload = {
      bucketMasterId: debtorInfoData.bucketMaster ?? null,
      bucketProcessId: debtorInfoData.bucketProcessId ?? null,
      debtorName: debtorInfoDataMip.debtorName ?? null,
      division: debtorInfoDataMip.divisionCode ?? null,
      moduleName: TypeModule.MIP_REVIEW,
      picRmName: picData?.name || debtorInfoData.staffName || null,
      processName: TypeProcess.REVIEWER_DEPI,
      ratingAnalystName: userData?.user?.fullName ?? null,
    };

    createRating(createRatingPayload);
  };

  const handleCancelCreateRating = () => {
    showAlertDownloadDocumentTemplate();
  };

  const handleSendMemoMkpirToDrd = () => {
    showNiceModalV2({
      cancelText: 'No',
      onSubmit: () => {
        sendMemoMkpirToDrd({
          bucketProcessId: String(processId),
          module: TypeModule.MIP_REVIEW,
          process: TypeProcess.REVIEWER_DEPI,
          ratingId: debtorInfoData?.idDrd,
        });
      },
      submitText: 'Kirim',
      title: 'Kirim Memo MKPIR ke DRD',
      type: 'warning',
    });
  };

  const handleSendToDrd = () => {
    const formattedDocuments = selectedDocuments.map((doc) => ({
      id: doc.id,
    }));

    const picData = debtorInfoData.pic && debtorInfoData.pic.length > 0 ? debtorInfoData.pic[0] : null;
    showNiceModalV2({
      cancelText: 'Batal',
      onSubmit: () => {
        sendToDrdFile({
          analystName: userData?.user?.fullName ?? null,
          bucketProcessId: debtorInfoData.bucketProcessId ?? null,
          debtorName: debtorInfoDataMip.debtorName ?? null,
          division: debtorInfoDataMip.divisionCode ?? null,
          documents: formattedDocuments ?? [],
          idRatingDrd: idDrd ?? null,
          institutionType: debtorInstitutionType || null,
          picName: picData?.name || debtorInfoData.staffName || null,
        });

      },
      submitText: 'Kirim',
      title: 'Apakah Anda yakin ingin mengirim  dokumen ke DRD?',
      type: 'warning',
    });
  };


  const handleDownloadDocDrd = async () => {
    setIsDownloadLoading(true);
    const picData = debtorInfoData.pic && debtorInfoData.pic.length > 0 ? debtorInfoData.pic[0] : null;
    try {
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DEPI,
        remarks: 'download template DRD',
      });

      const payload = {
        analystName: userData?.user?.fullName ?? null,
        bucketProcessId: debtorInfoData.bucketProcessId ?? null,
        debtorName: debtorInfoDataMip.debtorName ?? null,
        division: debtorInfoDataMip.divisionCode ?? null,
        idRating: idDrd,
        institutionType: debtorInstitutionType || null,
        picName: picData?.name || debtorInfoData.staffName || null,
        ratingType: ratingType === 'others' ? othersRatingType : ratingType,
      };

      const response = await API('bucketDocument.document.downloadTemplateDRD', {
        data: payload,
        method: 'POST',
        responseType: 'blob',
      });


      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-drd.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNiceModalV2({
        title: 'Template berhasil didownload',
        type: 'success',
      });

    } catch (error) {
      const errorData = error?.message;
      console.log('errorData', errorData);
      showNiceModalV2({
        title: errorData,
        type: 'error',
      });
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleOpenDrdInterface = () => {
    NiceModal.show(MODAL_ID.DRD_INTERFACE_MODAL, {
      isPemda,
    });
  };

  const handleOpenHistoryModal = () => {
    NiceModal.show(MODAL_ID.HISTORY_MODAL, {
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    });
  };


  const handleOpenHistory = () => {
    router.push(replacePath(
      eligibilityReview.RATING_HISTORY,
      {
        module: moduleIndex,
        processId: processId,
      }));
  };

  return {
    canUpdate,
    constrainingFactorsContainer,
    currentStatus,
    drdStatusData,
    handleCancelCreateRating,
    handleCreateRating,
    handleDownloadDocDrd,
    handleNext,
    handleOpenDrdInterface,
    handleOpenHistory,
    handleOpenHistoryModal,
    handleOpenModalConfirmSelector,
    handleSaveAndNext,
    handleSaveOnly,
    handleSendMemoMkpirToDrd,
    handleSendToDrd,
    isAutoSaveFetching,
    isCheckingDrdStatus,
    isCreatingRating,
    isDisabledMkpir,
    isDisabledSentToDrd,
    isDocumentTableValid,
    isDownloadDisabled,
    isDownloadLoading,
    isDrdExist,
    isFetchLoading,
    isFormValid,
    isPemda,
    isSaveLoading,
    isSendingToDrd,
    isShowSendAndDRDInterface,
    isStatusDrd,
    listRatingCategory,
    masintonChange,
    masintonForm,
    noteContainer,
    ratingDetail,
    setConstrainingFactorsContainer,
    setNoteContainer,
    setShouldGoNext,
    setSupportingFactorsContainer,
    supportingFactorsContainer,
    viewOnly,
  };
};
