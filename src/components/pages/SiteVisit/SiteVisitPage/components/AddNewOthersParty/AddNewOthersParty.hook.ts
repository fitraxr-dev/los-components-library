import { useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { PartySiteVisit } from '../AddNewSiteVisit/AddNewSIteVisit.hook';
import type * as yupType from 'yup';

// Schema khusus untuk Pihak Lainnya
const OTHERS_PARTY_SCHEMA = yup.object().shape({
  id: yup.number().nullable(),
  instance: yup.string().nullable(),
  name: yup.string().nullable(),
  position: yup.string().nullable(),
});

type Form = yupType.InferType<typeof OTHERS_PARTY_SCHEMA>

const useAddNewOthersParty = (editData?: PartySiteVisit) => {
  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      id: undefined,
      instance: undefined,
      name: undefined,
      position: undefined,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: yupResolver(OTHERS_PARTY_SCHEMA),
    shouldUseNativeValidation: true,
  });

  // Set form values saat edit
  useEffect(() => {
    if (editData) {
      reset({
        id: editData.id || undefined,
        instance: editData.instance || undefined,
        name: editData.name || undefined,
        position: editData.position || undefined,
      });
    } else {
      reset({
        id: undefined,
        instance: undefined,
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

export default useAddNewOthersParty;
