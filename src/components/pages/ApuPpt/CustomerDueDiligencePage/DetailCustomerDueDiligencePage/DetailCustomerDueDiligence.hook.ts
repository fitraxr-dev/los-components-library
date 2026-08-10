import { useEffect, useMemo, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { TypeModule } from '@/enums/Module';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useIdentity from '@/hooks/useIdentity';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetDetailCustomerDueDiligence from '../hooks/useGetDetailCustomerDueDiligence';


const useDetailCustomerDueDiligence = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { processId } = useIdentity();
  const { process } = useApuPpt();
  const [assessmentContainer, setAssessmentContainer] = useState(null);
  const [verificationContainer, setVerificationContainer] = useState(null);
  const [radioButtonValue, setRadioButtonValue] = useState({
    isAssessment: null,
    isVerification: null,
  });
  const isApdb = processId?.split('-')[0] === 'APDP';

  const { data: bucketStepperData, isSuccess } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process,
  });
  const ownerId = searchParams.get('ownerId');


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

  const customerDetail = {
    assessmentResult: data?.assessmentResult,
    assessmentSummary: data?.assessmentSummary,
    document: data?.document,
    verificationResult: data?.verificationResult,
  };

  useEffect(() => {
    if (!isLoading) {
      setRadioButtonValue({
        isAssessment: data?.assessmentSummary,
        isVerification: data?.verificationSummary,
      });
    }
  }, [data]);

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

  return {
    assessmentContainer,
    customerDetail,
    getActionButton,
    initialSectionFormat,
    isApdb,
    isLoading,
    ownerId,
    radioButtonValue,
    setAssessmentContainer,
    setRadioButtonValue,
    setVerificationContainer,
    verificationContainer,
  };
};

export default useDetailCustomerDueDiligence;
