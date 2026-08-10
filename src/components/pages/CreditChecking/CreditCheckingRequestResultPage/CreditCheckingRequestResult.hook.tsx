import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import {
  APPROVE_ASK_FOR_INFO,
  ASK_FOR_INFO,
  ASK_FOR_INFO_KADIV,
  ASK_FOR_INFO_KADIV_DPOP,
  ASK_FOR_INFO_SUMMARY_KADIV,
  ASK_FOR_INFO_SUMMARY_TL,
  ASK_FOR_INFO_TL,
  ASK_FOR_INFO_TL_DPOP,
  BUSINESS_DIVISION,
  CANCELED,
  CLOSE,
  DECLINE,
  REJECTED,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  RETURN_TO_MAKER,
  roles,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { creditChecking } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import Button from '@/components/shared/Button';

import useConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest.hook';
import { RETURN_TO_STAFF_DPOP, RETURN_TO_TL_DPOP } from '../SummaryPage/Summary.constants';

import { CC_DPOP_UPLOAD_RESULT } from './CreditCheckingRequestResult.constants';
import { formData, validation } from './creditCheckingRequestResult.form';
import useGetBucketByBcm from './hooks/useGetBucketByBcm';
import useGetCreditCheckingRequestDetail from './hooks/useGetCreditCheckingRequestDetail';
import useRequestEditCreditChecking from './hooks/useRequestEditCreditChecking';
import useSaveCreditCheckingRequest from './hooks/useSaveCreditCheckingRequest';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const useCreditCheckingRequestResult = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const goToNextStep = useGoToNextStep();
  const [{ currentRole }] = useApp();
  const { actions, isDpop, isRequestModule, stepper, isStaff } = useCreditCheckingContext();

  const { divisionCode } = useDivision();
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const [isSavingAndGoingNext, setIsSavingAndGoingNext] = useState(false);

  const [selectedDebtor, setSelectedDebtor] = useState([]);
  const [selectedShareholder, setSelectedShareholder] = useState([]);
  const [selectedManagement, setSelectedManagement] = useState([]);
  const [selectedOtherRelation, setSelectedOtherRelation] = useState([]);

  const configPathname = replacePath(creditChecking.DETAIL_REQUEST_PAGE, { processId });
  const isRequestMode = matchesPathname(pathname, configPathname);
  const isVerificationMode = getLastPath(pathname) === 'document-verification';
  const currentListPage = `/${pathname.split('/').splice(1, 3).join('/')}`;

  const isRm = currentRole.includes(roles.RM);
  const isTL = currentRole.includes(roles.TL);
  const isKadiv = currentRole.includes(roles.KADIV);
  const isMaker = currentRole.includes(roles.MAKER);
  const isBusinessDivision = divisionCode.includes(BUSINESS_DIVISION);

  let isShowTableUploadDocument = actions ? actions?.hasOwnProperty('TABLE_UPLOAD_DOCUMENT') : false;

  const newCreditCheckingDocumentVerif = replacePath(creditChecking.BUCKET_DOCUMENT_VERIFICATION_PAGE, { processId });
  const isVerifMode = matchesPathname(pathname, newCreditCheckingDocumentVerif) && stepper.from === 'ASK_FOR_INFO' && isDpop && isStaff;
  const { recordActivity } = useRecordLog();
  const hasInitialized = React.useRef(false);
  const { differencesData } = useConfirmationLatest();

  const buttonListTemplateByKey = [
    CLOSE,
    DECLINE,
    SAVE,
    'SAVE_NEXT',
    RETURN_TO_STAFF,
    RETURN_TO_TL,
    RETURN_TO_STAFF_DPOP,
    RETURN_TO_TL_DPOP,
    RETURN_TO_MAKER,
    ASK_FOR_INFO,
    APPROVE_ASK_FOR_INFO,
    'FORWARD_SUBMIT',
    SUBMIT
  ];

  const withoutSaveButtonByStatus = [CC_DPOP_UPLOAD_RESULT];

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.CREDIT_CHECKING,
    process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
  });

  useEffect(() => {
    if (bucketDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.CREDIT_CHECKING,
        process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
        remarks: 'view credit checking result detail page',
      });
    }
  }, [bucketDetail, isRequestMode, processId, recordActivity]);

  const {
    data: requestDetail,
    isSuccess: isFetchRequestDetailSuccess,
  } = useGetCreditCheckingRequestDetail({ bucketProcessId: processId });

  const { mutate: requestEdit } = useRequestEditCreditChecking({
    onSuccess: () => { },
  });

  const { mutate: saveCreditCheckingRequest, isPending: isSaveLoading } = useSaveCreditCheckingRequest({
    onSuccess: (_, variable) => {

      showNiceModalV2({
        onClose: () => {
          recordActivity({
            activity: requestEdit ? ActivityType.EDIT : ActivityType.ADD,
            bucketProcessId: processId,
            changeAfter: JSON.stringify(variable),
            module: TypeModule.CREDIT_CHECKING,
            process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
            remarks: requestEdit ? 'edit credit checking result' : 'add credit checking result',
          });
          isSavingAndGoingNext ? goToNextStep() : closeNiceModal(MODAL.GLOBAL.SUCCESS);
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { data: bcmData } = useGetBucketByBcm({
    bcmId: bucketDetail.bucketMaster,
    module: TypeModule.CREDIT_CHECKING,
    process: TypeProcess.CREDIT_CHECKING_DPOP,
  });

  const { mutate: submitCreditCheckingRequest, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: (_, variables: { submitRequestDto: SubmitRequestDto }) => {
      const excludedActions = ['ASK_FOR_INFO_EDITED', 'ASK_FOR_INFO_SUMMARY_EDITED'];
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      if (!excludedActions.includes(variables.submitRequestDto.action)) {
        showNiceModalV2({
          onClose: () => {
            closeNiceModal(MODAL.GLOBAL.SUCCESS).then(() => {
              router.push(currentListPage);
            });
          },
          title: 'Data berhasil dikirim',
          type: 'success',
        });
      }
    },
  });

  const {
    masintonForm,
    masintonChange,
    masintonMultiChange,
    masintonMagic,
    masintonSubmit,
  } = useMasintonForm(formData, isRequestMode ? validation : {});

  const {
    requestType: { value: requestType },
    requestPurpose: { value: requestPurpose },
    checkThrough: { value: checkThrough },
    debtorRemark: { value: debtorRemark },
    shareholderRemark: { value: shareholderRemark },
    managementRemark: { value: managementRemark },
    otherRelateRemark: { value: otherRelateRemark },
  } = masintonForm;

  useEffect(() => {
    if (isFetchRequestDetailSuccess && requestDetail && !hasInitialized.current) {

      const newData = structuredClone(requestDetail);
      masintonMagic(newData ?? {});

      setSelectedDebtor(requestDetail?.debtors || []);
      setSelectedShareholder(requestDetail?.shareholders || []);
      setSelectedManagement(requestDetail?.managements || []);
      setSelectedOtherRelation(requestDetail?.otherRelates || []);

      hasInitialized.current = true;

    }
  }, [requestDetail, isFetchRequestDetailSuccess]);


  const hasInitializedSelection = React.useRef({
    debtor: false,
    management: false,
    otherRelation: false,
    shareholder: false,
  });

  const initializeTableSelection = useCallback((tableType: string, data: any[]) => {
    if (hasInitializedSelection.current[tableType]) return;

    const preSelectedItems = data?.filter((item) => item && item.id && item.isSelected === true) || [];

    if (preSelectedItems.length > 0) {
      const setSelectedFunction = {
        debtor: setSelectedDebtor,
        management: setSelectedManagement,
        otherRelation: setSelectedOtherRelation,
        shareholder: setSelectedShareholder,
      }[tableType];

      if (setSelectedFunction) {
        setSelectedFunction((prev) => {
          const validPrev = prev.filter((item) => item && item.id !== undefined && item.id !== null);
          const existingIds = new Set(validPrev.map((item) => item.id));

          const newItems = preSelectedItems.filter((item) =>
            item && item.id && !existingIds.has(item.id)
          );

          if (newItems.length === 0) return validPrev;
          return [...validPrev, ...newItems];
        });
      }

      // Mark as initialized
      hasInitializedSelection.current[tableType] = true;
    }
  }, []);

  React.useEffect(() => {
    hasInitializedSelection.current = {
      debtor: false,
      management: false,
      otherRelation: false,
      shareholder: false,
    };
  }, [processId]);

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    // Map form field names ke API response field names
    const fieldMapping: Record<string, string> = {
      'checkThrough': 'checkThrough',
      'otherRequestPurpose': 'otherRequestPurpose',
      'requestPurpose': 'requestPurpose',
      'requestRemark': 'requestRemark',
      'requestType': 'requestType',
    };

    const apiFieldName = fieldMapping[inputKey] || inputKey;
    const fieldData = differencesData?.[apiFieldName] as any;

    if (fieldData && fieldData.changed === true) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    let label = '';
    const fieldMapping: Record<string, string> = {
      'checkThrough': 'checkThrough',
      'otherRequestPurpose': 'otherRequestPurpose',
      'requestPurpose': 'requestPurpose',
      'requestRemark': 'requestRemark',
      'requestType': 'requestType',
    };

    const apiFieldName = fieldMapping[inputKey] || inputKey;
    const fieldData = differencesData?.[apiFieldName] as any;

    if (fieldData && fieldData.business !== undefined && fieldData.business !== null) {
      label = fieldData.business as string;
    }

    if (inputKey === 'requestType') {
      const requestTypeMapping: Record<string, string> = {
        'IMMEDIATE': 'Sangat Segera',
        'NORMAL': 'Biasa',
        'QUICK': 'Segera',
      };
      return requestTypeMapping[label] || label;
    }

    return label;
  };

  const getDataLabel = () => {
    return 'Data Sebelumnya';
  };

  const needCheckMaster = Boolean(
    differencesData &&
    Object.keys(differencesData).length > 0 &&
    Object.keys(differencesData).some((key) =>
      !['jsonDiffSummary'].includes(key) &&
      (differencesData[key] as any)?.changed === true
    )
  );
  // useEffect(() => {
  //   const isDebtorEqual = isEqualWithoutOrder(requestDetail?.debtors ?? [], selectedDebtor);
  //   const isManagementEqual = isEqualWithoutOrder(requestDetail?.managements ?? [], selectedManagement);
  //   const isShareholderEqual = isEqualWithoutOrder(requestDetail?.shareholders ?? [], selectedShareholder);
  //   const isOtherRelationEqual = isEqualWithoutOrder(requestDetail?.otherRelates ?? [], selectedOtherRelation);

  //   // Check if form data is the same as request detail
  //   const isSame =
  //     requestType === requestDetail?.requestType &&
  //     isEqualWithoutOrder(requestDetail?.requestPurpose, requestPurpose) &&
  //     otherRequestPurpose === requestDetail.otherRequestPurpose &&
  //     checkThrough === requestDetail?.checkThrough &&
  //     requestRemark === requestDetail?.requestRemark &&
  //     debtorRemark === requestDetail?.debtorRemark &&
  //     shareholderRemark === requestDetail?.shareholderRemark &&
  //     managementRemark === requestDetail?.managementRemark &&
  //     otherRelateRemark === requestDetail?.otherRelateRemark &&
  //     isDebtorEqual &&
  //     isManagementEqual &&
  //     isShareholderEqual &&
  //     isOtherRelationEqual;
  // }, [masintonForm, selectedDebtor, selectedManagement, selectedShareholder, selectedOtherRelation]);


  const listNotMandatory = [
    requestType,
    requestPurpose,
    checkThrough
  ];

  // validasi sebelum nya
  // const isMandatoryEmpty = !requestType || !checkThrough || requestPurpose.length === 0;

  // Validasi Saat ini Request Adit BA Isssue List Temuan UAT no. 18
  const isMandatoryEmpty = listNotMandatory.some((val) => {
    if (Array.isArray(val)) return val?.length > 0;
    return Boolean(val);
  });

  const filterAndMapIds = (items) => {
    return items
      .filter((item) => item !== null && item !== undefined && item.id !== null && item.id !== undefined)
      .map((item) => item.id);
  };

  const onSave = React.useCallback((isSaveAndNext = false) => {

    const payload = Object.assign(masintonSubmit(), {
      bucketProcessId: processId,
      debtorRemark,
      debtors: filterAndMapIds(selectedDebtor),
      managementRemark,
      managements: filterAndMapIds(selectedManagement),
      otherRelateRemark,
      otherRelates: filterAndMapIds(selectedOtherRelation),
      shareholderRemark,
      shareholders: filterAndMapIds(selectedShareholder),
    });

    saveCreditCheckingRequest(payload);
  }, [
    selectedDebtor,
    selectedShareholder,
    selectedManagement,
    selectedOtherRelation,
    processId,
    debtorRemark,
    managementRemark,
    otherRelateRemark,
    shareholderRemark,
    masintonSubmit,
    saveCreditCheckingRequest
  ]);

  const memoizedSelectedData = useMemo(() => ({
    debtors: filterAndMapIds(selectedDebtor),
    managements: filterAndMapIds(selectedManagement),
    otherRelates: filterAndMapIds(selectedOtherRelation),
    shareholders: filterAndMapIds(selectedShareholder),
  }), [
    selectedDebtor,
    selectedShareholder,
    selectedManagement,
    selectedOtherRelation
  ]);

  // Auto-save payload
  const autoSavePayload = useCallback(async () => {
    const formValues = masintonSubmit();

    return {
      ...formValues,
      bucketProcessId: processId,
      debtorRemark,
      managementRemark,
      otherRelateRemark,
      shareholderRemark,
      ...memoizedSelectedData,
    };
  }, [
    processId,
    debtorRemark,
    managementRemark,
    otherRelateRemark,
    shareholderRemark,
    memoizedSelectedData,
    masintonSubmit
  ]);


  // Auto-save
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && hasInitialized.current && !isSaveLoading,
    payload: autoSavePayload,
    url: 'creditChecking.creditChecking.save',
  });


  const validateMandatoryFields = () => {
    const isRequestTypeValid = !!requestType && requestType.trim() !== '';
    const isRequestPurposeValid = Array.isArray(requestPurpose)
      ? requestPurpose.length > 0 && requestPurpose.some((item) => item && item.trim() !== '')
      : !!requestPurpose;
    const isCheckThroughValid = Array.isArray(checkThrough)
      ? checkThrough.length > 0 && checkThrough.some((item) => item && item.trim() !== '')
      : !!checkThrough && checkThrough.trim() !== '';

    return isRequestTypeValid && isRequestPurposeValid && isCheckThroughValid;
  };

  const handleSaveRequest = (isSaveAndNext = false) => {
    setIsSavingAndGoingNext(isSaveAndNext);

    const isMandatoryValid = validateMandatoryFields();

    if (!isMandatoryValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => onSave(isSaveAndNext),
        submitText: 'Ya',
        title: 'DATA MANDATORY ada yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      onSave(isSaveAndNext);
    }
  };


  const handleRequestEdit = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onClose: () => {
        void closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      onSubmit: () => {
        requestEdit({
          bucketProcessId: processId,
        });

        // Check if stepper.from contains 'summary' to determine the action
        const action = stepper?.from?.toLowerCase().includes('summary')
          ? 'ASK_FOR_INFO_SUMMARY_EDITED'
          : 'ASK_FOR_INFO_EDITED';

        submitCreditCheckingRequest({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            module: TypeModule.CREDIT_CHECKING,
            process: TypeProcess.CREDIT_CHECKING,
          },
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin melakukan edit?',
      type: 'warning',
    });
  };

  const isSubmitWithForward = actions?.hasOwnProperty('WITH_EDIT_BUTTON') || actions?.hasOwnProperty('FORWARD_SUBMIT');

  const handleAskForInfo = ({ action, process }: { action: string; process: string }) => {
    const radioOption = [
      { label: 'Bisnis', value: 'BUSINESS' },
      { label: isRm ? 'TL' : 'KADIV', value: isRm ? 'TL' : 'KADIV' }
    ];

    const radioOptionByRole = isKadiv ? null : radioOption;
    if (isSubmitWithForward || isDpop) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment, radioValue }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            const actionByRadioValue = {
              'BUSINESS': ASK_FOR_INFO,
              'KADIV': ASK_FOR_INFO_KADIV_DPOP,
              'TL': ASK_FOR_INFO_TL_DPOP,
            };

            submitCreditCheckingRequest({
              submitRequestDto: {
                action: isKadiv ? ASK_FOR_INFO : actionByRadioValue[radioValue],
                bucketProcessId: processId,
                comment,
                module: TypeModule.CREDIT_CHECKING,
                process: isDpop ? TypeProcess.CREDIT_CHECKING_DPOP : TypeProcess.CREDIT_CHECKING,
              },
            }, {
              onSuccess: () => {
                recordActivity({
                  activity: ActivityType.ASK_FOR_INFO,
                  bucketProcessId: processId,
                  module: TypeModule.CREDIT_CHECKING,
                  process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
                  remarks: 'ask for info credit checking result ',
                });
              },
            });
          },
          radioLabel: 'Forward To',
          radioOptions: radioOptionByRole,
        },
      );
    } else {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            submitCreditCheckingRequest({
              submitRequestDto: {
                action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.CREDIT_CHECKING,
                process,
              },
            }, {
              onSuccess: () => {
                recordActivity({
                  activity: ActivityType.ASK_FOR_INFO,
                  bucketProcessId: processId,
                  module: TypeModule.CREDIT_CHECKING,
                  process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
                  remarks: 'ask for info credit checking result ',
                });
              },
            });
          },
        },
      );
    }

  };

  const handleSubmit = ({ process, action }: { process: string; action: string }) => {

    if (action === DECLINE) {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment, radioValue }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            submitCreditCheckingRequest({
              submitRequestDto: {
                action: radioValue,
                bucketProcessId: processId,
                comment,
                module: TypeModule.CREDIT_CHECKING,
                process: TypeProcess.CREDIT_CHECKING,
              },
            }, {
              onSuccess: () => {
                recordActivity({
                  activity: ActivityType.DECLINE,
                  bucketProcessId: processId,
                  module: TypeModule.CREDIT_CHECKING,
                  process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
                  remarks: 'decline credit checking result ',
                });
              },
            });
          },
          radioLabel: 'Decline',
          radioOptions: [
            { label: 'Cancelled', value: CANCELED },
            { label: 'Rejected', value: REJECTED }
          ],
        },
      );
    } else if (isSubmitWithForward) {

      const radioOptions = isKadiv
        ? undefined
        : [
          { label: 'DPOP', value: 'DPOP' },
          { label: isRm ? 'TL' : 'KADIV', value: isRm ? 'TL' : 'KADIV' }
        ];

      const getRadioValue = (radioValue: any) => isKadiv ? 'DPOP' : radioValue;

      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment, radioValue }) => {
            const submitRadioValue = getRadioValue(radioValue);
            const processValue = submitRadioValue === 'DPOP' ? TypeProcess.CREDIT_CHECKING_DPOP : TypeProcess.CREDIT_CHECKING;
            const checkEdit = (stepper.from === 'ASK_FOR_INFO_KADIV_EDITED' || stepper.from === 'ASK_FOR_INFO_SUMMARY_KADIV_EDITED') && isKadiv;

            const actionByRadioValue = {
              'DPOP': SUBMIT,
              'KADIV': ASK_FOR_INFO_SUMMARY_KADIV,
              'TL': ASK_FOR_INFO_SUMMARY_TL,
            };

            submitCreditCheckingRequest({
              submitRequestDto: {
                action: actionByRadioValue[submitRadioValue],
                bucketProcessId: submitRadioValue === 'DPOP' ? bcmData?.bucketProcessId : processId,
                comment,
                ...(checkEdit && { isCompleteEditAskForInfo: true }),
                module: TypeModule.CREDIT_CHECKING,
                process: processValue,
              },
            }, {
              onSuccess: () => {
                recordActivity({
                  activity: ActivityType.SUBMIT,
                  bucketProcessId: processId,
                  module: TypeModule.CREDIT_CHECKING,
                  process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
                  remarks: 'forward submit credit checking result ',
                });
              },
            });
          },
          radioLabel: 'Forward To',
          radioOptions: radioOptions,
        },
      );
    } else {
      NiceModal.show(
        MODAL.GLOBAL.COMMENT,
        {
          onSave: ({ comment }) => {
            const checkEdit = (stepper.from === 'ASK_FOR_INFO_KADIV_EDITED' || stepper.from === 'ASK_FOR_INFO_SUMMARY_KADIV_EDITED') && isKadiv;
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            submitCreditCheckingRequest({
              submitRequestDto: {
                action,
                bucketProcessId: processId,
                comment,
                module: TypeModule.CREDIT_CHECKING,
                process,
                ...(checkEdit && { isCompleteEditAskForInfo: true }),
              },
            }, {
              onSuccess: () => {
                recordActivity({
                  activity: ActivityType.SUBMIT,
                  bucketProcessId: processId,
                  module: TypeModule.CREDIT_CHECKING,
                  process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP,
                  remarks: 'submit credit checking result ',
                });
              },
            });
          },
        },
      );
    }
  };

  const renderActionButtons = () => {
    const checkBtnAfi = stepper?.from && stepper?.from.includes('ASK_FOR_INFO') ? false : viewOnly;
    if (JSON.stringify(actions) === '{}') {
      return [];
    }

    let buttonContents = [];

    for (const key in actions) {
      if (buttonListTemplateByKey.includes(key)) {
        const indexByKeyInTemplate = buttonListTemplateByKey.indexOf(key);
        buttonContents[indexByKeyInTemplate] = [key, actions[key]];
      }
    }

    const buttonlist = buttonContents.map((button) => {
      const [key, value]: string[] = button;
      const [action, process] = value.split('|');
      const isMandatoryValid = validateMandatoryFields();
      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              onClick={() => router.push(currentListPage)}
            >
              Close
            </Button>
          );
        case DECLINE:
          return (
            <Button
              variant="outlined"
              color="error"
              disabled={checkBtnAfi || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action: 'DECLINE', process: TypeProcess.CREDIT_CHECKING })}
            >
              Decline
            </Button>
          );
        case SAVE:
          return (
            <Button
              disabled={isVerifMode ? false : viewOnly || !isMandatoryEmpty || isSubmitLoading || isAutoSaveFetching}
              isLoading={isSaveLoading}
              onClick={() => handleSaveRequest(false)}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          );
        case 'SAVE_NEXT':
          return (
            <Button
              disabled={viewOnly || !isMandatoryEmpty || isSubmitLoading}
              isLoading={isSaveLoading}
              onClick={() => handleSaveRequest(true)}
            >
              Next
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              color="darkBlue"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_MAKER:
          return (
            <Button
              color="darkBlue"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to Maker
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              color="info"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to TL
            </Button>
          );
        case RETURN_TO_STAFF_DPOP:
          return (
            <Button
              color="secondary"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL_DPOP:
          return (
            <Button
              color="info"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to TL
            </Button>
          );
        case ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              isLoading={false}
              onClick={() => handleAskForInfo({ action, process })}
            >
              Ask For Info
            </Button>
          );
        case APPROVE_ASK_FOR_INFO:
          return (
            <Button
              color="lightYellow"
              isLoading={false}
              onClick={() => handleAskForInfo({ action, process })}
            >
              Approve Ask For Info
            </Button>
          );
        case 'FORWARD_SUBMIT':
          return (
            <Button
              color="success"
              disabled={checkBtnAfi || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              {isKadiv ? 'Approve' : 'Submit'}
            </Button>
          );
        case SUBMIT: {
          const shouldShowSubmit = (withSubmitAskForInfo && !isKadiv) ||
            isRm || isTL || (isTL && isBusinessDivision) || isMaker;

          const label = shouldShowSubmit ? 'Submit' : 'Approve';

          return (
            <Button
              color="success"
              disabled={viewOnly || !requestDetail?.isComplete || isSubmitLoading || !isMandatoryValid}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              {label}
            </Button>
          );
        }
        case 'RETURN_TO_DOC_VER':
          return (
            <Button
              color="darkBlue"
              disabled={isSaveLoading || isSubmitLoading}
              isLoading={isSubmitLoading}
              onClick={() => handleSubmit({ action, process })}
            >
              Return to Document Verification
            </Button>
          );
        default:
          return null;
      }
    });

    return buttonlist;
  };

  const isRenderSaveButtton = !withoutSaveButtonByStatus.includes(bucketDetail.status);

  const withSubmitAskForInfo = [ASK_FOR_INFO, ASK_FOR_INFO_TL, ASK_FOR_INFO_KADIV].includes(bucketDetail.status);
  const isRenderAskForInfoEditButton = actions?.hasOwnProperty('WITH_EDIT_BUTTON');

  return {
    bucketDetail,
    changeBgInput,
    currentListPage,
    differencesData,
    findDataMaster,
    getDataLabel,
    handleRequestEdit,
    hasInitializedSelection,
    initializeTableSelection,
    isMandatoryEmpty,
    isRenderAskForInfoEditButton,
    isRenderSaveButtton,
    isRequestMode,
    isRequestModule,
    isSaveLoading,
    isShowTableUploadDocument,
    isVerificationMode,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    needCheckMaster,
    renderActionButtons,
    selectedDebtor,
    selectedManagement,
    selectedOtherRelation,
    selectedShareholder,
    setSelectedDebtor,
    setSelectedManagement,
    setSelectedOtherRelation,
    setSelectedShareholder,
    withSubmitAskForInfo,
  };
};

export default useCreditCheckingRequestResult;
