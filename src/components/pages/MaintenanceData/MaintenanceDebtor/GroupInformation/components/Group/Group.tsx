import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';


const Group = () => {
  const theme = useTheme();
  const { control } = useFormContext();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
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
            name="group.groupId"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="ID Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="group.groupName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="group.groupType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jenis Group"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="group.industrialSector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Sektor Industri"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="group.modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Modified By"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />

          <Controller
            name="group.lastModified"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Last Modified"
                placeholder="Placeholder"
                type="text"
                onValueChange={(values) => {
                  field.onChange(values.value);
                }}
              />
            }
          />
        </Box>
      </BaseContainer>

    </ColumnWrapper>
  );
};
export default Group;
