'use client';
import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import ComingSoonIcon from '@/public/icons/coming-soon.svg';
import EmptyDefaultIcon from '@/public/icons/empty-default.svg';
import EmptyReminderIcon from '@/public/icons/empty-reminder.svg';
import EmptyTaskIcon from '@/public/icons/empty-task.svg';
import SearchNotFoundIcon from '@/public/icons/search-not-found.svg';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { EmptyPlaceholderProps } from './types';


const EmptyPlaceholder = ({
  status,
  imageOnly,
  customTitle,
}: EmptyPlaceholderProps) => {
  const theme = useTheme();

  const content = useMemo(() => {
    switch (status) {
      case 'compare-empty':
        return {
          Icon: EmptyTaskIcon,
          description:
            'You can compare the two divisions and see the results here.',
          iconName: 'empty-task',
          title: 'No results for this yet',
        };
      case 'coming-soon':
        return {
          Icon: ComingSoonIcon,
          description:
            'Sorry, this feature is not available yet',
          iconName: 'coming-soon',
          title: 'Coming Soon',
        };
      case 'reminder':
        return {
          Icon: EmptyReminderIcon,
          description: 'You dont have more reminders to review',
          iconName: 'empty-reminder',
          title: 'No Reminders Yet',
        };
      case 'task':
        return {
          Icon: EmptyTaskIcon,
          description: 'You dont have any active task right now',
          iconName: 'empty-task',
          title: 'Your task list is empty',
        };
      case 'data':
        return {
          Icon: SearchNotFoundIcon,
          description: 'Sorry, there are no results for this search, please try another phase.',
          iconName: 'search-not-found',
          title: 'No Result Found',
        };
      case 'notification':
        return {
          Icon: EmptyTaskIcon,
          description: 'You dont have any notification right now',
          iconName: 'empty-task',
          title: 'No Notification Yet',
        };
      default:
        return {
          Icon: EmptyDefaultIcon,
          description:
            'Sorry, there are no results for this search, please try another phase.',
          iconName: 'empty-default',
          title: 'No Result Found',
        };
    }
  }, [status]);

  const IconComponent = content.Icon;

  return (
    <ColumnWrapper sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent
        style={{
          height: theme.spacing(20),
          width: theme.spacing(20),
        }}
      />
      {!imageOnly && (
        <>
          <TextStyle variant="body2" weight={700} color={theme.palette.custom.pc50}>
            {customTitle || content.title}
          </TextStyle>
          {!customTitle && (
            <TextStyle variant="body6" weight={300} color={theme.palette.custom.pc50}>
              {content.description}
            </TextStyle>
          )}
        </>
      )}
    </ColumnWrapper>
  );
};

export default EmptyPlaceholder;
