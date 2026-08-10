'use client';

import { useEffect } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

import { roles } from '@/configs/constants';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';


import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Toggle from '@/components/shared/Input/components/Toggle';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { useMaintenanceReminderContext } from '../../MaintenanceReminder.context';
import { RadioButtonReminder } from '../RadioButtonReminder/RadioButtonReminder';


type TableInformationProps = {
  action: string;
};

export const TableInformation: React.FC<TableInformationProps> = ({ action }) => {
// const TableInformation = ({ disabledForm: boolean }) => {

  const theme = useTheme();
  const { control, watch } = useFormContext();

  // context untuk mengirim props value radiobutton reminder
  const { isReminderActive, setIsReminderActive } = useMaintenanceReminderContext();
  const radioValue = watch('tableGroup.isActiveReminder');
  useEffect(() => {
    if (radioValue !== undefined && radioValue !== isReminderActive) {
      setIsReminderActive(radioValue);
    }
  }, [radioValue, setIsReminderActive]);

  // context untuk mengirim props value Reminder Type
  const { reminderType, setReminderType } = useMaintenanceReminderContext();
  const reminderTypeValue = watch('tableGroup.templateType');
  useEffect(() => {
    if (reminderTypeValue !== undefined && reminderTypeValue !== reminderType) {
      setReminderType(reminderTypeValue);
    }
  }, [reminderTypeValue, setReminderType]);

  // context untuk mengirim props value Reminder Type
  const { activeType, setActiveType } = useMaintenanceReminderContext();
  const activeTypeValue = watch('tableGroup.isActive');
  useEffect(() => {
    if (activeTypeValue !== undefined && activeTypeValue !== activeType) {
      setActiveType(activeTypeValue);
    }
  }, [activeTypeValue, setActiveType]);

  // flag flow
  const searchParams = useSearchParams();
  const flow = searchParams.get('flow');


  return (
    <>
      <ColumnWrapper
        sx={{
          boxShadow: 0,
          gap: theme.spacing(3),
          maxWidth: '100%',
          my: theme.spacing(3),
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
            disabled={action === 'detail' || action === 'edit' || action === 'detail-from-approval'}
            name="tableGroup.templateType"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Input Reminder Type"
                type="text"
                label="Reminder Type"
                // value="test"
              />
            )}
          />

          <Controller
            control={control}
            disabled={action === 'detail' || action === 'edit' || action === 'detail-from-approval'}
            name="tableGroup.isActive"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Input Active / Non Active"
                type="text"
                label="Active / Non Active"
                // value="test"
              />
            )}
          />

          <ColumnWrapper gap={1}>
            <Typography variant="body2" sx={{ color: action === 'detail' ? 'text.disabled' : 'inherit' }}>Aktifkan Reminder</Typography>
            <Controller
              control={control}
              name="tableGroup.isActiveReminder"
              render={({ field }) => (
                <Toggle
                  value={field.value}
                  onChange={field.onChange}
                  trueLabel="Ya"
                  falseLabel="Tidak"
                  disabled={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
                />
              )}
            />
          </ColumnWrapper>
        </Box>
      </ColumnWrapper>
    </>
  );
};

export default TableInformation;
