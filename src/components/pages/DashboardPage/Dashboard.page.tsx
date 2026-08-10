'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';

import ConfirmationInfo from './components/ConfirmationInfo';
import InquiryData from './components/InquiryData';
import Reminder from './components/Reminder';
import TodoList from './components/TodoList';


const Dashboard = () => {
  const theme = useTheme();
  const [{ currentRole }] = useApp();
  const isSuperAdmin = currentRole?.includes(roles.SUPER_ADMIN);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        width: '100%',
      }}
    >

      <ConfirmationInfo />
      {!isSuperAdmin && (
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: '2fr 1fr',
          }}
        >
          <TodoList />
          <Reminder />
        </Box>
      )}

      <InquiryData />
    </Box>
  );
};

export default Dashboard;
