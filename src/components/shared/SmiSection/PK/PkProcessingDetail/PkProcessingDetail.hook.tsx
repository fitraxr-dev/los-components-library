import { useEffect, useMemo, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import useGetDetailProcessingType from '../hooks/useGetDetailProcessingType';

import { assumptionPath, initialPathStep, tab, TAB_ITEMS_PK } from './PkProcessingDetail.constants';


const usePkProcessingDetail = (isLegalSigning: boolean) => {
  const [appState, dispatch] = useApp();
  const [activeTab, setActiveTab] = useState(tab.TAB_1);
  const { childId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const params = useParams();
  const idPath = Number(params.id);
  const { data: pkDetail, isSuccess: isSuccessDetail } = useGetDetailProcessingType({ id: idPath });
  const { data: bucketStepperData, isSuccess } = useGetBucketStepper({
    bucketProcessId: String(childId),
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.PROCESSING_TYPE_PK,
  }, { refetchOnWindowFocus: false });
  const urlPath = assumptionPath;
  const { steps } = bucketStepperData;
  const isAskForInfoPK = isSuccessDetail && pkDetail?.status === 'ASK_FOR_INFO';
  const isCompletedPK = isSuccessDetail && pkDetail?.status === 'PKPT_COMPLETED';
  const pkStatus = isSuccessDetail && pkDetail?.status;

  const actionBtn = isSuccess && steps.find((res) => res?.urlPath === urlPath)?.action;

  const LIST_TAB = useMemo(() => {
    if (isLegalSigning && isSuccess && steps && steps.length > 0) {
      const tabs = steps.map((step, index) => ({
        isButtonShow: step.isButtonShow || false,
        label: step.label || '',
        value: `TAB_${index + 1}`,
      }));
      return tabs;
    }
    return TAB_ITEMS_PK;
  }, [isLegalSigning, isSuccess, steps]);

  useEffect(() => {
    dispatch({
      data: bucketStepperData,
      type: reducer.SET_STEPPER,
    });
  }, [bucketStepperData, dispatch]);

  const stepper = useMemo(() => appState.stepper, [appState.stepper]);

  useEffect(() => {
    // Helper untuk update state hanya jika berubah agar tidak infinite loop
    const updateViewOnly = (val: boolean) => {
      if (appState.viewOnly !== val) {
        setViewOnly(val);
      }
    };

    // 1. Set base viewOnly from stepper data
    let baseViewOnly = false;
    if (stepper.steps.length > 0) {
      if (activeTab === tab.TAB_1) {
        baseViewOnly = !stepper.steps[0].enable;
      }
    } else if (isLegalSigning) {
      baseViewOnly = true;
    }

    if (baseViewOnly) {
      updateViewOnly(true);
      return;
    }

    /**
     * 2. Skip override jika user sedang dalam mode edit "ask for info"
     * (ditandai dengan localStorage 'askForInfoEditPk')
     * agar setViewOnly(false) dari handleEdit tidak di-cancel oleh effect ini.
     */
    const askForInfoEditPk = localStorage.getItem('askForInfoEditPk');
    if (askForInfoEditPk) {
      updateViewOnly(false);
      return;
    }

    /**
     * 3. Override to true: To handle "ask for info" in Pengajuan Perikatan
     * (currently, it doesn't account for editing from the action stepper)
     */
    if (isAskForInfoPK) {
      updateViewOnly(true);
      return;
    }

    // 4. Override to true: Jika PKPT sudah selesai dan bukan di menu Legal Signing
    if (!isLegalSigning && isCompletedPK) {
      updateViewOnly(true);
      return;
    }

    updateViewOnly(false);
  }, [stepper, isLegalSigning, isAskForInfoPK, isCompletedPK, setViewOnly, appState.viewOnly]);

  const handleCheckViewOnly = (tab: string) => {
    const urlPath = initialPathStep?.find((res) => res.tab === tab)?.urlPath;
    const viewOnly = !steps.find((step) => step.urlPath === urlPath)?.enable;
    const askForInfoEditPk = localStorage.getItem('askForInfoEditPk');
    if (!askForInfoEditPk) {
      setViewOnly(viewOnly);
      if (isCompletedPK) {
        setViewOnly(true);
      }
    }
    // else {
    //   if (!isAskForInfoPK) {
    //     console.log('isAskForInfoPK', isAskForInfoPK);
    //     setViewOnly(false);
    //   }
    // }
  };

  const handleChangeTab = (val: string) => {
    handleCheckViewOnly(val);
    setActiveTab(val);
  };

  const handleNextTabPk = () => {
    handleCheckViewOnly(tab.TAB_2);
    setActiveTab(tab.TAB_2);
  };

  const handleNextAssumsi = () => {
    handleCheckViewOnly(tab.TAB_3);
    setActiveTab(tab.TAB_3);
  };

  const handleNextDraftMemo = () => {
    setActiveTab(tab.TAB_4);
  };

  return {
    LIST_TAB,
    actionBtn,
    activeTab,
    childId,
    handleChangeTab,
    handleNextAssumsi,
    handleNextDraftMemo,
    handleNextTabPk,
    isAskForInfoPK,
    isCompletedPK,
    pkStatus,
  };
};

export default usePkProcessingDetail;
