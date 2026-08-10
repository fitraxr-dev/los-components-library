'use client';

import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { roles } from '@/configs/constants';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';


const TableGroupInformation = ({ disabledForm }) => {
  const theme = useTheme();

  const { control, watch } = useFormContext();
  const { data: sectorList } = useGetParameterList('sector');
  const { data: groupTypeList } = useGetParameterList('groupType');
  const isDisabled = disabledForm;

  return (
    <>
      <ColumnWrapper
        sx={{
          boxShadow: 0,
          gap: theme.spacing(3),
          maxWidth: '100%',
          mt: theme.spacing(3),
        }}
        px={3}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.id"
            render={({ field }) => (
              <Input
                {...field}
                disabled
                placeholder="Input ID Group"
                label="ID Group"
              />
            )}
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.name"
            rules={{ required: 'Nama Group wajib diisi' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Input Nama Group"
                type="text"
                label="Nama Group"
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.customerGroupType"
            rules={{ required: 'Jenis Group Customer wajib dipilih' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Choose Jenis Group Customer"
                type="dropdown"
                dropdownList={groupTypeList}
                label="Jenis Group Customer"
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.sector"
            rules={{ required: 'Jenis Group Customer wajib dipilih' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Choose Sektor Industri"
                type="dropdown"
                dropdownList={sectorList}
                label="Sektor Industri"
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.yearFounded"
            rules={{ required: 'Tahun didirikan wajib diisi' }}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                format="YYYY"
                label="Tahun Didirikan"
                placeholder="Tahun Didirikan"
                views={['year']}

                isMandatory
              />
            )
            }
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.isRelatedSmi"
            rules={{ required: 'Terkait Dengan SMI Wajib diplih' }}
            render={({ field }) => (
              <Input
                {...field}
                type="radio"
                radioList={[{ label: 'Ya', value: true }, { label: 'Tidak', value: false }]}
                label="Terkait Dengan SMI"
                isMandatory
              />
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.modifiedBy"
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Modified By"
                placeholder="Modified By"
                disabled
              />
            )
            }
          />

          <Controller
            control={control}
            disabled={isDisabled}
            name="tableGroup.lastModified"
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Last Modified"
                placeholder="Last Modified"
                disabled
              />
            )
            }
          />
        </Box>
      </ColumnWrapper>
    </>
  );
};

export default TableGroupInformation;
