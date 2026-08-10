'use-client';
import { useContext, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useViewOnly from '@/hooks/useViewOnly';

import useGetRiskProfileDetail from './hooks/useGetRiskProfileDetail';
import useRiskProfileSave from './hooks/useRiskProfileSave';
import { IDENTIFYRISKS_INITIAL_VALUES, validation } from './riskProfileConstants';


export const useRiskProfileDetail = () => {
  const params = useParams();
  const router = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useIdentity();
  const isEdit = Boolean(params?.id);
  const queryClient = useQueryClient();
  const { viewOnly } = useViewOnly();

  const [containerDescription, setContainerDes] = useState(null);
  const [containerMitigation, setContainerMit] = useState(null);
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

  /*** Start Get Parameter List */
  const { data: typeRisksList } = useGetParameterList(Modules.PROFILE_RISKS, { label: 'value1', value: 'key' });
  /*** End Get ParameterList */

  const { mutate: mutateDetail, data: contentRiskProfileDetail, isPending: isLoading } = useGetRiskProfileDetail({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: (data) => {
      masintonMultiChange({
        otherRisk: data?.otherRiskType,
        valueTypeRisks: data?.riskType,
      });
    },
  });

  const { mutate: saveRiskProfile, isPending: isSaveLoading } = useRiskProfileSave({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan coba lagi.', type: 'error' });
    },
    onSuccess: () => {
      masintonReset();
      showNiceModalV2({
        onClose: () => handleBack(),
        title: 'Risiko profil berhasil disimpan.',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['identify-risk-depi', { bucketProcessId: processId }]});
    },
  });

  const handleBack = () => {
    setContainerDes(null);
    setContainerMit(null);
    router.back();
  };

  const getDetailRiskProfile = async () => {
    await mutateDetail({
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DEPI,
    });
  };

  useEffect(() => {
    if (isEdit) {
      getDetailRiskProfile();
    }
  }, [params]);

  const handleSave = async (fileDescription, fileMitigation) => {
    const MINIMUM_SIZE = 3164;
    const descriptionRiskDoc = await convertToDocx(fileDescription);
    const mitigationRiskDoc = await convertToDocx(fileMitigation);
    const ignoreValidation = [];
    if (valueTypeRisks !== 'OTHER_RISK_DEPI') {
      ignoreValidation.push('otherRisk');

    }
    if (!masintonValidation({ ignoreValidation })) return;
    let payload = {
      bucketProcessId: processId,
      description: descriptionRiskDoc,
      id: params?.id && Number(params?.id),
      mitigation: mitigationRiskDoc,
      module: TypeModule.MIP_REVIEW,
      otherRiskType: otherRisk,
      process: TypeProcess.REVIEWER_DEPI,
      riskType: valueTypeRisks,
    };

    if (descriptionRiskDoc.size < MINIMUM_SIZE || mitigationRiskDoc.size < MINIMUM_SIZE) {
      showNiceModalV2({
        title: 'Dokumen tidak boleh kosong',
        type: 'error',
      });
      return null;
    }

    if (!isEdit) delete payload.id;
    saveRiskProfile(payload);
    setDirtyMsg(undefined);
  };

  const handleCancel = () => {
    setContainerDes(null);
    setContainerMit(null);
    router.back();
  };

  return {
    containerDescription,
    containerMitigation,
    contentRiskProfileDetail,
    handleBack,
    handleCancel,
    handleSave,
    isLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setContainerDes,
    setContainerMit,
    typeRisksList,
    valueTypeRisks,
    viewOnly,
  };
};
