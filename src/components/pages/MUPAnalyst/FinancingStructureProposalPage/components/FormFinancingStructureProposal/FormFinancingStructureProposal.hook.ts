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

import useGetDetailFinancingStructureProposal from '../../hooks/useGetDetailFinancingStructureProposal';
import useSaveFinancingStructureProposal from '../../hooks/useSaveFinancingStructureProposal';


const useFormFinancingStructureProposal = () => {
  const { id } = useParams();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState(null);

  const { data: detailProposal, isLoading: isDetailProposalLoading } = useGetDetailFinancingStructureProposal({
    id: Number(id),
  });

  const { mutate, isPending: isSaveLoading } = useSaveFinancingStructureProposal({
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
      router.push(replacePath(mup.FINANCING_STRUCTURE_PROPOSAL_PAGE, { processId }));
    },
  });

  const handleOnSave = async (data) => {
    const description = await convertToDocx(container);
    mutate({
      bucketProcessId: processId,
      description,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      title: data.title,
      ...(id ? { id: Number(id) } : {}),
    });
  };

  const handleCancel = () => {
    router.push(replacePath(mup.FINANCING_STRUCTURE_PROPOSAL_PAGE, { processId }));
  };

  return {
    container,
    detailProposal,
    handleCancel,
    handleOnSave,
    isDetailProposalLoading,
    isSaveLoading,
    setContainer,
  };
};

export default useFormFinancingStructureProposal;
