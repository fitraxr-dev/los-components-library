import { useState } from 'react';

import useGetAllDebtorByName from '../../hooks/useGetAllDebtorByName';


const useTodoListFilter = ({
  localValue,
  onChangeValue,
}) => {
  console.log(localValue);
  const [open, setOpen] = useState(null);


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
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      type: 'text',
    }
  ];


  return {
    contentList,
    handleClick,
    handleClose,
    open,
    setLocalValue,
  };

};

export default useTodoListFilter;
