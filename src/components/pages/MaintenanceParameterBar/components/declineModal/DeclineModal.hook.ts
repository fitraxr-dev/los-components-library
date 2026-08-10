import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';


const schema = yup.object({
  comment: yup.string().required('Comment is required'),
});

type FormData = yup.InferType<typeof schema>;

const useDeclineModal = () => {
  const { recordActivity } = useRecordLog();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      comment: '',
    },
    resolver: yupResolver(schema),
  });

  const onSave = (callback: (data: FormData) => void) => {
    return handleSubmit((data: FormData) => {
      // Record decline activity
      recordActivity({
        activity: ActivityType.REJECT,
        bucketProcessId: '',
        changeAfter: JSON.stringify(data),
        changeBefore: '',
        menuCode: 'parameter-mapping-bar',
        module: 'parameter-mapping-bar',
        process: '',
        remarks: 'Decline Parameter Mapping Bar',
      });

      callback(data);
    });
  };

  return {
    control,
    errors,
    onSave,
  };
};

export default useDeclineModal;
