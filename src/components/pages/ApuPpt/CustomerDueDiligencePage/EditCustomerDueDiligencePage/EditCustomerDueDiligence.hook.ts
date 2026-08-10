import { useContext, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';


import { DPOP_DIVISION } from '@/configs/constants';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetDetailCustomerDueDiligence from '../hooks/useGetDetailCustomerDueDiligence';
import useSaveCustomerDueDiligence from '../hooks/useSaveCustomerDueDiligence';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


type RadioButtonValue = {
  isAssessment: boolean | null;
  isVerification: boolean | null;
}

const useEditCustomerDueDiligence = () => {
  const { currentUserDivision } = useApuPptContext();
  const { processId } = useIdentity();
  const params = useParams();
  const router = useCustomRouter();
  const path = usePathname();
  const { process } = useApuPpt();
  const searchParams = useSearchParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const [assessmentContainer, setAssessmentContainer] = useState<DocumentEditorContainerComponent>(null);
  const [verificationContainer, setVerificationContainer] = useState<DocumentEditorContainerComponent>(null);
  const [radioButtonValue, setRadioButtonValue] = useState<RadioButtonValue>({
    isAssessment: null,
    isVerification: null,
  });
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    assessmentResult: false,
    verificationResult: false,
  });
  // customer-due-diligence
  const { data: bucketStepperData, isSuccess } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process,
  });
  const ownerId = searchParams.get('ownerId');

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });

  const getActionButton = useMemo(() => {
    let actionBtn = {};
    if (isSuccess && bucketStepperData?.steps?.length > 0) {
      const newAct = bucketStepperData?.steps?.find((item) => item.urlPath === 'customer-due-diligence');
      if (newAct) {
        actionBtn = newAct?.action;
      }
    }
    return actionBtn;
  }, [bucketStepperData]);

  const { data, isLoading } = useGetDetailCustomerDueDiligence({
    id: Number(params.id),
  });

  useEffect(() => {
    if (data?.assessmentResult !== null || data?.verificationResult !== null) {
      if (assessmentContainer !== null || verificationContainer !== null) {
        setIsWordEditorEmpty({
          assessmentResult: assessmentContainer?.documentEditor?.isDocumentEmpty,
          verificationResult: verificationContainer?.documentEditor?.isDocumentEmpty,
        });
      } else {
        setIsWordEditorEmpty({
          assessmentResult: true,
          verificationResult: true,
        });
      }
    } else {
      setIsWordEditorEmpty({
        assessmentResult: true,
        verificationResult: true,
      });
    }

  }, [assessmentContainer, verificationContainer, data]);


  const isDpop = process === TypeProcess.APU_PPT_DPOP;
  const isMandatoryEmpty =
    (!isDpop && (radioButtonValue.isAssessment === null || isWordEditorEmpty.assessmentResult)) ||
    (isDpop && (radioButtonValue.isVerification === null || isWordEditorEmpty.verificationResult));

  useEffect(() => {
    if (!isLoading) {
      setRadioButtonValue({
        isAssessment: data?.assessmentSummary,
        isVerification: data?.verificationSummary,
      });
    }
  }, [data]);

  const handleCloseEdit = () => {
    const diligencePath = `/${path?.split('/')?.slice(1, 6)?.join('/')}`;
    router.replace(diligencePath);
  };

  const { mutate: saveCustomer, isPending: isSaveCustomerLoading } = useSaveCustomerDueDiligence({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence']});
      showNiceModalV2({
        onClose: handleCloseEdit,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const checkVerification = useMemo(() => {
    let verification = false;
    const isApdb = processId?.split('-')[0] === 'APDP';

    if (!isApdb) {
      verification = true;
    }
    return verification;

  }, [processId, data]);

  const handleOnSave = async () => {

    const verificationResult = checkVerification ? undefined : await convertToDocx(verificationContainer);
    const assessmentResult = await convertToDocx(assessmentContainer);


    const payload = {
      assessmentResult: assessmentResult,
      assessmentSummary: radioButtonValue.isAssessment,
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      document: data.document,
      id: Number(params.id),
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      verificationResult: verificationResult,
      verificationSummary: radioButtonValue.isVerification !== null ? radioButtonValue.isVerification : undefined,
    };
    saveCustomer(payload);
  };

  const initialSectionFormat = {
    bottomMargin: 5.00,
    footerDistance: 0,
    headerDistance: 0,
    leftMargin: 5.00,
    pageHeight: 792,
    pageWidth: 447.30,
    rightMargin: 5.00,
    topMargin: 0,
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => async () => {
    const verificationResult = checkVerification ? undefined : await convertToDocx(verificationContainer);
    const assessmentResult = await convertToDocx(assessmentContainer);


    const payload = {
      assessmentResult: assessmentResult,
      assessmentSummary: radioButtonValue.isAssessment,
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      document: data.document,
      id: Number(params.id),
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      verificationResult: verificationResult,
      verificationSummary: radioButtonValue.isVerification !== null ? radioButtonValue.isVerification : undefined,
    };
    return Promise.resolve(payload);
  }, [
    assessmentContainer,
    bucketDetail,
    verificationContainer,
    checkVerification,
    processId,
    data,
    params.id,
    isDpop,
    radioButtonValue
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly &&
                !!params.id &&
                !!processId,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveDocCdd',
  });


  return {
    assessmentContainer,
    data,
    getActionButton,
    handleCloseEdit,
    handleOnSave,
    initialSectionFormat,
    isAutoSaveFetching,
    isDpop,
    isLoading,
    isMandatoryEmpty,
    isSaveCustomerLoading,
    isWordEditorEmpty,
    ownerId,
    radioButtonValue,
    setAssessmentContainer,
    setIsWordEditorEmpty,
    setRadioButtonValue,
    setVerificationContainer,
    verificationContainer,
    viewOnly,
  };
};

export default useEditCustomerDueDiligence;
