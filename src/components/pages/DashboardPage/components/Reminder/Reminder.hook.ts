import { useState } from 'react';

import useGetListReminders from '@/hooks/services/reminder-notification/useGetListReminder';
import useApp from '@/hooks/useApp';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';


const useReminder = () => {
  const [filter, setFilter] = useState<SearchValue>({});

  const [state] = useApp();
  const userId = state.userData?.user?.userId || '';
  const dataListReminder = useGetListReminders(userId);

  return {
    dataListReminder,
    filter,
    setFilter,
  };
};
export default useReminder;
