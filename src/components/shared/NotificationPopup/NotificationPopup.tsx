import React, { useState } from 'react';

import { Badge, Box, Menu, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NOTIFICATION_DETAIL } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';

import useNotificationList from '@/components/pages/DashboardPage/components/Notification/Notification.hook';
import NotificationItem from '@/components/pages/DashboardPage/components/NotificationItem';

import Button from '../Button';
import ColumnWrapper from '../ColumnWrapper';
import EmptyPlaceholder from '../EmptyPlaceholder';
import IconButton from '../IconButton';
import RowWrapper from '../RowWrapper';
import TextStyle from '../TextStyle';
import Title from '../Title';

import NotificationItemPopup from './components/NotificationItemPopup';
import useNotificationPopup from './NotificationPopup.hook';


const NotificationPopup = ({
  // data,
}) => {
  const theme = useTheme();

  const { data, setIsClickedPopup, unseenCount } = useNotificationList();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openDetail = replacePath(NOTIFICATION_DETAIL, {});
  const path = usePathname();
  const lastPath = getLastPath(path);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsClickedPopup(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsClickedPopup(false);
  };

  // hitung langsung unread dari data
  const countIsNew = data.reduce((n, item) => n + Number(item.isNew), 0);

  // baca dari localStorage
  const stored = localStorage.getItem('notificationCount');

  // kalau localStorage belum ada (null) → fallback ke countIsNew
  // kalau sudah ada (termasuk 0) → pakai storedCount
  const unreadCount = unseenCount ?? 0;

  const renderNew = unreadCount > 0 ? `(${unreadCount} New)` : '';
  const isDetail: boolean = lastPath === 'notification-detail';

  return (
    <>
      <Badge
        badgeContent=""
        color="error"
        variant="dot"
        invisible={unreadCount === 0}
        sx={{
          '& .MuiBadge-badge': {
            right: 6,
            top: 2,
          },
        }}
      >
        <IconButton
          iconName="notification"
          onClick={handleClick}
          sx={{ ml: theme.spacing(0), mr: theme.spacing(0) }}
          sxIcon={{
            path: {
              stroke: theme.palette.common.white,
            },
          }}
        />
      </Badge>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <ColumnWrapper sx={{ gap: 1 }} width={theme.spacing(60)} height={theme.spacing(60)} overflow="auto">
          <Title
            sx={{ padding: 2 }}
            title={`Notification ${renderNew}`}
          />

          {data.length > 0 ? (
            <Box>
              {data.slice(0, 5).map((item, index) => (
                <NotificationItemPopup {...item} key={index} />
              ))}
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
              <EmptyPlaceholder status="notification" />
            </Box>
          )}
        </ColumnWrapper>
        {data.length > 0 && !isDetail && (
          <RowWrapper
            sx={{
              alignItems: 'center',
              borderTop: 2,
              borderTopColor: theme.palette.custom.blueGray,
              justifyContent: 'end',
              paddingX: 2,
              py: 1,
            }}
          >
            <Link href={openDetail}>
              <Button sx={{ padding: 0 }} variant="text" onClick={handleClose}>
                {'Lihat Semua >'}
              </Button>
            </Link>
          </RowWrapper>
        )}
      </Menu>
    </>
  );
};

export default NotificationPopup;
