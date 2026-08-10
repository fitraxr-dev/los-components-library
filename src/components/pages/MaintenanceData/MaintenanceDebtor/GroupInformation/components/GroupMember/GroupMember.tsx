import { useMemo, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';

import { fieldListBmpk, fieldListGroup, mockType } from './GroupMember.constant';


const GroupMember = () => {
  const theme = useTheme();
  const { control } = useFormContext();
  const [type, setType] = useState(null);

  const fieldList = useMemo(() => {
    switch (type) {
      case mockType[0].value:
        return fieldListGroup;
      case mockType[1].value:
        return fieldListBmpk;

      default:
        return fieldListGroup;
    }
  }, [type]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Box
        sx={{
          maxWidth: '250px',
        }}
      >
        <Input
          type="dropdown"
          dropdownList={mockType}
          label="Pilih Type"
          onChange={(e) => {
            setType(e);
          }}
          value={type}
        />

      </Box>
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
          {fieldList?.map((val, index) => {
            return (
              <div key={index}>
                <Controller
                  name={`groupMember.${val.id}`}
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label={`${val.label}`}
                      placeholder="Placeholder"
                      type="text"
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                    />
                  }
                />
              </div>
            );
          })}

        </Box>
      </BaseContainer>

    </ColumnWrapper>
  );
};
export default GroupMember;
