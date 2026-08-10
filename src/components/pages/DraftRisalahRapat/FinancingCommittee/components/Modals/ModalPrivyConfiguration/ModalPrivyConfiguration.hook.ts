import * as React from 'react';

import { useShallow } from 'zustand/react/shallow';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import useGetPrivySigners from './hooks/useGetPrivySigners';
import useSubmitPrivyWithSigners from './hooks/useSubmitPrivyWithSigners';
import useModalPrivyConfigurationStore from './ModalPrivyConfiguration.store';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { DragEndEvent } from '@dnd-kit/core';


interface UseModalPrivyConfigurationProps {
  bucketProcessId: string;
  documentId: number;
  module: TypeModule;
  process: TypeProcess;
}

const useModalPrivyConfiguration = ({
  bucketProcessId,
  documentId,
  module,
  process,
}: UseModalPrivyConfigurationProps) => {
  const {
    hydrateSigner,
    reorderSigner,
    reset,
    selectedMethod,
    setSelectedMethod,
    signers,
  } = useModalPrivyConfigurationStore(
    useShallow((state) => ({
      hydrateSigner: state.hydrateSigner,
      reorderSigner: state.reorderSigner,
      reset: state.reset,
      selectedMethod: state.selectedMethod,
      setSelectedMethod: state.setSelectedMethod,
      signers: state.signers,
    }))
  );

  const { data: signersData, isLoading: isSignersLoading } = useGetPrivySigners({
    bucketProcessId,
    module,
    process,
  }, {
    select: (data) => {
      const contents = data?.contents ?? [];
      return contents.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    },
  });

  React.useEffect(() => {
    if (!signersData?.length) {
      reset();
      return;
    }

    hydrateSigner(signersData);
  }, [signersData, hydrateSigner, reset]);

  const signerIds = React.useMemo(() => (
    signers.map((item) => item.localId)
  ), [signers]);

  const handleOnDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    reorderSigner(active.id, over.id);
  }, [reorderSigner]);

  const { mutate: submitPrivy, isPending: isSubmitLoading } = useSubmitPrivyWithSigners({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dikirim ke Privy',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.RISALAH_RAPAT.PRIVY_CONFIGURATION);
      closeNiceModal(MODAL.RISALAH_RAPAT.SIGN_DOCUMENT);

      showNiceModalV2({
        title: 'Data Sudah Berhasil Dikirim ke Privy',
        type: 'success',
      });
    },
  });

  const handleSendToPrivy = React.useCallback(() => {
    if (!selectedMethod) return;

    const payload: any = {
      bucketProcessId,
      documentId,
      module,
      process,
      signProcess: selectedMethod,
    };

    if (selectedMethod === 'Serial') {
      const formattedSigners = signers.map((signer, index) => {
        const { localId, ...rest } = signer;
        return {
          ...rest,
          sequence: index + 1,
        };
      });

      payload.signers = formattedSigners;
    } else {
      payload.signers = [];
    }

    submitPrivy(payload);
  }, [selectedMethod, signers, bucketProcessId, documentId, module, process, submitPrivy]);

  return {
    handleOnDragEnd,
    handleSendToPrivy,
    isLoading: isSignersLoading || isSubmitLoading,
    selectedMethod,
    setSelectedMethod,
    signerIds,
    signers,
  };
};

export default useModalPrivyConfiguration;
