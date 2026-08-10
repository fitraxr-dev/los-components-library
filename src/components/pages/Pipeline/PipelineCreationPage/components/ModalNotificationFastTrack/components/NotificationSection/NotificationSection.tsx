'use client';
import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import SectionTitle from '@/components/shared/SectionTitle';

import useNotificationSection from './NotificationSection.hook';

import type { NotificationSectionProps } from './NotificationSection.types';


const NotificationSection = ({ division, name, title }: NotificationSectionProps) => {
  const theme = useTheme();
  const { control } = useFormContext();

  const { isLoading, setKeyword, staffOptions } = useNotificationSection(division);

  return (
    <SectionTitle title={title} isOpen>
      <Box sx={{ mb: theme.spacing(3), mt: theme.spacing(3) }}>
        <Controller
          control={control}
          name={name}
          render={({ field: { ref, ...field } }) => (
            <MultipleAutoComplete
              {...field}
              label="Nama Staff"
              placeholder="Choose Staff"
              isMandatory
              isLoading={isLoading}
              dropdownList={staffOptions}
              onInputChange={setKeyword}
              withSelectAll={false}
            />
          )}
        />
      </Box>
    </SectionTitle>
  );
};

export default NotificationSection;
