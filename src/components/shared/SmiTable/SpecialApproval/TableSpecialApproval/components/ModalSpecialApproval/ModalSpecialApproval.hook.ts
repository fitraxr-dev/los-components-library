import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveSpecialApproval from '../../hooks/useSaveSpecialApproval';
import { modal } from '../../TableSpecialApproval.constants';

import type { FormData, ModalSpecialApprovalProps } from './ModalSpecialApproval.types';


const useModalSpecialApproval = (props: ModalSpecialApprovalProps) => {
  const { initialValues, module, process } = props;
  const { processId } = useIdentity();
  const modalId = modal.SPECIAL_APPROVAL;

  const { data: specialApprovalOptions } = useGetParameterList ('specialApproval');

  const { isPending: isSaveLoading, mutate } = useSaveSpecialApproval({
    onError: () => showNiceModalV2({ title: 'Terjadi kesalahan silahkan coba kembali.', type: 'error' }),
    onSuccess: () => {
      closeNiceModal(modalId).then(() => showNiceModalV2({ type: 'success' }));
    },
  });

  const handleOnConfirm = (data: FormData) => {
    mutate({
      bucketProcessId: processId,
      description: data.description ?? null,
      id: initialValues ? initialValues.id : null,
      module: module,
      process: process,
      specialNote: data.specialNote,
      type: 'NON_OTHERS',
      typeSpecialApproval: data.typeSpecialApproval,
    });
  };

  return {
    handleOnConfirm,
    isSaveLoading,
    specialApprovalOptions,
  };
};

export default useModalSpecialApproval;
