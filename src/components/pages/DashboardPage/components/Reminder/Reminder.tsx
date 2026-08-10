import React from 'react';

import { Box, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { mockReminderData } from '@/__mocks__/mockDashboard';
import { NOTIFICATION_DETAIL } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Title from '@/components/shared/Title';

import ReminderFilter from '../ReminderFilter';
import ReminderItem from '../ReminderItem';

import useReminder from './Reminder.hook';


const Reminder = () => {
  const data = mockReminderData;
  const theme = useTheme();
  const openDetail = replacePath(NOTIFICATION_DETAIL, {});
  const path = usePathname();
  const lastPath = getLastPath(path);

  const {
    dataListReminder,
  } = useReminder();

  const reminders = dataListReminder.data || [];

  const isDetail: boolean = lastPath === 'notification-detail';

  const RenderCustom = () => {
    if (reminders.length > 0) {
      if (!isDetail) {
        return (
          <Link href={openDetail}>
            <Button sx={{ padding: 0 }} textWeight={400} variant="text">
              Lihat Semua
            </Button>
          </Link>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <BaseContainer>
      <Title
        title="Reminder"
        customRender={RenderCustom()}
      />

      {reminders.length > 0 ? (
        <Box
          sx={{
            maxHeight: isDetail ? theme.spacing(100) : theme.spacing(44),
            overflow: 'auto',
          }}
        >
          <ColumnWrapper
            sx={{
              gap: theme.spacing(2),
              marginRight: theme.spacing(2),
            }}
          >
            {reminders?.map((item, index) => (
              <ReminderItem
                title={item?.reminderType}
                // rmName={item?.reminderHeader}
                debtorName={item?.reminderSender}
                status="Aging"
                time={item?.aging || 1}
                key={index}
                date={item?.createdDate}
              />
            ))}
          </ColumnWrapper>
        </Box>
      ) : (
        <Box
          sx={{
            alignSelf: 'center',
            display: 'flex',
            flex: 1,
            margin: theme.spacing(4),
          }}
        >
          <EmptyPlaceholder status="reminder" />
        </Box>
      )}
    </BaseContainer>
  );
};

export default Reminder;
