import { useState } from 'react';

import useGetLovUploadBy from '../../hooks/useGetLovUploadBy';
import { STATUS_OPTIONS } from '../../List.constants';


const useListFilter = ({ localValue, onChangeValue }) => {
  const [open, setOpen] = useState(null);

  const { data: uploadByOptions } = useGetLovUploadBy();

  const setLocalValue = (e) => {
    onChangeValue({
      ...localValue,
      filter: {
        ...localValue?.filter,
        ...e,
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
      label: 'Upload Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'uploadBy',
      label: 'Upload By',
      options: uploadByOptions,
      type: 'dropdown',
    },
    {
      key: 'status',
      label: 'Status',
      options: STATUS_OPTIONS,
      type: 'dropdown',
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
