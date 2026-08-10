'use client';


import { useEffect } from 'react';

import { Box, useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import Notification from '../Notification';
import Reminder from '../Reminder';


const Detail = () => {
  const theme = useTheme();

  // Record Activity
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      module: TypeModule.MAINTENANCE_REMINDER,
      process: TypeProcess.MAINTENANCE_REMINDER,
      remarks: 'view dashboard reminder',
    });

    recordActivity({
      activity: ActivityType.VIEW,
      module: TypeModule.MAINTENANCE_NOTIFICATION,
      process: TypeProcess.MAINTENANCE_NOTIFICATION,
      remarks: 'view dashboard notification',
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(2),
        height: '100%',
        width: '100%',
      }}
    >
      <Reminder />
      <Notification />
    </Box>
  );
};
export default Detail;
