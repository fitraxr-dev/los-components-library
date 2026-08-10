import { useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';


const schema = yup.object({
  activeRecords: yup.number().required('Active Records is required').min(0, 'Active Records must be positive'),
  category: yup.string().required('Category is required'),
  inactiveRecords: yup.number().required('Inactive Records is required').min(0, 'Inactive Records must be positive'),
  lastUpdated: yup.string().required('Last Updated is required'),
  totalRecords: yup.number().required('Total Records is required').min(0, 'Total Records must be positive'),
});

type FormData = yup.InferType<typeof schema>;

const useAddNewSummary = () => {
  const { recordActivity } = useRecordLog();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      activeRecords: 0,
      category: '',
      inactiveRecords: 0,
      lastUpdated: '',
      totalRecords: 0,
    },
    resolver: yupResolver(schema),
  });

  const onSave = (callback: (data: FormData) => void) => {
    return handleSubmit((data: FormData) => {
      // Record save activity
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: '',
        changeAfter: JSON.stringify(data),
        changeBefore: '',
        menuCode: 'parameter-mapping-bar',
        module: 'parameter-mapping-bar',
        process: '',
        remarks: 'Add New Summary',
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

export default useAddNewSummary;
