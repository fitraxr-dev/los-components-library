import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';


import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailRiskIdentification from '../hooks/useGetDetailRiskIdentification';
import useSaveRiskIdentification from '../hooks/useSaveRiskIdentification';


const useEditRiskIdentification = () => {
  const { id } = useParams();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [riskDescriptionContainer, setRiskDescriptionContainer] = useState(null);
  const [riskMitigationContainer, setRiskMitigationContainer] = useState(null);
  const [businessResponseContainer, setBusinessResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    businessResponse: true,
  });

  const { data, isLoading: isDetailRiskIdentificationLoading } = useGetDetailRiskIdentification({
    id: Number(id),
  });

  const detailRiskIdentification = data || {};

  const { mutate: saveRiskIdentification, isPending: isSaveLoading } = useSaveRiskIdentification({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      setDirtyMsg(undefined);
      router.push(replacePath(mup.LEGAL_AND_COMPLIANCE_ISSUE_PAGE, { processId }));
    },
  });

  const handleOnSave = async () => {
    const businessResponse = await convertToDocx(businessResponseContainer);

    saveRiskIdentification({
      bucketProcessId: processId,
      businessResponse,
      id: Number(id),
      legalRiskType: detailRiskIdentification?.legalRiskType,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    });
  };

  const handleClickCancel = () => {
    router.push(replacePath(mup.LEGAL_AND_COMPLIANCE_ISSUE_PAGE, { processId }));
  };

  return {
    businessResponseContainer,
    detailRiskIdentification,
    handleClickCancel,
    handleOnSave,
    isDetailRiskIdentificationLoading,
    isSaveLoading,
    isWordEditorEmpty,
    riskDescriptionContainer,
    riskMitigationContainer,
    setBusinessResponseContainer,
    setIsWordEditorEmpty,
    setRiskDescriptionContainer,
    setRiskMitigationContainer,
  };
};

export default useEditRiskIdentification;
