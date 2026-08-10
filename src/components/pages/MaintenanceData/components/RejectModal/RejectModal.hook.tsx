import { useContext } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';


export const useRejectModal = ({ modalId }: {modalId: string}, props: any) => {

  const { processId } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);

  //   const { isPending: isSaveLoading, mutate: saveOfferingLetter } = useSaveOfferingLetter({
  //     onSuccess: () => {
  //       // Reset dirty state
  //       setDirtyMsg(undefined);
  //       closeNiceModal(modal.MODAL_ADD_OL);

  //       // Show modal
  //       showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
  //     },
  //   });

  const handleOnSave = (data) => {
    // saveOfferingLetter({
    //   bucketProcessId: processId as string,
    //   module: TypeModule.SPFP,
    //   nameOL: data?.nameOL,
    //   process: TypeProcess.SPFP,
    // });
  };

  return {
    handleOnSave,
    isSaveLoading: false, // dummy
  };
};
