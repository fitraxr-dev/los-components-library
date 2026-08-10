import React from 'react';

import { useTheme } from '@mui/material';

import { toDateString } from '@/helpers/date';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TodoListItemProps } from './TodoListItem.types';


const TodoListItem = (props: TodoListItemProps) => {
  const { date, subject, title, onClick } = props;

  const theme = useTheme();

  return (
    <RowWrapper
      sx={{
        '&:after': {
          backgroundColor: theme.palette.primary.main,
          content: '""',
          height: '100%',
          left: 0,
          position: 'absolute',
          width: theme.spacing(2),
          zIndex: 1,
        },
        alignItems: 'center',

        backgroundColor: theme.palette.custom.background,

        borderRadius: theme.spacing(1),

        display: 'grid',
        gap: theme.spacing(2),
        gridTemplateColumns: '1fr 1fr 1fr auto',
        minHeight: theme.spacing(6),
        overflow: 'hidden',
        padding: theme.spacing(2),
        position: 'relative',
      }}
    >
      {/* Title */}
      <TextStyle
        variant="body4"
        weight={600}
        color={theme.palette.primary.main}
        sx={{
          marginLeft: theme.spacing(4),
          // agar kata panjang dipecah
          whiteSpace: 'normal',
          wordBreak: 'break-word', // memungkinkan multi-line
        }}
      >
        {title}
      </TextStyle>

      {/* Subject */}
      <TextStyle
        variant="body4"
        color={theme.palette.primary.main}
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {subject}
      </TextStyle>

      {/* Date */}
      <TextStyle
        variant="body4"
        color={theme.palette.primary.main}
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {toDateString(date)}
      </TextStyle>

      {/* Button */}
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{
          // biar teks tombol tidak pecah
          minWidth: theme.spacing(10),
          whiteSpace: 'nowrap',
        }}
      >
        Go to task
      </Button>
    </RowWrapper>
  );
};

export default TodoListItem;
