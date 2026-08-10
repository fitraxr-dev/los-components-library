import { useEffect, useMemo, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { TypeModule } from '@/enums/Module';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetDetailDebtorDocument from '../hooks/useGetDetailDebtorDocument';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


type DpopRadioButton = {
  isCopy: boolean | null;
  isDpopCheck: boolean | null;
  status: string;
}

const useDetailDebtorDocument = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentUserDivision } = useApuPptContext();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { process } = useApuPpt();
  const [assessmentContainer, setAssessmentContainer] = useState<DocumentEditorContainerComponent>(null);
  const [verificationContainer, setVerificationContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isBusinessCheck, setIsBusinessCheck] = useState(null);
  const [dpopRadioButton, setDpopRadioButton] = useState<DpopRadioButton>({
    isCopy: null,
    isDpopCheck: null,
    status: '',
  });


  const isApdb = processId?.split('-')[0] === 'APDP';
  const { data: bucketStepperData, isSuccess } = useGetBucketStepper({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process,
  });

  const ownerId = searchParams.get('ownerId');
  const type = searchParams.get('type');

  const getActionButton = useMemo(() => {
    let actionBtn = {};
    if (isSuccess && bucketStepperData?.steps?.length > 0) {
      const newAct = bucketStepperData?.steps?.find((item) => item.urlPath === 'debtor-document');
      if (newAct) {
        actionBtn = newAct?.action;
      }
    }
    return actionBtn;
  }, [bucketStepperData]);

  const { data: debtorDocumentStatus } = useGetParameterList('apDebtorDocumentStatus');
  const { data, isLoading } = useGetDetailDebtorDocument({
    id: Number(params.id),
  });


  useEffect(() => {
    if (!isLoading) {
      setIsBusinessCheck(data?.isBusinessCheck);
      setDpopRadioButton({
        isCopy: data?.isCopy,
        isDpopCheck: data?.isDpopCheck,
        status: data?.status,
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
    data,
    debtorDocumentStatus,
    dpopRadioButton,
    getActionButton,
    initialSectionFormat,
    isApdb,
    isBusinessCheck,
    isLoading,
    ownerId,
    router,
    setAssessmentContainer,
    setDpopRadioButton,
    setIsBusinessCheck,
    setVerificationContainer,
    type,
    verificationContainer,
  };
};

export default useDetailDebtorDocument;
