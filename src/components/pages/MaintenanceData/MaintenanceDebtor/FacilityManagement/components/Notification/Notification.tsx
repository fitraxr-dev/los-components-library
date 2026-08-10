import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import { fieldList } from './Notification.constant';


const Notification = () => {
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
          {fieldList.map((val, index) => {
            return (
              <div key={index}>
                <Controller
                  name={`notification.${val.id}`}
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label={val.label}
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

export default Notification;
