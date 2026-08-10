'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import type { FinancingTypeSectionProps } from './FinancingTypeSection.types';


const FinancingTypeSection = (props: FinancingTypeSectionProps) => {
  const theme = useTheme();
  const { viewOnly, radioList, sxOptions, control } = props;

  return (
    <Box>
      <TextStyle
        variant="body3"
        color={theme.palette.primary.main}
        weight={600}
      >
        Tipe Pembiayaan
      </TextStyle>
      <Controller
        control={control}
        name="financingType"
        render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            type="radio"
            radioList={radioList}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={invalid && error?.message}
            disabled={viewOnly}
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

export default FinancingTypeSection;
