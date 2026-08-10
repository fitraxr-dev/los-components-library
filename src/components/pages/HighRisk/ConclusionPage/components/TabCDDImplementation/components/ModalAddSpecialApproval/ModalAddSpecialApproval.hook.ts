import { useEffect, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveSpecialApprovalType from '../../hooks/useSaveSpecialApprovalType';
import { modal } from '../../TabCDDImplementation.constants';


const useModalAddSpecialApproval = (props: ModalAddSpecialApprovalProps) => {
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

  const { mutate: saveSpecialApproval, isPending: isSaveLoading } = useSaveSpecialApprovalType({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },

    onSuccess: () => {
      closeNiceModal(modal.ADD_SPECIAL_APPROVAL);

      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = () => {
    saveSpecialApproval({
      bucketProcessId: processId,
      description: inputAreaValues.description,
      id: id ? Number(id) : null,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      specialNote: selectedSpecialApproval === 'OTHERS' ? inputAreaValues.specialNotes : null,
      type: selectedSpecialApproval === 'OTHERS' ? 'OTHER' : 'NON_OTHERS',
      typeSpecialApproval: selectedSpecialApproval,
    });
  };

  return {
    handleOnSave,
    inputAreaValues,
    isSaveLoading,
    selectedSpecialApproval,
    setInputAreaValues,
    setSelectedSpecialApproval,
  };
};

export default useModalAddSpecialApproval;
