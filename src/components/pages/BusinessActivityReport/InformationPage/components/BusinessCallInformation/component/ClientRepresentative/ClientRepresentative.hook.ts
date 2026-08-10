import { useFieldArray, useFormContext } from 'react-hook-form';

import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useClientRepresentative = () => {

  const { isNew, canEditBAR, canCreateBAR, isBarCreation } = useBarInformation();

  const methods = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'clientRepresentative',
  });

  const handleAddItem = () => {
    append({ name: '', position: null });
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

export default useClientRepresentative;
