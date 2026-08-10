'use client';
import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Input from '@/components/shared/Input';

import useGetBusinessGroup from '../../hooks/useGetBusinessGroup';
import useGetBusinessGroupSelected from '../../hooks/useGetBusinessGroupSelected';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useBusinessGroupTable = () => {
  const { processId } = useIdentity();

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '55px',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupTypeLabel',
      label: 'Jenis Group Usaha',
    },
  ];

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroup({
    bucketProcessId: processId,
    module: TypeModule.ENGAGEMENT_AGREEMENT,
    process: TypeProcess.ENGAGEMENT_AGREEMENT,
  });

  const businessGroupListContents = businessGroupListData;

  return {
    businessGroupListContents,
    businessGroupListLoading,
    tableHeader,
  };
};
