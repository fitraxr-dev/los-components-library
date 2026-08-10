'use client';
import React, { useEffect } from 'react';

import Autocomplete from '@/components/shared/Autocomplete';

import type { InputAutocompleteProps } from './InputAutocomplete.types';


const InputAutocomplete = ({
  label,
  onChange,
  onInputChange,
  value,
  disabled,
  isLoading,
  dropdownList,
}: InputAutocompleteProps) => {

  useEffect(() => {
    if (disabled) {
      onChange({
        id: null,
        label: null,
      });
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

export default InputAutocomplete;
