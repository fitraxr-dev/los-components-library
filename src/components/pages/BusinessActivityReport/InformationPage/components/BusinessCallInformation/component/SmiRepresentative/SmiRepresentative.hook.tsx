import { useFieldArray, useFormContext } from 'react-hook-form';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useSmiRepresentative = () => {
  const { isNew, canCreateBAR, canEditBAR, isBarCreation } = useBarInformation();

  const methods = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'smiRepresentative',
  });

  const handleAddItem = () => {
    append({
      division: null,
      person: null,
      position: null,
    });
  };

  const handleDeleteItem = (index: number) => {
    remove(index);
  };

  return {
    append,
    canCreateBAR,
    canEditBAR,
    fields,
    handleAddItem,
    handleDeleteItem,
    isBarCreation,
    isNew,
    methods,
    remove,
  };
};

export default useSmiRepresentative;
