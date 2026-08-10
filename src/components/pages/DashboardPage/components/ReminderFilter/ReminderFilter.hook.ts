import { useState } from 'react';

import useGetParameterList from '@/hooks/services/useGetParameterList';


const useReminderFilter = ({
  localValue,
  onChangeValue,
}) => {
  const [open, setOpen] = useState(null);
  const { data: sortByOptions } = useGetParameterList('sortByBar', { label: 'value1', value: 'value2' });

  const setLocalValue = (e) => {
    console.log(e);
    onChangeValue({
      ...localValue,
      filter: {
        ...e.searchDetail,
      },
    });
  };

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const contentList = [
    {
      endKey: 'endDate',
      label: 'Periode Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
  ];


  return {
    contentList,
    handleClick,
    handleClose,
    open,
    setLocalValue,
  };
};
export default useReminderFilter;
