import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { SITEVISIT_PARTY2_SCHEMA } from '../../../shared/constants/schema';

import type { PartySiteVisit } from '../AddNewSiteVisit/AddNewSIteVisit.hook';
import type * as yup from 'yup';


type Form = yup.InferType<typeof SITEVISIT_PARTY2_SCHEMA>

const useAddNewClientParty = (editData?: PartySiteVisit) => {
  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      id: undefined,
      name: undefined,
      position: undefined,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: yupResolver(SITEVISIT_PARTY2_SCHEMA),
    shouldUseNativeValidation: true,
  });

  // Set form values saat edit
  useEffect(() => {
    if (editData) {
      reset({
        id: editData.id || undefined,
        name: editData.name || undefined,
        position: editData.position || undefined,
      });
    } else {
      reset({
        id: undefined,
        name: undefined,
        position: undefined,
      });
    }
  }, [editData, reset]);

  return {
    control,
    onSave: handleSubmit,
  };

};

export default useAddNewClientParty;
