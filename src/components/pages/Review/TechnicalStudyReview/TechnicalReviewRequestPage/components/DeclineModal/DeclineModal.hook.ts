import closeNiceModal from '@/hooks/useCloseNiceModal';


export const useDeclineModal = ({ modalId }: {modalId: string}) => {

  const handleOnSave = (data) => {
    closeNiceModal(modalId);
  };

  return {
    handleOnSave,
  };
};
