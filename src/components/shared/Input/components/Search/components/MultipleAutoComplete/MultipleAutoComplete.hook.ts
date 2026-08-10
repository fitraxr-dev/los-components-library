import { useEffect, useState } from 'react';

import useDebounce from '@/hooks/useDebounce';

import type { InputMultipleAutocompleteProps } from './MultipleAutoComplete.types';


const useMultipleAutoComplete = (props: InputMultipleAutocompleteProps) => {
  const { onInputChange = () => {}, dropdownList = [], value = [], disabled, onChange, sortingType = 'increase' } = props;

  const [searchedValue, setSearchedValue] = useState('');
  const [isSearchAll, setIsSearchAll] = useState(false);
  const debouncedValue = useDebounce(searchedValue, 500);

  useEffect(() => {
    onInputChange(debouncedValue);
  }, [debouncedValue]);

  // Tambahan: pastikan semua option unik dan punya value
  const uniqueOptions = dropdownList.filter(
    (opt, i, self) =>
      opt?.value &&
      i === self.findIndex((o) => o?.value === opt?.value)
  );

  // Mapped value disesuaikan dengan uniqueOptions
  const mappedValue =
  value?.length > 0
    ? uniqueOptions.filter((el) => value.includes(String(el.value)))
    : [];

  useEffect(() => {
    if (disabled) {
      onChange([]);
    }
  }, [disabled]);

  const clonedOptions = [...uniqueOptions];
  const selectAllMap = clonedOptions.map((item) => String(item.value));

  useEffect(() => {
    if (selectAllMap.length > 0 && mappedValue.length === selectAllMap.length) {
      setIsSearchAll(true);
    } else {
      setIsSearchAll(false);
    }
  }, [mappedValue, selectAllMap]);

  function handleToggleCheckbox(toggle: boolean) {
    setIsSearchAll((prev) => !prev);

    if (toggle) {
      onChange(selectAllMap as string[]);
    } else {
      onChange([]);
    }
  }

  return {
    handleToggleCheckbox,
    isSearchAll,
    mappedValue,
    searchedValue,
    setIsSearchAll,
    setSearchedValue,
  };
};

export default useMultipleAutoComplete;
