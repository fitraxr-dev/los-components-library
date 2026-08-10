import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';

import useDebounce from '@/hooks/useDebounce';

import type { SearchProps, SearchValue } from './Search.types';


const useSearch = ({
  hasFilter = false,
  useMinChar = true,
  placeholder = 'Search Something',
  onChange,
  value,
  ...searchProps
}: SearchProps) => {
  const theme = useTheme();
  const HEIGHT = `calc(${theme.typography.body3.fontSize} + ${theme.spacing(
    3
  )})`;

  const [localValue, setLocalValue] = useState<Record<string, any>>(value);
  const [searchValue, setSearchValue] = useState({
    field: '',
    query: '',
  });

  const debouncedValue = useDebounce(searchValue.query, 500);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'popover-filter' : undefined;

  const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchMemo: SearchValue = useMemo(() => {
    let filterToApply = structuredClone(localValue?.filter);
    let sortList = structuredClone(localValue?.filter?.sortList);
    let defaultPayload;
    const filterStatus = [];
    if (filterToApply?.status) {
      filterToApply?.status.forEach((selectedStatus: string) => {
        filterStatus.push(selectedStatus);
      });
    }

    if (filterToApply?.Active) {
      filterToApply?.status.forEach((selectedStatus: string) => {
        filterStatus.push(selectedStatus);
      });
    }

    if (filterToApply && filterStatus.length > 0) {
      filterToApply.status = filterStatus;
    }

    if (filterToApply?.hasOwnProperty('period')) {
      delete filterToApply['period'];
    }

    if (filterToApply?.hasOwnProperty('sortList')) {
      defaultPayload = {
        ...localValue,
        filter: filterToApply,
        sortList,
      };
      delete filterToApply['sortList'];
    } else {
      defaultPayload = {
        ...localValue,
        filter: filterToApply,
      };
    }

    if (useMinChar && debouncedValue.length < 1) {
      defaultPayload = {
        ...defaultPayload,
        filter: filterToApply,
      };
    } else if (useMinChar && debouncedValue.length < 3) {
      return defaultPayload;
    }

    return {
      ...defaultPayload,
      searchDetail: {
        key: searchValue.field,
        value: debouncedValue,
      },
    };
  }, [debouncedValue, localValue, searchValue.field]);

  useEffect(() => {
    onChange(searchMemo);
  }, [searchMemo, onChange]);

  return {
    HEIGHT,
    anchorEl,
    handleClickFilter,
    handleClose,
    id,
    onChange,
    open,
    searchValue,
    setLocalValue,
    setSearchValue,
    theme,
    value,
  };
};

export default useSearch;
