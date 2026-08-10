import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailRatingManagement from './hooks/useGetDetailRatingManagement';
import { modal } from './Rating.constants';


export const useRating = () => {
  const { processId } = useIdentity();
  const [supportingContainer, setSupportingContainer] = useState(null);
  const [constrainContainer, setConstrainContainer] = useState(null);
  const [othersContainer, setOthersContainer] = useState(null);

  const { data: detailRatingData } = useGetDetailRatingManagement({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const handleOpenHistoryModal = () => {
    NiceModal.show(modal.HISTORY_RATING);
  };

  return {
    constrainContainer,
    detailRatingData,
    handleOpenHistoryModal,
    othersContainer,
    setConstrainContainer,
    setOthersContainer,
    setSupportingContainer,
    supportingContainer,
  };
};
