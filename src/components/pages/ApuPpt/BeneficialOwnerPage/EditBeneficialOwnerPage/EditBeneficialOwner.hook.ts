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
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
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

const useEditBeneficialOwner = () => {
  const { currentUserDivision } = useApuPptContext();
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
  const [isBusinessCheck, setIsBusinessCheck] = useState<boolean | undefined>(undefined);
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
  const isDpop = process === TypeProcess.APU_PPT_DPOP;


  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });

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
      queryClient.invalidateQueries({ queryKey: ['beneficial-owner', {
        id: Number(params.id),
      }]});
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
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      document: data.document,
      id: Number(params.id),
      ...(isBusinessCheck !== undefined && isBusinessCheck !== null && { isBusinessCheck }),
      isCopy: dpopRadioButton.isCopy !== null ? dpopRadioButton?.isCopy : undefined,
      isDpopCheck: dpopRadioButton.isDpopCheck !== null ? dpopRadioButton?.isDpopCheck : undefined,
      isPreviousData: false,
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      status: dpopRadioButton.status !== null ? dpopRadioButton?.status : undefined,
      verificationResult: verificationResult,
    };

    saveBeneficialOwner(payload as any);
  };

  const isRequiredInputEmpty =
    (!isDpop && (isBusinessCheck === null && isWordEditorEmpty.assessmentResult)) ||
    (isDpop && (dpopRadioButton.isDpopCheck === null ||
      !dpopRadioButton.status || isWordEditorEmpty.verificationResult));

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
      bucketProcessId: processId,
      debtorId: bucketDetail?.debtorId,
      document: data?.document,
      id: Number(params.id),
      ...(isBusinessCheck !== undefined && isBusinessCheck !== null && { isBusinessCheck }),
      isCopy: dpopRadioButton.isCopy !== null ? dpopRadioButton?.isCopy : undefined,
      isDpopCheck: dpopRadioButton.isDpopCheck !== null ? dpopRadioButton?.isDpopCheck : undefined,
      isPreviousData: false,
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      status: dpopRadioButton.status !== null && dpopRadioButton.status !== '' ? dpopRadioButton?.status : undefined,
      verificationResult: verificationResult,
    };

    return payload;
  }, [
    processId,
    bucketDetail?.debtorId,
    data?.document,
    params.id,
    isBusinessCheck,
    dpopRadioButton,
    isDpop,
    assessmentContainer,
    verificationContainer,
    checkVerification,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly && !isLoading,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveBo',
  });

  return {
    assessmentContainer,
    data,
    debtorDocumentStatus,
    dpopRadioButton,
    getActionButton,
    handleCloseEdit,
    handleOnSave,
    initialSectionFormat,
    isAutoSaveFetching,
    isBusinessCheck,
    isDpop,
    isLoading,
    isRequiredInputEmpty,
    isSaveBeneficialLoading,
    isWordEditorEmpty,
    ownerId,
    setAssessmentContainer,
    setDpopRadioButton,
    setIsBusinessCheck,
    setIsWordEditorEmpty,
    setVerificationContainer,
    verificationContainer,
    viewOnly,
  };
};

export default useEditBeneficialOwner;
