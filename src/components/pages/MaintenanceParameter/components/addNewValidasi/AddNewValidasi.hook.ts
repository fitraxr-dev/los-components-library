import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


const schema = yup.object({
  notes: yup.string().required('Notes is required'),
  parameterName: yup.string().required('Parameter Name is required'),
  status: yup.string().required('Status is required'),
  validatedBy: yup.string().required('Validated By is required'),
  validatedDate: yup.string().required('Validated Date is required'),
});

type FormData = yup.InferType<typeof schema>;

const useAddNewValidasi = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      notes: '',
      parameterName: '',
      status: '',
      validatedBy: '',
      validatedDate: '',
    },
    resolver: yupResolver(schema),
  });

  const onSave = (callback: (data: FormData) => void) => {
    return handleSubmit(callback);
  };

  return {
    control,
    errors,
    onSave,
  };
};

export default useAddNewValidasi;
