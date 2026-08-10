import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { DPOP_DIVISION } from '@/configs/constants';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import { documentTypeQs } from '../DebtorDocument.constants';
import useGetDetailDebtorDocument from '../hooks/useGetDetailDebtorDocument';
import useSaveDebtorDocument from '../hooks/useSaveDebtorDocument';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


type DpopRadioButton = {
  isCopy: boolean | null;
  isDpopCheck: boolean | null;
  status: string;
}

const useEditDebtorDocument = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentUserDivision } = useApuPptContext();
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { process } = useApuPpt();
  const path = usePathname();
  const [assessmentContainer, setAssessmentContainer] = useState<DocumentEditorContainerComponent>(null);
  const [verificationContainer, setVerificationContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isBusinessCheck, setIsBusinessCheck] = useState<boolean | undefined>(undefined);
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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );


  const handleCloseEdit = () => {
    const url = '/loan-processing/apu-ppt/[module]/[processId]/debtor-document';
    const pathModule = path.split('/')[3];
    const urlBack = replacePath(url, { module: pathModule, processId });
    router.replace(urlBack);
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

  const { mutate: saveDebtorDocument, isPending: isSaveLoading } = useSaveDebtorDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
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
    const verificationResult = checkVerification ?
      undefined : await convertToDocx(verificationContainer);
    const assessmentResult = await convertToDocx(assessmentContainer);

    const payload = {
      assessmentResult: assessmentResult,
      bucketProcessId: processId,
      document: data?.document,
      documentDebtorType: data?.documentDebtorType,
      id: Number(params.id),
      ...(isBusinessCheck !== undefined && isBusinessCheck !== null && { isBusinessCheck }),
      isCopy: dpopRadioButton.isCopy !== null ? dpopRadioButton?.isCopy : undefined,
      isDpopCheck: dpopRadioButton.isDpopCheck !== null ? dpopRadioButton?.isDpopCheck : undefined,
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      status: dpopRadioButton.status !== null ? dpopRadioButton?.status : undefined,
      verificationResult: verificationResult,
    };
    saveDebtorDocument(payload);
  };

  const isRequiredInputEmpty =
    (!isDpop && (isBusinessCheck === undefined || isWordEditorEmpty.assessmentResult)) ||
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

    const verificationResult = checkVerification ?
      undefined : await convertToDocx(verificationContainer);
    const assessmentResult = await convertToDocx(assessmentContainer);

    const payload = {
      assessmentResult: assessmentResult,
      bucketProcessId: processId,
      document: data?.document,
      documentDebtorType: data?.documentDebtorType,
      id: Number(params.id),
      ...(isBusinessCheck !== undefined && isBusinessCheck !== null && { isBusinessCheck }),
      isCopy: dpopRadioButton.isCopy !== null ? dpopRadioButton?.isCopy : undefined,
      isDpopCheck: dpopRadioButton.isDpopCheck !== null ? dpopRadioButton?.isDpopCheck : undefined,
      module: TypeModule.APU_PPT,
      process: isDpop ? TypeProcess.APU_PPT_DPOP : TypeProcess.APU_PPT,
      status: dpopRadioButton.status !== null ? dpopRadioButton?.status : undefined,
      verificationResult: verificationResult,
    };

    return Promise.resolve(payload);
  }, [
    assessmentContainer,
    verificationContainer,
    isBusinessCheck,
    dpopRadioButton,
    checkVerification,
    processId,
    data,
    params.id,
    isDpop
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
    url: 'mip.apuppt.saveDoc',
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
    isSaveLoading,
    isWordEditorEmpty,
    ownerId,
    setAssessmentContainer,
    setDpopRadioButton,
    setIsBusinessCheck,
    setIsWordEditorEmpty,
    setVerificationContainer,
    type,
    verificationContainer,
    viewOnly,
  };
};

export default useEditDebtorDocument;
