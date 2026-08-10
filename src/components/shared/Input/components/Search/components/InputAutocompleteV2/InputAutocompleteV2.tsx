'use client';
import React, { useEffect } from 'react';

import Autocomplete from '@/components/shared/Autocomplete';

import type { InputAutocompleteV2Props } from './InputAutocompleteV2.types';


const InputAutocompleteV2 = ({
  label,
  onChange,
  onInputChange,
  value,
  disabled,
  isLoading,
  dropdownList,
}: InputAutocompleteV2Props) => {

  useEffect(() => {
    if (disabled) {
      onChange(null);
    }
  }, [disabled]);

  return (
    <Autocomplete
      key={label}
      disabled={disabled}
      label={label}
      isLoading={isLoading}
      dropdownList={dropdownList}
      onChange={onChange}
      onInputChange={onInputChange}
      value={value}
      placeholder="Search..."
    />
  );
};

export default InputAutocompleteV2;
