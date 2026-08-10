import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useGroupDetail from './Group.hooks';


const GroupDetail = () => {
  const theme = useTheme();

  const { control } = useGroupDetail();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Group" />

      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="id"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="ID Group"
                placeholder="ID Group"
                type="text"
              />
            }
          />

          <Controller
            name="sector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="Sektor Industri"
                placeholder="Sektor Industri"
                type="dropdown"
                dropdownList={[]}
              />
            }
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="Nama Group"
                placeholder="Nama Group"
                type="text"
              />
            }
          />

          <Controller
            name="modifiedDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="Last Modified"
                placeholder="Last Modified"
                type="date"
              />
            }
          />

          <Controller
            name="groupType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="Jenis Group"
                placeholder="Jenis Group"
                type="dropdown"
                dropdownList={[]}
              />
            }
          />

          <Controller
            name="modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled
                label="Modified By"
                placeholder="Modified By"
                type="text"
              />
            }
          />
        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default GroupDetail;
