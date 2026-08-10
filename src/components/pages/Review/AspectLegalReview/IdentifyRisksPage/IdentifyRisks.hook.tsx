import { useEffect, useState } from 'react';


import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';


import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import useIdentifyRisksDetail from './hooks/useIdentifyRisksDetail';
import useIdentifyRisksSave from './hooks/useIdentifyRisksSave';
import { IDENTIFYRISKS_INITIAL_VALUES, validation } from './IdentifyRisks.constants';


export const useIdentifyRisks = () => {
  const params = useParams();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const isEdit = Boolean(params?.id);
  const queryClient = useQueryClient();
  const [containerDes, setContainerDes] = useState(null);
  const [containerMit, setContainerMit] = useState(null);
  const { data: typeRisksList } = useGetParameterList(Modules.IDENTIFY_RISKS, { label: 'value1', value: 'key' });
  const { mutate: mutateDetail, data: identifyDetail, isPending: isLoading } = useIdentifyRisksDetail({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: (data) => {
      masintonMultiChange({
        otherRisk: data?.otherLegalRiskType,
        valueTypeRisks: data?.legalRiskType,
      });
    },
  });
  const { mutate: mutateSave, isPending: isSaveLoading } = useIdentifyRisksSave({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' }),
    onSuccess: () => {
      masintonReset();
      queryClient.invalidateQueries({ queryKey: ['identify-legal-risks-list', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({ onClose: onSuccessSave, type: 'success' });
    },
  });

  const onSuccessSave = () => {
    setContainerDes(null);
    setContainerMit(null);
    router.back();
  };

  const {
    masintonForm,
    masintonChange,
    masintonValidation,
    masintonMultiChange,
    masintonReset,
  } = useMasintonForm(IDENTIFYRISKS_INITIAL_VALUES, validation);
  const {
    otherRisk: { value: otherRisk },
    valueTypeRisks: { value: valueTypeRisks },
  } = masintonForm;

  const getDetailIdentifyRisk = () => {
    mutateDetail({
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DH,
    });
  };
  useEffect(() => {
    if (isEdit) {
      getDetailIdentifyRisk();
    }
  }, [params]);

  const handleSave = async (fileDesc, fileMitigation) => {
    const descWord = await convertToDocx(fileDesc);
    const descMitigationWord = await convertToDocx(fileMitigation);
    const ignoreValidation = [];
    if (valueTypeRisks !== 'OTHER_RISK_DEPI') {
      ignoreValidation.push('otherRisk');

    }
    if (!masintonValidation({ ignoreValidation })) return;

    let payload = {
      bucketProcessId: processId,
      id: params?.id && Number(params?.id),
      legalRiskType: valueTypeRisks,
      module: TypeModule.MIP_REVIEW,
      otherLegalRiskType: otherRisk,
      process: TypeProcess.REVIEWER_DH,
      riskDescription: descWord,
      riskMitigation: descMitigationWord,
    };

    if (!isEdit) delete payload.id;
    mutateSave(payload);
  };

  const handleCancel = () => {
    setContainerDes(null);
    setContainerMit(null);
    router.back();
  };

  return {
    containerDes,
    containerMit,
    handleCancel,
    handleSave,
    identifyDetail,
    isLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    setContainerDes,
    setContainerMit,
    typeRisksList,
    valueTypeRisks,
  };
};
