import { useEffect, useRef } from 'react';

import { Description } from '@mui/icons-material';
import { Avatar, Box, styled, useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import RowWrapperForwardRef from '@/components/shared/RowWrapper/RowWrapperForwardRef';
import TextStyle from '@/components/shared/TextStyle';

import type { NotificationItemProps } from './NotificationItem.types';


const colors = [
  '#1abc9c', // turquoise
  '#2ecc71', // green
  '#3498db', // blue
  '#9b59b6', // purple
  // '#34495e', // dark gray
  '#16a085', // teal
  '#27ae60', // dark green
  '#2980b9', // dark blue
  '#8e44ad', // dark purple
  '#2c3e50', // navy
  '#f39c12', // orange
  '#d35400', // dark orange
  '#c0392b', // red
  // '#7f8c8d', // gray
];

function getColorFromChar(char: string) {
  if (!/[A-Z]/i.test(char)) {
    return 'gray';
  }
  const code = char.toUpperCase().charCodeAt(0);
  return colors[code % colors.length];
}

const NotificationItem = (props: NotificationItemProps & { onVisible: (id: number) => void }) => {
  const { id, title, date, time, description, isNew, handleHover, onVisible } = props;
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const firstChar = title?.trim()?.[0]?.toUpperCase() || '?';
  const bgColor = getColorFromChar(firstChar);

  useEffect(() => {
    // console.log('🔍 useEffect jalan untuk id:', id, 'ref:', ref.current);

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log('👀 Observer entries:', entries);
        if (entries[0].isIntersecting) {
          // console.log('✅ Terlihat di viewport:', id);
          onVisible(id); // trigger mark seen
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
      // console.log('📌 Mulai observe:', ref.current);
    } else {
      // console.log('❌ ref.current masih null');
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
        // console.log('🧹 Unobserve:', id);
      }
    };
  }, [id, onVisible]);


  return (
    <RowWrapperForwardRef
      ref={ref}
      sx={{
        '&:hover': {
          backgroundColor: theme.palette.custom.background,
        },
        alignItems: 'center',
        backgroundColor: isNew && theme.palette.custom.background,
        gap: theme.spacing(2),
        justifyContent: 'space-between',
        padding: theme.spacing(2),
      }}
    >
      <RowWrapper
        sx={{
          alignItems: 'flex-start',
          flex: 1,
          gap: theme.spacing(2),
        }}
      >
        {/* Kiri: Avatar + abu */}
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            gap: theme.spacing(2), // isi ruang sisa
            minWidth: 0, // biar ellipsis jalan
          }}
        >
          <Avatar
            alt="Avatar"
            sx={{
              bgcolor: bgColor,
              fontSize: 12,
              height: theme.spacing(3),
              width: theme.spacing(3),
            }}
            sizes="small"
          >
            {firstChar}
          </Avatar>

          <ColumnWrapper
            sx={{
              flex: 1,
              gap: theme.spacing(1),
              minWidth: 0,
            }}
          >
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.primary.main}
              sx={{
                overflow: 'hidden',
                overflowWrap: 'break-word',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {title}
            </TextStyle>

            <TextStyle
              variant="body5"
              color={theme.palette.primary.main}
              sx={{
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {description}
            </TextStyle>
          </ColumnWrapper>
        </Box>

        {/* Kanan: orange */}
        <ColumnWrapper
          sx={{
            alignItems: 'flex-end',
            gap: theme.spacing(1),
          }}
        >
          <TextStyle variant="body5" color={theme.palette.primary.main}>
            {date as string}
          </TextStyle>

          <TextStyle variant="body5" color={theme.palette.primary.main}>
            {time as string}
          </TextStyle>
        </ColumnWrapper>
      </RowWrapper>
    </RowWrapperForwardRef>
  );
};

export default NotificationItem;
