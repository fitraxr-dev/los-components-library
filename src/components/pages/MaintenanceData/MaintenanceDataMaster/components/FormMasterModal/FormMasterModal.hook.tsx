import { useState } from 'react';

import useMasintonForm from '@/hooks/useMasintonForm';

import { formData } from './FormMasterModal.form';


export const useFormMasterModal = (props: any) => {
  const {
    process,
    module,
    id,
    title,
    data,
  } = props;

  const {
    masintonForm,
    masintonChange,
    masintonValidation,
    masintonSubmit,
  } = useMasintonForm(formData);

  const {
    lovCode: { value: lovCode },
    lovDescription: { value: lovDescription },
    ariumCode: { value: ariumCode },
    temenosCode: { value: temenosCode },
    active: { value: active },
  } = masintonForm;

  const { data: detail } = data;

  const handleOnSave = (data) => {
    if (!masintonValidation({ ignoreValidation: []})) return;

    const payload = Object.assign(masintonSubmit(), {

    });

  };

  return {
    detail,
    handleOnSave,
    isSaveLoading: false, // dummy
    masintonChange,
    masintonForm,
  };
};

export default useFormMasterModal;
