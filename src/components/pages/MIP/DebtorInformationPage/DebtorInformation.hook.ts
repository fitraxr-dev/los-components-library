import { useContext, useEffect, useState, useMemo } from 'react';


import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import isEqualWith from 'lodash/isEqualWith';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { maintenanceDebtor, mip } from '@/configs/constants/pathname';
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
import useGetValidateResult from '@/hooks/services/master/debtor/useGetValidateResult';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import { debtorInformationSchema, initialFormValues, modal } from './DebtorInformation.constants';

import type { FormValues } from './DebtorInformation.types';
import type { TitleButtons } from '@/components/shared/Title/types';


const useDebtorInformation = () => {
  const [state, dispatch] = useApp();
  const { processId, analystId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const _module = state.pages.mipModule;
  const process = state.pages.mipProcess;
  const { goToNextStep } = useContext(MIPContext);
  const router = useCustomRouter();
  const [isProcessSave, setIsProcessSave] = useState(false);
  const [initialFormValue, setInitialFormValue] = useState(initialFormValues);
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false);
  const [processIdPrefix] = processId?.split('-') || [];
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const isAnalyst = processIdPrefix === 'MIPA';
  const isReview = state.pages.mipModule === TypeModule.MIP_REVIEW;
  const isMipr = processIdPrefix === 'MIPR';
  const isMip = processIdPrefix === 'MIP';
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isRM = state.currentRole.includes(roles.RM);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);
  const isStaffSuperAdmin = state.currentPosition.includes('TASK_FORCE');

  const { data: processTypeData } = useGetParameterList(Modules.TYPE_PROCESS);
  const { data: requestTypeData } = useGetParameterList(Modules.TYPE_SUBMISSION);
  const { data: financingTypeData } = useGetParameterList(Modules.FINANCING_TYPE);
  const [btnRequestIsValid, setBtnRequestIsValid] = useState<boolean>(false);

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: _module,
    process,
  }, { enabled: !!processId && !!_module && !!process });

  const isPemda = debtorInfoData?.institutionType === DebtorNamesetResponseDtoRegionalGovernEnum.MUNICIPALGOVERNMENT;

  const isRequestOtherProcessDisabled = !btnRequestIsValid || viewOnly ||
    (!isRM && !isSuperAdminMaker && !isStaffSuperAdmin);

  const { data: checkRequestData } = useCheckRequest({
    bucketMasterId: debtorInfoData?.bucketMasterId,
    process,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: debtorInfoData?.debtorId,
  }, {
    enabled: debtorInfoData?.debtorId !== null,
  });

  const { data: debtorDetail, pending: isLoadingDetail } = useGetDebtorDetail({
    bucketProcessId: processId,
    module: _module,
    process,
  }, { enabled: !!processId && !!_module && !!process });


  const formMethods = useForm({
    defaultValues: initialFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(debtorInformationSchema),
  });

  const { watch, formState: { isDirty } } = formMethods;
  const watchedValues = watch();
  useEffect(() => {
    if (debtorDetail) {
      const debtorDetailRecord = debtorDetail.debtor as Record<string, unknown>;
      const infraSectorOther = debtorDetailRecord?.infrastructureSectorOther;
      const debtorTypeLabel = debtorDetailRecord?.debtorTypeLabel as string | undefined;

      const initialPayload = {
        debtor: {
          contactPerson: debtorDetail.debtor.contactPerson,
          debtorName: debtorDetail.debtor.debtorName,
          debtorType: debtorTypeLabel ?? debtorDetail.debtor.debtorType,
          isAffiliate: debtorDetail.debtor.isAffiliate,
          isGroup: debtorDetail.debtor.isGroup,
          isRelatedToSmi: debtorDetail.debtor.isRelatedToSmi,
          position: {
            label: debtorDetail.debtor.position,
            value: debtorDetail.debtor.positionId,
          },
          relationshipSince: debtorDetail.debtor.relationshipSince,
          sectorName: infraSectorOther ?? debtorDetail.debtor.sectorName,
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
        menuCode: 'mip',
        module: state.pages?.mipModule,
        process: state.pages?.mipProcess,
        remarks: `save detail customer information from module ${state.pages?.mipModule}`,
      });
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});
      queryClient.invalidateQueries({ queryKey: ['coborrower-detail']});
      queryClient.invalidateQueries({ queryKey: ['syndication-detail']});
      queryClient.invalidateQueries({ queryKey: ['financial-performance-detail']});
      queryClient.invalidateQueries({ queryKey: ['type-detail']});
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const autoSavePayload = useMemo(() => async () => {
    const data = watchedValues;

    return {
      bucketProcessId: processId,
      coBorrower: null,
      debtor: {
        analystId,
        contactPerson: data.debtor?.contactPerson,
        debtorName: data.debtor?.debtorName,
        isAffiliate: data.debtor?.isAffiliate,
        positionId: data.debtor?.position?.value,
        relationshipSince: data.debtor?.relationshipSince,
        sectorName: data.debtor?.sectorName,
        yearFounded: data.debtor?.yearFounded,
      },
      financingType: data.financingType,
      module: _module,
      performanceFinancial: {
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
      },
      process: process,
      remarks: data.description,
      typeProcess: data.processType,
      typeSubmission: data.requestType,
    };
  }, [watchedValues, processId, analystId, _module, process]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !isAnalyst,
    payload: autoSavePayload,
    url: 'bucket.bucket.save',
  });

  const { data: bucketData, isSuccess: isBucketByIdSuccess, isLoading: isBucketByIdLoading } = useGetBucketById({
    bucketProcessId: String(processId),
    module: _module,
    process,
  });

  const {
    data: bucketProcessMipData,
    isError,
    isLoading: isBucketProcessMipLoading,
    isSuccess: isBucketProcessMipSuccess,
  } = useGetBucketProcessMip({
    bcmId: bucketData?.bucketMaster,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  }, {
    enabled: isBucketByIdSuccess && !!bucketData?.bucketMaster,
  });

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: processId,
    module: _module,
    process,
  });

  const checkValidasiInfoDebtur = ({
    debDetail,
  }) => {
    const {
      relationshipSince,
      sectorName,
      yearFounded,
    } = debDetail;
    const listArr = [
      relationshipSince,
      sectorName,
      yearFounded,
    ];
    const isValid = listArr?.every((item) => {
      if (typeof item === 'string') {
        return item.trim() !== '';
      }

      return item !== null && item !== undefined;
    });
    setBtnRequestIsValid(isValid);
  };


  const isMandatoryEmpty =
    !watch('debtor.relationshipSince') ||
    !watch('debtor.yearFounded') ||
    !watch('debtor.sectorName');

  const handleOnSave = (data: FormValues) => {
    setIsProcessSave(true);

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
        module: state.pages.mipModule,
        performanceFinancial,
        process: state.pages.mipProcess,
        remarks: data.description,
        typeProcess: data.processType,
        typeSubmission: data.requestType,
      });

      setIsProcessSave(false);
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

  useEffect(() => {
    const data = watch();
    const isSameAsInitial = isEqualWith(data, initialFormValue, (a, b) => {
      if ([null, undefined, ''].includes(a) && [null, undefined, ''].includes(b)) return true;
    });

    if (isDirty && !isProcessSave && !isSameAsInitial) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [isDirty, router]);


  const handleRouteMaintenanceDebitor = () => {
    const path = replacePath(
      maintenanceDebtor.LIST_PAGE,
      {
        debtorId: debtorInfoData?.debtorId,
        from: 'mip',
        module: 'maintenance',
      });
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const handleViewMip = () => {
    if (isError) return showNiceModalV2({
      title: 'Gagal Halaman yang dituju tidak ditemukan',
      type: 'error',
    });
    dispatch({
      data: { ...state.pages, lastPath: pathname },
      type: reducer.SET_PAGES,
    });

    const path = replacePath(mip.CUSTOMER_INFORMATION_PAGE, { processId: bucketProcessMipData?.bucketProcessId });
    router.push(setPreviewPage(path));
  };

  const listButtonRM = [{
    disabled: !debtorInfoData,
    iconName: 'mouse',
    isLoading: isLoadingMaintenance,
    label: 'Go to Maintenance Customer',
    onClick: handleRouteMaintenanceDebitor,
  }];

  const listButtonAnalyst: TitleButtons[] = [{
    disabled: !isBucketProcessMipSuccess,
    iconName: 'show',
    isLoading: !isBucketProcessMipSuccess,
    label: 'View MIP',
    onClick: handleViewMip,
  },
  {
    disabled: !debtorInfoData,
    iconName: 'mouse',
    isLoading: isLoadingMaintenance,
    label: 'Go to Maintenance Customer',
    onClick: handleRouteMaintenanceDebitor,
  }];

  const listButtonMipReview: TitleButtons[] = [{
    disabled: !isBucketProcessMipSuccess,
    iconName: 'show',
    isLoading: !isBucketProcessMipSuccess,
    label: 'View MIP',
    onClick: handleViewMip,
  }];

  const handleOpenRequestOtherProcessModal = () => {
    NiceModal.show(modal.REQUEST_OTHER_PROCESS, {
      bucketMasterId: debtorInfoData?.bucketMasterId,
    });
  };


  const listButton = isAnalyst ? listButtonAnalyst : isReview ? listButtonMipReview : listButtonRM;

  return {
    bucketMasterId: debtorInfoData?.bucketMasterId,
    checkRequestData,
    financingTypeData,
    formMethods,
    goToNextStep,
    handleOnSave,
    handleOpenRequestOtherProcessModal,
    isAnalyst,
    isAutoSaveFetching,
    isLoadingDetail,
    isMip,
    isMipr,
    isPemda,
    isRM,
    isRequestOtherProcessDisabled,
    isReview,
    isSaveDebtorLoading,
    isStaffSuperAdmin,
    isSuperAdminMaker,
    isValidateSuccess,
    listButton,
    module: _module,
    process,
    processTypeData,
    requestTypeData,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    validateResult,
  };
};

export default useDebtorInformation;
