import React from 'react';

import { Tooltip, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import { ellipsis } from '@/helpers/string';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { ReminderItemProps } from './ReminderItem.types';


function formatDateTime(dateStr?: string) {
  if (!dateStr) return { jam: '-', tanggal: '-' };

  const jsDate = new Date(dateStr); // langsung parse ISO string

  if (isNaN(jsDate.getTime())) {
    return { jam: '-', tanggal: '-' }; // antisipasi kalau tidak valid
  }

  // Format tanggal → dd/MM/yyyy
  const tanggal = jsDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Format jam → HH:mm:ss
  const jam = jsDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  });

  return { jam, tanggal };
}


const ReminderItem = (props: ReminderItemProps) => {
  const { rmName, debtorName, status, time, title, date } = props;
  const theme = useTheme();
  const path = usePathname();
  const lastPath = getLastPath(path);

  const { tanggal, jam } = formatDateTime(date);

  const isDetail: boolean = lastPath === 'notification-detail';

  return (
    <RowWrapper
      sx={{
        alignItems: 'center',
        border: 1,
        borderColor: theme.palette.primary.light,
        borderRadius: theme.spacing(1),
        gap: theme.spacing(4),
        justifyContent: 'space-between',
        padding: theme.spacing(1),
      }}
    >
      <RowWrapper
        sx={{
          alignItems: 'flex-start',
          gap: theme.spacing(2),
        }}
      >
        <Icon
          iconName="bell"
          sx={{
            fontSize: theme.spacing(4),
          }}
        />
        <ColumnWrapper
          sx={{
            flexGrow: isDetail ? 1 : 0,
            gap: theme.spacing(1),
            width: isDetail ? theme.spacing(35) : theme.spacing(15),
          }}
        >
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.primary.main}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'wrap',
            }}
          >
            <Tooltip title={title} arrow disableHoverListener={isDetail && title.length <= 30}>
              <span>{isDetail ? title : ellipsis(title, 10)}</span>
            </Tooltip>
          </TextStyle>
        </ColumnWrapper>
        <TextStyle
          variant="body5"
          color={theme.palette.primary.main}
        >
          <Tooltip title={debtorName} arrow>
            <span>{isDetail ? debtorName : ellipsis(debtorName, 15)}</span>
          </Tooltip>
        </TextStyle>
      </RowWrapper>
      <ColumnWrapper
        sx={{
          alignItems: 'flex-end',
          gap: theme.spacing(1),
        }}
      >
        <TextStyle
          variant="body5"
          color={theme.palette.primary.main}
        >
          {tanggal}
        </TextStyle>
        <TextStyle
          variant="body5"
          color={theme.palette.primary.main}
        >
          {jam}
        </TextStyle>
      </ColumnWrapper>
    </RowWrapper>
  );
};

export default ReminderItem;
