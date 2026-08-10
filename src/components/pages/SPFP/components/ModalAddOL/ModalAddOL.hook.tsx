import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import useSaveOfferingLetter from './hooks/useSaveOfferingLetter';

import type { ModalAddProps } from './ModalAddOL.types';


export const useAddOLModal = (props: ModalAddProps) => {

  const { isPending: isSaveLoading, mutate: saveOfferingLetter } = useSaveOfferingLetter({
    onSuccess: () => {
      closeNiceModal(modal.MODAL_ADD_OL);
      // Show modal
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleOnSave = (data) => {
    const basePayload = {
      bucketProcessId: props.bucketProcessId,
      module: props.module,
      nameOL: data?.nameOL,
      noDraft: data?.noDraft || props.editData?.noDraft,
      process: props.process,
    };
    saveOfferingLetter(basePayload);
  };

  return {
    handleOnSave,
    isSaveLoading,
  };
};
