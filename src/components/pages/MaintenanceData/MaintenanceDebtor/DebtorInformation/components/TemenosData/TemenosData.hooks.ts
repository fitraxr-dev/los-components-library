import { useForm } from 'react-hook-form';


const useTemenosData = () => {
  const { control } = useForm({});

  return {
    control,
  };
};

export default useTemenosData;
