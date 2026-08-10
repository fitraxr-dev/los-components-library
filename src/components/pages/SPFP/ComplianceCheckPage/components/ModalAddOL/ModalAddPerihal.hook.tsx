import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal } from '../../ComplianceCheck.constants';
import useSaveComplianceCheck from '../../hooks/useSaveComplianceCheck';

import type { ModalAddProps } from './ModalAddPerihal.types';
import type { TypeModule, TypeProcess } from '@/enums/Module';


export const useAddPerihalModal = (props: ModalAddProps) => {

  const { isPending: isSaveLoading, mutate: saveComplianceCheck } = useSaveComplianceCheck({
    onSuccess: () => {
      closeNiceModal(modal.MODAL_ADD_PERIHAL);
      // Show modal
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleOnSave = (data) => {
    saveComplianceCheck({
      bucketProcessId: props.bucketProcessId as string,
      complianceTitle: data?.perihal,
      module: props.module as TypeModule,
      process: props.process as TypeProcess,
    });
  };

  return {
    handleOnSave,
    isSaveLoading,
  };
};
