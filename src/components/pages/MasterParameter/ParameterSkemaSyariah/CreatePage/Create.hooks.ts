import { useForm } from 'react-hook-form';


export const useCreate = () => {
  const { control, handleSubmit: handleSubmitForm, formState: { errors, isDirty, isValid } } = useForm({
    mode: 'onChange',
  });

  return {
    control,
  };
};
