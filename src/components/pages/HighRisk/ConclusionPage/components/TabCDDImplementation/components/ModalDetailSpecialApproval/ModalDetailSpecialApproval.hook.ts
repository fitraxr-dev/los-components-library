import { useEffect, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveSpecialApprovalType from '../../hooks/useSaveSpecialApprovalType';
import { modal } from '../../TabCDDImplementation.constants';


const useModalDetailSpecialApproval = (props: ModalDetailSpecialApprovalProps) => {
  const { description: descriptionValue, specialNote, typeSpecialApproval, id } = props;
  const { processId } = useIdentity();
  const [inputAreaValues, setInputAreaValues] = useState({
    description: descriptionValue,
    specialNotes: specialNote,
  });
  const [selectedSpecialApproval, setSelectedSpecialApproval] = useState('');

  useEffect(() => {
    if (typeSpecialApproval) {
      setSelectedSpecialApproval(typeSpecialApproval);
    }
  }, []);

  return {
    inputAreaValues,
    selectedSpecialApproval,
    setInputAreaValues,
    setSelectedSpecialApproval,
  };
};

export default useModalDetailSpecialApproval;
