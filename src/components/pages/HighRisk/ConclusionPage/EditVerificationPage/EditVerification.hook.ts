import { useContext, useEffect, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailCustomerDue from './hooks/useGetDetailCustomerDue';
import useSaveBeneficialOwner from './hooks/useSaveCustomerDue';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


interface FormData {
  dkConfirmation: boolean | null;
  dkDescription: string;
}

const useEditVerification = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const params = useParams();
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [assessmentContainer, setAssessmentContainer] = useState<DocumentEditorContainerComponent | null>(null);
  const [verificationContainer, setVerificationContainer] = useState<DocumentEditorContainerComponent | null>(null);
  const [dkContainer, setDkContainer] = useState<DocumentEditorContainerComponent | null>(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    dkDescription: true,
  });

  const { data: { debtorId } } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const form = useForm<FormData>({
    defaultValues: {
      dkConfirmation: null,
      dkDescription: '',
    },
    mode: 'onChange',
  });

  const { reset } = form;
  const conclusionPath = pathname.split('/').splice(0, 6).join('/');

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isSuccess: isDetailSuccess,
  } = useGetDetailCustomerDue({ id: Number(params.id) });

  useEffect(() => {
    if (isDetailSuccess && detailData) {
      reset({
        dkConfirmation: detailData.isDkCheck ?? null,
        dkDescription: detailData.confirmationResult ? 'filled' : '',
      });
    }
  }, [detailData, isDetailSuccess, reset]);

  const handleCancel = () => {
    router.push(replacePath(conclusionPath, { processId }));
  };

  const { mutate: saveBeneficialOwner, isPending: isSaveBeneficialLoading } = useSaveBeneficialOwner({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: handleCancel,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = async (data: FormData) => {
    try {
      console.log('[HIGH RISK] Data: ', data);
      const assessment = await convertToDocx(assessmentContainer);
      const verification = await convertToDocx(verificationContainer);
      const confirmation = await convertToDocx(dkContainer);

      saveBeneficialOwner({
        assessmentResult: assessment,
        assessmentSummary: detailData?.assessmentSummary === null ? false : detailData?.assessmentSummary,
        bucketProcessId: processId,
        confirmationResult: confirmation,
        debtorId: debtorId,
        document: detailData?.document,
        id: Number(params.id),
        isDkCheck: data.dkConfirmation === null ? false : data.dkConfirmation,
        module: TypeModule.HIGH_RISK,
        process: TypeProcess.HIGH_RISK_DK,
        verificationResult: verification,
        verificationSummary: detailData?.verificationSummary === null ? false : detailData?.verificationSummary,
      });
    } catch (error) {
      showNiceModalV2({
        title: 'Error processing form data',
        type: 'error',
      });
    }
  };

  const isValid = form.formState.isValid && !isWordEditorEmpty.dkDescription;

  return {
    assessmentContainer,
    detailData,
    dkContainer,
    form,
    handleCancel,
    handleOnSave,
    isDetailLoading,
    isSaveBeneficialLoading,
    isValid,
    isWordEditorEmpty,
    setAssessmentContainer,
    setDkContainer,
    setIsWordEditorEmpty,
    setVerificationContainer,
    verificationContainer,
  };
};

export default useEditVerification;
