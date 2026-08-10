import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import type { RequestTypeSectionProps } from './RequestTypeSection.types';


const RequestTypeSection = (props: RequestTypeSectionProps) => {
  const { viewOnly, radioList, sxOptions, control } = props;
  const theme = useTheme();

  return (
    <Box>
      <TextStyle
        variant="body3"
        color={theme.palette.primary.main}
        weight={600}
      >
        Tipe Permohonan
      </TextStyle>

      <Controller
        control={control}
        name="requestType"
        render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            type="radio"
            radioList={radioList}
            disabled={viewOnly}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={invalid && error?.message}
            sxOptions={{
              ...sxOptions,
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(3, 1fr)',
              mt: 3,
            }}
          />
        )}
      />
    </Box>
  );
};

export default RequestTypeSection;
