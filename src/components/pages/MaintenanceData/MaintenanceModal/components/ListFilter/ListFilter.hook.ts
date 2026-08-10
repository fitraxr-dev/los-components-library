import { useState } from 'react';


const useListFilter = ({
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
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: [],
      type: 'sort',
    },
    {
      endKey: 'capitalPositionEndDate',
      label: 'Tanggal Posisi Modal',
      startKey: 'capitalPositionStartDate',
      type: 'period',
    },
    {
      endKey: 'lastModifiedEndDate',
      label: 'Last Modified',
      startKey: 'lastModifiedStartDate',
      type: 'period',
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

export default useListFilter;
