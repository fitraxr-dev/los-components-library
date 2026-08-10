import { useEffect } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';

import { MODALPK } from '../../PK.constants';

import useGetMappingNumber from './hooks/useGetMappingNumber';
import { formData, formValidation } from './SubmissionDraftModal.form';

import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


const useSubmissionDraftModal = () => {
  const modalId = MODALPK.NEW_PROCESSING_TYPE;
  const { visible } = useModal(modalId);
  const { processId } = useIdentity();
  const queryClient = useQueryClient();

  const {
    masintonForm,
    masintonChange,
    masintonValidation,
    masintonMultiChange,
  } = useMasintonForm(formData, formValidation);

  const {
    agreementType: { value: agreementType },
    agreementMapping: { value: agreementMapping },
  } = masintonForm;

  const isDisabled = agreementType === '' ? true : false;

  const { mutate: registerBucket, isPending: isLoading } = useRegisterBucket({
    onError: () => {
      showNiceModal('error', 'Terjadi kesalahan, Silakan coba lagi');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pk-processing-type-list', { bucketProcessId: processId }]});
      closeNiceModal(modalId);
      showNiceModal('success', 'Penambahan PK/Adendum berhasil');
    },
  });

  const { mutate: getData, data, isPending: isLoadingMappingPk } = useGetMappingNumber({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {},
  });
  const arrData = data;

  useEffect(() => {
    const payload = {
      agreementType: agreementType,
      bucketParentId: processId,
    };
    getData(payload);
  }, [agreementType]);

  const optionMappingPkAdendum = arrData?.map((number) => ({
    label: number.toString(),
    value: number,
  })) || [];

  const handleSave = () => {

    if (!masintonValidation()) return; // validate input

    const payload: BucketCreateRequestDto = {
      additionalData: {
        agreementMapping: agreementMapping,
        agreementType: agreementType,
      },
      bucketProcessId: processId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    };
    registerBucket(payload);
  };

  const handleClose = () => {
    closeNiceModal(modalId);
  };

  return {
    handleClose,
    handleSave,
    isDisabled,
    isLoading,
    isLoadingMappingPk,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    optionMappingPkAdendum,
    visible,
  };
};

export default useSubmissionDraftModal;
