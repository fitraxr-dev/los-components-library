import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import isEqualWith from 'lodash/isEqualWith';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { annualReview, maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckRequest from '@/hooks/services/bucket/debtor/useCheckRequest';
import useGetDebtorDetail from '@/hooks/services/bucket/debtor/useGetDebtorDetail';
import useGetDetailBucketDebtor from '@/hooks/services/bucket/debtor/useGetDetailBucketDebtor';
import useSaveDebtorInformation from '@/hooks/services/bucket/debtor/useSaveDebtorInformation';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetBucketProcessMip from '@/hooks/services/bucket/useGetBucketProcessMip';
import useGetDetailMasterDebtor from '@/hooks/services/master/debtor/useGetDetailMasterDebtor';
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { debtorInformationSchema, initialFormValues, modal } from './DebtorInformation.constants';

import type { FormValues } from './DebtorInformation.types';
import type { TitleButtons } from '@/components/shared/Title/types';


const useDebtorInformation = () => {
  const [state, dispatch] = useApp();
  const { processId, analystId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const params = useParams();
  const isPreview = Boolean(useSearchParams().get('isPreview'));
  const _module = TypeModule.ANNUAL_REVIEW;
  const router = useCustomRouter();
  // const [isProcessSave, setIsProcessSave] = useState(false);
  const [initialFormValue, setInitialFormValue] = useState(initialFormValues);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isRM = state.currentRole.includes(roles.RM);
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isSuperAdmin = isMaker || isChecker;
  const { isDepiDivision, typeProcess, goToNextStep, actions, isBusinessDivision } = useAnnualReviewContext();
  const theme = useTheme();
  const { isAnalyst } = useAnnualReviewContext();
  const { data: processTypeData } = useGetParameterList(Modules.TYPE_PROCESS);
  const { data: requestTypeData } = useGetParameterList(Modules.TYPE_SUBMISSION);
  const { data: financingTypeData } = useGetParameterList(Modules.FINANCING_TYPE);
  const [btnRequestIsValid, setBtnRequestIsValid] = useState<boolean>(false);

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: _module,
    process: typeProcess,
  }, { enabled: !!processId && !!_module && !!typeProcess });

  const { data: debtorMasterData } = useGetDetailMasterDebtor({
    debtorId: debtorInfoData?.debtorId,
  }, { enabled: !!debtorInfoData?.debtorId });

  const isPemda = debtorInfoData?.institutionType === DebtorNamesetResponseDtoRegionalGovernEnum.MUNICIPALGOVERNMENT;

  const isRequestOtherProcessDisabled = !btnRequestIsValid || viewOnly || (isSuperAdmin ? !isSuperAdmin : !isRM);

  const { data: checkRequestData } = useCheckRequest({
    bucketMasterId: debtorInfoData?.bucketMasterId,
    process: typeProcess,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: debtorInfoData?.debtorId !== null,
  });

  const { data: debtorDetail, pending: isLoadingDetail } = useGetDebtorDetail({
    bucketProcessId: String(processId),
    module: _module,
    process: typeProcess,
  }, { enabled: !!processId && !!_module && !!typeProcess });

  const formMethods = useForm({
    defaultValues: initialFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(debtorInformationSchema),
  });

  const { watch, formState: { isDirty } } = formMethods;

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: processId,
    module: _module,
    process: typeProcess,
  });

  useEffect(() => {
    if (debtorDetail) {
      const initialPayload = {
        debtor: {
          contactPerson: debtorDetail.debtor.contactPerson,
          debtorName: debtorDetail.debtor.debtorName,
          debtorType: debtorDetail.debtor.debtorType,
          isAffiliate: debtorDetail.debtor.isAffiliate,
          isGroup: debtorDetail.debtor.isGroup,
          isRelatedToSmi: debtorDetail.debtor.isRelatedToSmi,
          position: {
            label: debtorDetail.debtor.position,
            value: debtorDetail.debtor.positionId,
          },
          relationshipSince: debtorDetail.debtor.relationshipSince,
          sectorName: debtorDetail.debtor.sectorName,
          yearFounded: debtorDetail.debtor.yearFounded,
        },
        description: debtorDetail.description,
        financingType: debtorDetail.debtor.typeFinancing,
        performanceFinancial: {
          assets: {
            currency: debtorDetail.performanceFinancial.currencyAssets,
            value: debtorDetail.performanceFinancial.assets,
          },
          ebitda: {
            currency: debtorDetail.performanceFinancial.currencyEbitda,
            value: debtorDetail.performanceFinancial.ebitda,
          },
          equity: {
            currency: debtorDetail.performanceFinancial.currencyEquity,
            value: debtorDetail.performanceFinancial.equity,
          },
          income: {
            currency: debtorDetail.performanceFinancial.currencyIncome,
            value: debtorDetail.performanceFinancial.income,
          },
          liability: {
            currency: debtorDetail.performanceFinancial.currencyLiability,
            value: debtorDetail.performanceFinancial.liability,
          },
          netProfit: {
            currency: debtorDetail.performanceFinancial.currencyNetProfit,
            value: debtorDetail.performanceFinancial.netProfit,
          },
          performanceFinancialDate: debtorDetail.performanceFinancial.performanceFinancialDate,
        },
        processType: debtorDetail.debtor.typeProcess,
        requestType: debtorDetail.debtor.typeProposal,
      };

      checkValidasiInfoDebtur({
        debDetail: initialPayload.debtor,
        financingType: initialPayload.financingType,
        processType: initialPayload.processType,
        requestType: initialPayload.requestType,
      });

      setInitialFormValue(initialPayload);
    }
  }, [debtorDetail]);

  useEffect(() => {
    if (initialFormValue) {
      formMethods.reset(initialFormValue, { keepDirty: false });
    }
  }, [initialFormValue]);

  const {
    mutate: saveDebtorInformation,
    isPending: isSaveDebtorLoading,
  } = useSaveDebtorInformation({
    onError: () => showNiceModalV2({
      title: 'Data gagal disimpan',
      type: 'error',
    }),
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify(data),
        changeBefore: JSON.stringify(debtorDetail),
        menuCode: 'annual-review',
        module: _module,
        process: typeProcess,
        remarks: `save detail customer information from module ${_module}`,
      });
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});
      queryClient.invalidateQueries({ queryKey: ['coborrower-detail']});
      queryClient.invalidateQueries({ queryKey: ['syndication-detail']});
      queryClient.invalidateQueries({ queryKey: ['financial-performance-detail']});
      queryClient.invalidateQueries({ queryKey: ['type-detail']});
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose() { },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { data: bucketData, isSuccess: isBucketByIdSuccess, isLoading: isBucketByIdLoading } = useGetBucketById({
    bucketProcessId: String(processId),
    module: _module,
    process: typeProcess,
  });

  const {
    data: bucketProcessMipData,
    isError,
    isSuccess: isBucketProcessMipSuccess,
  } = useGetBucketProcessMip({
    bcmId: bucketData?.bucketMaster,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  }, {
    enabled: isBucketByIdSuccess && !!bucketData?.bucketMaster,
  });

  const checkValidasiInfoDebtur = ({
    debDetail,
    financingType,
    processType,
    requestType,
  }) => {
    // const {
    //   position: { value: positionVal },
    //   relationshipSince,
    //   sectorName,
    //   yearFounded,
    // } = debDetail;
    const listArr = [
      // positionVal,
      // relationshipSince,
      // sectorName,
      // yearFounded,
      // financingType,
      // processType,
      requestType
    ];
    console.log('listArr', listArr);
    const isValid = listArr?.every((item) => item !== '' && item !== null && item !== undefined);
    setBtnRequestIsValid(isValid);
  };


  const isMandatoryEmpty = !watch('requestType');

  const handleOnSave = (data: FormValues) => {
    // setIsProcessSave(true);

    const debtorPayload = {
      analystId,
      contactPerson: data.debtor.contactPerson,
      debtorName: data.debtor.debtorName,
      isAffiliate: data.debtor.isAffiliate,
      positionId: data.debtor.position.value,
      relationshipSince: data.debtor.relationshipSince,
      sectorName: data.debtor.sectorName,
      yearFounded: data.debtor.yearFounded,
    };

    const performanceFinancial = {
      assets: data.performanceFinancial.assets?.value,
      currencyAssets: data.performanceFinancial.assets?.currency,
      currencyEbitda: data.performanceFinancial.ebitda?.currency,
      currencyEquity: data.performanceFinancial.equity?.currency,
      currencyIncome: data.performanceFinancial.income?.currency,
      currencyLiability: data.performanceFinancial.liability?.currency,
      currencyNetProfit: data.performanceFinancial.netProfit?.currency,
      ebitda: data.performanceFinancial.ebitda?.value,
      equity: data.performanceFinancial.equity?.value,
      income: data.performanceFinancial.income?.value,
      liability: data.performanceFinancial.liability?.value,
      netProfit: data.performanceFinancial.netProfit?.value,
      performanceFinancialDate: data.performanceFinancial.performanceFinancialDate,
    };

    const saveDebtor = () => {
      saveDebtorInformation({
        bucketProcessId: processId,
        coBorrower: null,
        debtor: debtorPayload,
        financingType: data.financingType,
        module: _module,
        performanceFinancial,
        process: typeProcess,
        remarks: data.description,
        typeProcess: data.processType,
        typeSubmission: data.requestType,
      });

      // setIsProcessSave(false);
    };

    if (isMandatoryEmpty) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => saveDebtor(),
        submitText: 'Ya',
        title: 'Data mandatory belum diisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveDebtor();
    }
  };

  const handleSaveAndNext = (data: FormValues) => {
    if (!viewOnly && !isAnalyst && !isDepiDivision) {
      handleOnSave(data);
      router.push(replacePath(annualReview.FACILITY_OVERVIEW, {
        pageModule: params?.pageModule, processId: params?.processId,
      }));
    } else {
      if (isPreview) {
        router.push(setPreviewPage(replacePath(annualReview.FACILITY_OVERVIEW, {
          pageModule: params?.pageModule, processId: params?.processId,
        })));
      } else {
        router.push(replacePath(annualReview.FACILITY_OVERVIEW, {
          pageModule: params?.pageModule, processId: params?.processId,
        }));
      }
    }
  };

  // useEffect(() => {
  //   const data = watch();
  //   const isSameAsInitial = isEqualWith(data, initialFormValue, (a, b) => {
  //     if ([null, undefined, ''].includes(a) && [null, undefined, ''].includes(b)) return true;
  //   });

  //   if (isDirty && !isProcessSave && !isSameAsInitial) {
  //     setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
  //   } else {
  //     setDirtyMsg(undefined);
  //   }
  // }, [isDirty, router]);

  const handleRouteMaintenanceDebitor = () => {
    let path = '';
    if (!debtorMasterData?.bucketProcessId) {
      NiceModal.show(
        MODAL.GLOBAL.ERROR,
        {
          message: 'Customer sedang tidak dalam maintenance',
          title: 'Error',
        }
      );
    } else {
      path = replacePath(
        maintenanceDebtor.GENERAL_CUSTOMER_INFORMATION,
        {
          module: 'maintenance',
          processId: debtorMasterData?.bucketProcessId,
        });
      window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewAnnualReview = () => {
    if (!bucketData?.bucketParentId) return showNiceModalV2({
      title: 'Gagal Halaman yang dituju tidak ditemukan',
      type: 'error',
    });
    // dispatch({
    //   data: { ...state.pages, lastPath: pathname },
    //   type: reducer.SET_PAGES,
    // });

    const path = replacePath(
      annualReview.CUSTOMER_INFORMATION_PAGE, { pageModule: 'request', processId: bucketData?.bucketParentId });
    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };

  const listButtonRM = [{
    disabled: !debtorInfoData,
    iconName: 'mouse',
    isLoading: isLoadingMaintenance,
    label: 'Go to Maintenance Customer',
    onClick: handleRouteMaintenanceDebitor,
  }];

  const listButtonDepi: TitleButtons[] = [{
    disabled: !bucketData?.bucketParentId || isBucketByIdLoading,
    iconName: 'show',
    isLoading: isBucketByIdLoading,
    label: 'View Request',
    onClick: handleViewAnnualReview,
  },
    // {
    //   disabled: !debtorInfoData,
    //   iconName: 'mouse',
    //   isLoading: isLoadingMaintenance,
    //   label: 'Go to Maintenance Customer',
    //   onClick: handleRouteMaintenanceDebitor,
    // }
  ];

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: (error: any) => {
        showNiceModalV2({ title: error?.message, type: 'error' });
      },
      onSuccess: (_, variables) => {
        if (variables?.submitRequestDto?.action === 'EDIT') {
          showNiceModalV2({
            title: '',
            type: 'success',
          });
          window.location.reload();
        }
      },
    }
  );

  const handleEdit = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: _module,
            process: typeProcess,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
      },
      title: 'Data sebelumnya akan diubah dengan Penerbitan yang baru, Apakah anda yakin?',
    });
  };

  const isEdit = !!actions?.['EDIT'];
  const isRequestOtherProcessAction = !!actions?.['REQUEST_OTHER_PROCESS'];

  const handleOpenRequestOtherProcessModal = () => {
    NiceModal.show(modal.REQUEST_OTHER_PROCESS, {
      bucketMasterId: debtorInfoData?.bucketMasterId,
    });
  };


  const listButton = isDepiDivision && !isPreview ? listButtonDepi : !isAnalyst ? listButtonRM : [];

  const autoSavePayload = useMemo(() => () => {
    const data = formMethods.getValues();

    if (!processId || !data.debtor?.debtorName) return Promise.resolve(null);

    const debtorPayload = {
      analystId,
      contactPerson: data.debtor.contactPerson,
      debtorName: data.debtor.debtorName,
      isAffiliate: data.debtor.isAffiliate,
      positionId: data.debtor.position?.value,
      relationshipSince: data.debtor.relationshipSince,
      sectorName: data.debtor.sectorName,
      yearFounded: data.debtor.yearFounded,
    };

    const performanceFinancial = {
      assets: data.performanceFinancial?.assets?.value,
      currencyAssets: data.performanceFinancial?.assets?.currency,
      currencyEbitda: data.performanceFinancial?.ebitda?.currency,
      currencyEquity: data.performanceFinancial?.equity?.currency,
      currencyIncome: data.performanceFinancial?.income?.currency,
      currencyLiability: data.performanceFinancial?.liability?.currency,
      currencyNetProfit: data.performanceFinancial?.netProfit?.currency,
      ebitda: data.performanceFinancial?.ebitda?.value,
      equity: data.performanceFinancial?.equity?.value,
      income: data.performanceFinancial?.income?.value,
      liability: data.performanceFinancial?.liability?.value,
      netProfit: data.performanceFinancial?.netProfit?.value,
      performanceFinancialDate: data.performanceFinancial?.performanceFinancialDate,
    };

    return Promise.resolve({
      bucketProcessId: processId,
      coBorrower: null,
      debtor: debtorPayload,
      financingType: data.financingType,
      module: _module,
      performanceFinancial,
      process: typeProcess,
      remarks: data.description,
      typeProcess: data.processType,
      typeSubmission: data.requestType,
    });
  }, [formMethods, processId, analystId, _module, typeProcess]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !isAnalyst && !isDepiDivision && !!debtorDetail,
    payload: autoSavePayload,
    url: 'bucket.bucket.save',
  });

  return {
    checkRequestData,
    financingTypeData,
    formMethods,
    handleEdit,
    handleOnSave,
    handleOpenRequestOtherProcessModal,
    handleSaveAndNext,
    isAnalyst,
    isAutoSaveFetching,
    isBusinessDivision,
    isDepiDivision,
    isEdit,
    isLoadingDetail,
    isPemda,
    isPreview,
    isRM,
    isRequestOtherProcessAction,
    isRequestOtherProcessDisabled,
    isSaveDebtorLoading,
    isSuperAdmin,
    isValidateSuccess,
    listButton,
    module: _module,
    processTypeData,
    requestTypeData,
    stepperStatus: stepperData?.from,
    theme,
    typeProcess,
    validateResult,
    viewOnly,
  };
};

export default useDebtorInformation;
