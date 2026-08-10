import { useEffect, useRef } from 'react';

import { status } from '../../TableAccessMenu.constants';

import type { CustomCheckboxProps } from './CustomCheckbox.types';


const useCustomCheckbox = (props: CustomCheckboxProps) => {
  const { indeterminate, checked, id, compute } = props;
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef?.current) {
      checkboxRef.current.checked = checked || false;
      checkboxRef.current.indeterminate = indeterminate || false;
    }
  }, [checked, indeterminate]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    checkboxRef.current.checked = event.target.checked;
    checkboxRef.current.indeterminate = false;

    const newStatus = checkboxRef.current?.checked
      ? status.checked
      : status.unchecked;

    compute(id, newStatus);
  };

  return {
    checkboxRef,
    handleOnChange,
  };
};

export default useCustomCheckbox;
