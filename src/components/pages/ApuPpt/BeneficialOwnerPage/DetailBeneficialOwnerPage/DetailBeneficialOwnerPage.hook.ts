import { useContext, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetDetailBeneficialOwner from '../hooks/useGetDetailBeneficialOwner';
import useSaveBeneficialOwner from '../hooks/useSaveBeneficialOwner';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


type DpopRadioButton = {
  isCopy: boolean | null;
  isDpopCheck: boolean | null;
  status: string;
}

const useDetailBeneficialOwner = () => {
  const params = useParams();
  const path = usePathname();
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();
  const [assessmentContainer, setAssessmentContainer] = useState<DocumentEditorContainerComponent>(null);
  const [verificationContainer, setVerificationContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isBusinessCheck, setIsBusinessCheck] = useState(false);
  const { process } = useApuPpt();
  const [dpopRadioButton, setDpopRadioButton] = useState<DpopRadioButton>({
    isCopy: null,
    isDpopCheck: null,
    status: '',
  });
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    assessmentResult: false,
    verificationResult: false,
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
      const newAct = bucketStepperData?.steps?.find((item) => item.urlPath === 'beneficial-owner');
      if (newAct) {
        actionBtn = newAct?.action;
      }
    }
    return actionBtn;
  }, [bucketStepperData]);


  console.log(getActionButton, '****getActionButton');
  console.log(bucketStepperData, '****bucketStepperData');


  const { data, isLoading } = useGetDetailBeneficialOwner({
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

  const { data: debtorDocumentStatus } = useGetParameterList('apDebtorDocumentStatus');

  const handleCloseEdit = () => {
    const benefitPath = `/${path?.split('/')?.slice(1, 6)?.join('/')}`;
    router.replace(benefitPath);
  };

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

  const { mutate: saveBeneficialOwner, isPending: isSaveBeneficialLoading } = useSaveBeneficialOwner({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['beneficial-owner']});
      showNiceModalV2({
        onClose: handleCloseEdit,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

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
    handleCloseEdit,
    initialSectionFormat,
    isApdb,
    isBusinessCheck,
    isLoading,
    isSaveBeneficialLoading,
    isWordEditorEmpty,
    ownerId,
    router,
    setAssessmentContainer,
    setDpopRadioButton,
    setIsBusinessCheck,
    setIsWordEditorEmpty,
    setVerificationContainer,
    verificationContainer,
    viewOnly,
  };
};

export default useDetailBeneficialOwner;
