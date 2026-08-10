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
import TextStyle from '@/components/shared/TextStyle';

import { useMaintenanceNotificationContext } from '../../MaintenanceNotification.context';
import { RadioButtonNotification } from '../RadioButtonNotification/RadioButtonNotification';


type TableInformationProps = {
  action: string;
};

export const TableInformation: React.FC<TableInformationProps> = ({ action }) => {
// const TableInformation = ({ disabledForm: boolean }) => {

  const theme = useTheme();
  const { control, watch } = useFormContext();

  // context untuk mengirim props value radiobutton notification
  const { isNotificationActive, setIsNotificationActive } = useMaintenanceNotificationContext();
  const radioValue = watch('tableGroup.isActiveNotification');
  useEffect(() => {
    if (radioValue !== undefined && radioValue !== isNotificationActive) {
      setIsNotificationActive(radioValue);
    }
  }, [radioValue, setIsNotificationActive]);

  // context untuk mengirim props value Notification Type
  const { notificationType, setNotificationType } = useMaintenanceNotificationContext();
  const notificationTypeValue = watch('tableGroup.templateType');
  useEffect(() => {
    if (notificationTypeValue !== undefined && notificationTypeValue !== notificationType) {
      setNotificationType(notificationTypeValue);
    }
  }, [notificationTypeValue, setNotificationType]);

  // context untuk mengirim props value Notification Type
  const { activeType, setActiveType } = useMaintenanceNotificationContext();
  const activeTypeValue = watch('tableGroup.isActive');
  useEffect(() => {
    if (activeTypeValue !== undefined && activeTypeValue !== activeType) {
      setActiveType(activeTypeValue);
    }
  }, [activeTypeValue, setActiveType]);

  // useEffect(() => {
  //   console.log('media watch:', watch('tableGroup.media'));
  // }, [watch]);

  // context untuk mengirim props value media
  const { mediaType, setMediaType } = useMaintenanceNotificationContext();

  const mediaValue = watch('tableGroup.media');

  useEffect(() => {
    if (mediaValue !== undefined && mediaValue !== mediaType) {
      setMediaType(mediaValue);
    }
  }, [mediaValue, mediaType, setMediaType]);

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
            disabled={action === 'detail' || action === 'edit' || action === 'detail-from-approval'}
            name="tableGroup.templateType"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Input Notification Type"
                type="text"
                label="Notification Type"
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
              name="tableGroup.isActiveNotification"
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

          <Controller
            name="tableGroup.media"
            control={control}
            // disabled={action === 'detail' || action === 'edit' || action === 'detail-from-approval'}
            render={({ field }) => (
              <Input
                {...field}
                type="checkbox"
                label="Media"
                value={field.value ?? []}
                onChange={(v) => {
                  field.onChange(v);
                }}
                checkboxList={[
                  { label: 'Email', value: 'email' },
                  { label: 'LOS', value: 'los' },
                ]}
                disabled={action === 'detail' || action === 'detail-from-approval' || flow === 'waiting-approval'}
              />
            )}
          />

        </Box>
      </ColumnWrapper>
    </>
  );
};

export default TableInformation;
