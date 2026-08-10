'use client';

import { useState } from 'react';

import useGetDirektorat from '@/hooks/services/overview/useGetDirektorat';
import useGetDivision from '@/hooks/services/overview/useGetDivision';


const useFilterCompare = ({ filterValues, onFilterChange, watchDirektorat }) => {
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [direktoratSearchValue, setDirektoratSearchValue] = useState('');

  // Fetch Direktorat
  const { data: direktoratRes = []} = useGetDirektorat({
    value: direktoratSearchValue,
  });

  const direktoratOptions = (direktoratRes?.contents ?? []).map((d) => ({
    id: d.key,
    label: d.label,
  }));

  const { data: divisionsRes = []} = useGetDivision({
    directorate: watchDirektorat,
    value: divisionSearchValue,
  });

  const divisionOptions = (divisionsRes?.contents ?? []).map((d) => ({
    id: d.key,
    label: d.label,
  }));

  const handleFilterApply = (data) => {
    const dir = direktoratOptions.find((d) => d.id === data.direktorat);
    const div1 = divisionOptions.find((d) => d.id === data.divisi1);
    const div2 = divisionOptions.find((d) => d.id === data.divisi2);

    onFilterChange({
      direktorat: data.direktorat || '',
      direktoratLabel: dir?.label || '',

      divisi1: data.divisi1 || '',
      divisi1Label: div1?.label || '',

      divisi2: data.divisi2 || '',
      divisi2Label: div2?.label || '',
    });
  };

  const handleFilterReset = () => {
    onFilterChange({ direktorat: '', divisi1: '', divisi2: '' });
  };

  return {
    direktoratOptions,
    divisionOptions,
    handleFilterApply,
    handleFilterReset,
  };
};

export default useFilterCompare;
