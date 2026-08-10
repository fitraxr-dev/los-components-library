import React from 'react';

import { useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';

import type { RequestTypeSectionProps } from './RequestTypeSection.types';


const RequestTypeSection = (props: RequestTypeSectionProps) => {
  const { viewOnly, radioList, sxOptions, control } = props;
  const theme = useTheme();

  return (
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
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing(2),
            justifyContent: 'space-around',
            mt: 3,
          }}
        />
      )}
    />
  );
};

export default RequestTypeSection;
