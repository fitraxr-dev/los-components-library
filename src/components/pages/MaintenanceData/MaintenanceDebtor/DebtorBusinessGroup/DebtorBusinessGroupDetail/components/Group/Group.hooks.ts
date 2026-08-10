import { useEffect } from 'react';

import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import useViewOnly from '@/hooks/useViewOnly';

import useGetGroupDetail from '../../../hooks/useGetGroupDetail';


const useGroup = () => {

  const { processId, groupId }: {processId: string;groupId: string} = useParams();

  const { data } = useGetGroupDetail({
    debtorId: processId,
    groupId: groupId,
  });

  const { reset, control } = useForm(
    {
      defaultValues: {
        groupType: '',
        id: '',
        isDebtorJoined: true,
        modifiedBy: 0,
        modifiedDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        name: '',
        sector: '',
      },
    }
  );

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  return {
    control,
  };
};

export default useGroup;
